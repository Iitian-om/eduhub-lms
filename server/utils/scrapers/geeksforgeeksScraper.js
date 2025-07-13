import puppeteer from 'puppeteer';
import axios from 'axios';

class GeeksforGeeksScraper {
    constructor() {
        this.baseUrl = 'https://www.geeksforgeeks.org';
        this.searchUrl = 'https://practice.geeksforgeeks.org/courses';
    }

    async searchCourses(query, limit = 7) {
        try {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();
            
            // Set user agent to avoid detection
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            
            // Navigate to courses page
            await page.goto(this.searchUrl, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            // Wait for course cards to load
            await page.waitForSelector('.course-card, .card, [class*="course"]', { timeout: 10000 });

            // Extract course data
            const courses = await page.evaluate((searchQuery, maxLimit) => {
                const courseCards = document.querySelectorAll('.course-card, .card, [class*="course"]');
                const results = [];

                for (let i = 0; i < Math.min(courseCards.length, maxLimit); i++) {
                    const card = courseCards[i];
                    
                    try {
                        const titleElement = card.querySelector('h3, h4, .course-title, .title');
                        const title = titleElement ? titleElement.textContent.trim() : 'N/A';
                        
                        // Filter courses based on search query if provided
                        if (searchQuery && !title.toLowerCase().includes(searchQuery.toLowerCase())) {
                            continue;
                        }
                        
                        const instructorElement = card.querySelector('.instructor, .author, .teacher');
                        const instructor = instructorElement ? instructorElement.textContent.trim() : 'GeeksforGeeks';
                        
                        const priceElement = card.querySelector('.price, .cost, .fee');
                        const price = priceElement ? priceElement.textContent.trim() : 'Free';
                        
                        const ratingElement = card.querySelector('.rating, .stars');
                        const rating = ratingElement ? ratingElement.textContent.trim() : 'N/A';
                        
                        const durationElement = card.querySelector('.duration, .time, .length');
                        const duration = durationElement ? durationElement.textContent.trim() : 'N/A';
                        
                        const imageElement = card.querySelector('img');
                        const image = imageElement ? imageElement.src : '';
                        
                        const linkElement = card.querySelector('a');
                        const link = linkElement ? linkElement.href : '';
                        
                        const descriptionElement = card.querySelector('.description, .desc, .summary');
                        const description = descriptionElement ? descriptionElement.textContent.trim() : 'N/A';

                        const levelElement = card.querySelector('.level, .difficulty');
                        const level = levelElement ? levelElement.textContent.trim() : 'Beginner';

                        results.push({
                            title,
                            instructor,
                            price,
                            rating,
                            duration,
                            image,
                            link,
                            description,
                            level,
                            platform: 'GeeksforGeeks',
                            source: 'geeksforgeeks.org'
                        });
                    } catch (error) {
                        console.error('Error parsing course card:', error);
                    }
                }

                return results;
            }, query, limit);

            await browser.close();
            return courses;

        } catch (error) {
            console.error('Error scraping GeeksforGeeks:', error);
            return [];
        }
    }

    async getCourseDetails(courseUrl) {
        try {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            
            await page.goto(courseUrl, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            const courseDetails = await page.evaluate(() => {
                const title = document.querySelector('h1, .course-title')?.textContent.trim() || 'N/A';
                const description = document.querySelector('.course-description, .description, .desc')?.textContent.trim() || 'N/A';
                const instructor = document.querySelector('.instructor, .author')?.textContent.trim() || 'GeeksforGeeks';
                const price = document.querySelector('.price, .cost')?.textContent.trim() || 'Free';
                const duration = document.querySelector('.duration, .time')?.textContent.trim() || 'N/A';
                const level = document.querySelector('.level, .difficulty')?.textContent.trim() || 'Beginner';
                const language = document.querySelector('.language')?.textContent.trim() || 'English';
                const rating = document.querySelector('.rating')?.textContent.trim() || 'N/A';
                const enrollment = document.querySelector('.enrollment, .students')?.textContent.trim() || 'N/A';

                return {
                    title,
                    description,
                    instructor,
                    price,
                    duration,
                    level,
                    language,
                    rating,
                    enrollment,
                    platform: 'GeeksforGeeks',
                    source: 'geeksforgeeks.org'
                };
            });

            await browser.close();
            return courseDetails;

        } catch (error) {
            console.error('Error getting GeeksforGeeks course details:', error);
            return null;
        }
    }

    // Special method for GFG practice problems and tutorials
    async searchTutorials(query, limit = 7) {
        try {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            
            // Search in tutorials section
            await page.goto(`https://www.geeksforgeeks.org/search?q=${encodeURIComponent(query)}`, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            const tutorials = await page.evaluate((maxLimit) => {
                const articles = document.querySelectorAll('article, .article, .tutorial');
                const results = [];

                for (let i = 0; i < Math.min(articles.length, maxLimit); i++) {
                    const article = articles[i];
                    
                    try {
                        const titleElement = article.querySelector('h2, h3, .title');
                        const title = titleElement ? titleElement.textContent.trim() : 'N/A';
                        
                        const authorElement = article.querySelector('.author, .writer');
                        const author = authorElement ? authorElement.textContent.trim() : 'GeeksforGeeks';
                        
                        const linkElement = article.querySelector('a');
                        const link = linkElement ? linkElement.href : '';
                        
                        const descriptionElement = article.querySelector('.excerpt, .summary');
                        const description = descriptionElement ? descriptionElement.textContent.trim() : 'N/A';

                        results.push({
                            title,
                            instructor: author,
                            price: 'Free',
                            rating: 'N/A',
                            duration: 'N/A',
                            image: '',
                            link,
                            description,
                            level: 'All Levels',
                            platform: 'GeeksforGeeks',
                            source: 'geeksforgeeks.org',
                            type: 'tutorial'
                        });
                    } catch (error) {
                        console.error('Error parsing tutorial:', error);
                    }
                }

                return results;
            }, limit);

            await browser.close();
            return tutorials;

        } catch (error) {
            console.error('Error scraping GeeksforGeeks tutorials:', error);
            return [];
        }
    }
}

export default GeeksforGeeksScraper; 