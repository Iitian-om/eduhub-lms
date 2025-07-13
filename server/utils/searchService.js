import OpenAI from 'openai';
import EdXScraper from './scrapers/edxScraper.js';
import GeeksforGeeksScraper from './scrapers/geeksforgeeksScraper.js';
import SwayamScraper from './scrapers/swayamScraper.js';
import NodeCache from 'node-cache';

class SearchService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        
        this.edxScraper = new EdXScraper();
        this.gfgScraper = new GeeksforGeeksScraper();
        this.swayamScraper = new SwayamScraper();
        
        // Cache results for 1 hour
        this.cache = new NodeCache({ stdTTL: 3600 });
    }

    async searchCourses(query, filters = {}, limit = 7) {
        try {
            // Check cache first
            const cacheKey = `search_${query}_${JSON.stringify(filters)}_${limit}`;
            const cachedResults = this.cache.get(cacheKey);
            if (cachedResults) {
                return cachedResults;
            }

            // Use OpenAI to enhance search query
            const enhancedQuery = await this.enhanceSearchQuery(query);
            
            // Search all platforms in parallel
            const searchPromises = [
                this.edxScraper.searchCourses(enhancedQuery, Math.ceil(limit / 3)),
                this.gfgScraper.searchCourses(enhancedQuery, Math.ceil(limit / 3)),
                this.swayamScraper.searchCourses(enhancedQuery, Math.ceil(limit / 3))
            ];

            const [edxResults, gfgResults, swayamResults] = await Promise.allSettled(searchPromises);
            
            // Combine results
            let allCourses = [];
            
            if (edxResults.status === 'fulfilled') {
                allCourses = allCourses.concat(edxResults.value);
            }
            
            if (gfgResults.status === 'fulfilled') {
                allCourses = allCourses.concat(gfgResults.value);
            }
            
            if (swayamResults.status === 'fulfilled') {
                allCourses = allCourses.concat(swayamResults.value);
            }

            // Apply filters
            let filteredCourses = this.applyFilters(allCourses, filters);
            
            // Use OpenAI to rank and recommend courses
            const rankedCourses = await this.rankCourses(filteredCourses, query, limit);
            
            // Cache results
            this.cache.set(cacheKey, rankedCourses);
            
            return rankedCourses;

        } catch (error) {
            console.error('Error in searchCourses:', error);
            return [];
        }
    }

    async enhanceSearchQuery(query) {
        try {
            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant that enhances search queries for online courses. Return only the enhanced search terms, nothing else."
                    },
                    {
                        role: "user",
                        content: `Enhance this search query for finding online courses: "${query}". Add relevant keywords that would help find better courses.`
                    }
                ],
                max_tokens: 50,
                temperature: 0.3
            });

            return completion.choices[0].message.content.trim();
        } catch (error) {
            console.error('Error enhancing search query:', error);
            return query; // Return original query if enhancement fails
        }
    }

    async rankCourses(courses, originalQuery, limit) {
        try {
            if (courses.length === 0) return [];

            const courseData = courses.map(course => ({
                title: course.title,
                description: course.description,
                instructor: course.instructor,
                platform: course.platform,
                price: course.price,
                rating: course.rating,
                level: course.level
            }));

            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert at ranking online courses. Given a list of courses and a search query, rank them by relevance and quality. Return only the indices of the top courses in order of preference, separated by commas."
                    },
                    {
                        role: "user",
                        content: `Search query: "${originalQuery}"\n\nCourses:\n${courseData.map((course, index) => `${index}: ${course.title} (${course.platform}) - ${course.instructor}`).join('\n')}\n\nRank the top ${limit} courses by relevance and quality. Return only the indices separated by commas.`
                    }
                ],
                max_tokens: 50,
                temperature: 0.2
            });

            const rankedIndices = completion.choices[0].message.content
                .split(',')
                .map(index => parseInt(index.trim()))
                .filter(index => !isNaN(index) && index >= 0 && index < courses.length);

            // Return ranked courses
            const rankedCourses = rankedIndices.map(index => courses[index]);
            
            // Add any remaining courses if we don't have enough ranked ones
            const remainingIndices = Array.from({ length: courses.length }, (_, i) => i)
                .filter(i => !rankedIndices.includes(i));
            
            rankedCourses.push(...remainingIndices.map(index => courses[index]));

            return rankedCourses.slice(0, limit);

        } catch (error) {
            console.error('Error ranking courses:', error);
            return courses.slice(0, limit); // Return first N courses if ranking fails
        }
    }

    applyFilters(courses, filters) {
        let filteredCourses = [...courses];

        // Filter by price
        if (filters.maxPrice) {
            filteredCourses = filteredCourses.filter(course => {
                const price = course.price.toLowerCase();
                if (price === 'free') return true;
                const priceNum = parseFloat(price.replace(/[^0-9.]/g, ''));
                return !isNaN(priceNum) && priceNum <= filters.maxPrice;
            });
        }

        // Filter by platform
        if (filters.platforms && filters.platforms.length > 0) {
            filteredCourses = filteredCourses.filter(course => 
                filters.platforms.includes(course.platform)
            );
        }

        // Filter by level
        if (filters.level) {
            filteredCourses = filteredCourses.filter(course => 
                course.level && course.level.toLowerCase().includes(filters.level.toLowerCase())
            );
        }

        // Filter by duration
        if (filters.maxDuration) {
            filteredCourses = filteredCourses.filter(course => {
                const duration = course.duration;
                if (duration === 'N/A') return true;
                // Simple duration parsing (can be enhanced)
                const hours = parseInt(duration.match(/(\d+)/)?.[1] || '0');
                return hours <= filters.maxDuration;
            });
        }

        // Filter by language
        if (filters.language) {
            filteredCourses = filteredCourses.filter(course => 
                course.language && course.language.toLowerCase().includes(filters.language.toLowerCase())
            );
        }

        return filteredCourses;
    }

    async getCourseRecommendations(userProfile, limit = 7) {
        try {
            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert at recommending online courses based on user profiles and preferences."
                    },
                    {
                        role: "user",
                        content: `Based on this user profile, suggest ${limit} course search queries:\n\nUser Profile: ${JSON.stringify(userProfile)}\n\nReturn only the search queries, one per line.`
                    }
                ],
                max_tokens: 200,
                temperature: 0.7
            });

            const searchQueries = completion.choices[0].message.content
                .split('\n')
                .map(query => query.trim())
                .filter(query => query.length > 0)
                .slice(0, 3); // Take top 3 queries

            // Search for each recommended query
            const recommendationPromises = searchQueries.map(query => 
                this.searchCourses(query, {}, Math.ceil(limit / searchQueries.length))
            );

            const results = await Promise.allSettled(recommendationPromises);
            
            // Combine and deduplicate results
            const allRecommendations = results
                .filter(result => result.status === 'fulfilled')
                .flatMap(result => result.value);

            // Remove duplicates based on title and platform
            const uniqueRecommendations = allRecommendations.filter((course, index, self) =>
                index === self.findIndex(c => 
                    c.title === course.title && c.platform === course.platform
                )
            );

            return uniqueRecommendations.slice(0, limit);

        } catch (error) {
            console.error('Error getting course recommendations:', error);
            return [];
        }
    }

    async getCourseInsights(courseData) {
        try {
            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert at analyzing online courses and providing insights."
                    },
                    {
                        role: "user",
                        content: `Analyze this course and provide insights:\n\n${JSON.stringify(courseData, null, 2)}\n\nProvide a brief analysis including pros, cons, and who this course is best for.`
                    }
                ],
                max_tokens: 300,
                temperature: 0.5
            });

            return completion.choices[0].message.content;

        } catch (error) {
            console.error('Error getting course insights:', error);
            return 'Analysis not available.';
        }
    }

    // Get available platforms
    getAvailablePlatforms() {
        return [
            {
                name: 'edX',
                description: 'High-quality courses from top universities',
                url: 'https://www.edx.org'
            },
            {
                name: 'GeeksforGeeks',
                description: 'Programming and computer science courses',
                url: 'https://www.geeksforgeeks.org'
            },
            {
                name: 'SWAYAM',
                description: 'Indian government online learning platform',
                url: 'https://swayam.gov.in'
            }
        ];
    }
}

export default SearchService; 