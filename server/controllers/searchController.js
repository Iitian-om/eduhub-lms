import SearchService from '../utils/searchService.js';
import ExternalCourse from '../models/ExternalCourse.js';
import SearchQuery from '../models/SearchQuery.js';
import { validationResult } from 'express-validator';

class SearchController {
    constructor() {
        this.searchService = new SearchService();
    }

    // Main search endpoint
    async searchCourses(req, res) {
        try {
            const startTime = Date.now();
            
            // Validate request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: errors.array()
                });
            }

            const { query, filters = {}, limit = 7 } = req.body;
            const userId = req.user ? req.user._id : null;

            if (!query || query.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Search query is required'
                });
            }

            // Perform search
            const courses = await this.searchService.searchCourses(query, filters, limit);
            
            const searchTime = Date.now() - startTime;

            // Save search query for analytics
            await this.saveSearchQuery({
                query: query.trim(),
                userId,
                filters,
                results: {
                    totalFound: courses.length,
                    platforms: this.getPlatformStats(courses)
                },
                userAgent: req.get('User-Agent'),
                ipAddress: req.ip,
                searchTime,
                isSuccessful: true
            });

            res.status(200).json({
                success: true,
                message: 'Search completed successfully',
                data: {
                    query: query.trim(),
                    totalResults: courses.length,
                    searchTime,
                    courses,
                    filters
                }
            });

        } catch (error) {
            console.error('Error in searchCourses:', error);
            
            // Save failed search for analytics
            await this.saveSearchQuery({
                query: req.body.query || '',
                userId: req.user ? req.user._id : null,
                filters: req.body.filters || {},
                results: { totalFound: 0, platforms: [] },
                userAgent: req.get('User-Agent'),
                ipAddress: req.ip,
                searchTime: 0,
                isSuccessful: false,
                errorMessage: error.message
            });

            res.status(500).json({
                success: false,
                message: 'Error performing search',
                error: error.message
            });
        }
    }

    // Get course recommendations
    async getRecommendations(req, res) {
        try {
            const { limit = 7 } = req.query;
            const userId = req.user ? req.user._id : null;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required for recommendations'
                });
            }

            // Get user profile for recommendations
            const userProfile = {
                interests: req.user.interests || [],
                skills: req.user.skills || [],
                level: req.user.level || 'Beginner',
                completedCourses: req.user.Courses_Completed || [],
                role: req.user.role || 'User',
                location: req.user.location || '',
                bio: req.user.bio || ''
            };

            const recommendations = await this.searchService.getCourseRecommendations(
                userProfile, 
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                message: 'Recommendations retrieved successfully',
                data: {
                    recommendations,
                    totalResults: recommendations.length
                }
            });

        } catch (error) {
            console.error('Error in getRecommendations:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting recommendations',
                error: error.message
            });
        }
    }

    // Get course insights
    async getCourseInsights(req, res) {
        try {
            const { courseId } = req.params;

            const course = await ExternalCourse.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }

            const insights = await this.searchService.getCourseInsights(course);

            res.status(200).json({
                success: true,
                message: 'Course insights retrieved successfully',
                data: {
                    course,
                    insights
                }
            });

        } catch (error) {
            console.error('Error in getCourseInsights:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting course insights',
                error: error.message
            });
        }
    }

    // Get available platforms
    async getPlatforms(req, res) {
        try {
            const platforms = this.searchService.getAvailablePlatforms();

            res.status(200).json({
                success: true,
                message: 'Platforms retrieved successfully',
                data: platforms
            });

        } catch (error) {
            console.error('Error in getPlatforms:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting platforms',
                error: error.message
            });
        }
    }

    // Get search history for user
    async getSearchHistory(req, res) {
        try {
            const userId = req.user ? req.user._id : null;
            const { limit = 20 } = req.query;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
            }

            const history = await SearchQuery.getUserSearchHistory(userId, parseInt(limit));

            res.status(200).json({
                success: true,
                message: 'Search history retrieved successfully',
                data: {
                    history,
                    totalResults: history.length
                }
            });

        } catch (error) {
            console.error('Error in getSearchHistory:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting search history',
                error: error.message
            });
        }
    }

    // Get popular searches
    async getPopularSearches(req, res) {
        try {
            const { limit = 10 } = req.query;

            const popularSearches = await SearchQuery.getPopularSearches(parseInt(limit));

            res.status(200).json({
                success: true,
                message: 'Popular searches retrieved successfully',
                data: popularSearches
            });

        } catch (error) {
            console.error('Error in getPopularSearches:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting popular searches',
                error: error.message
            });
        }
    }

    // Track course click
    async trackCourseClick(req, res) {
        try {
            const { courseId, searchQueryId } = req.body;
            const userId = req.user ? req.user._id : null;

            // Update course view count
            const course = await ExternalCourse.findById(courseId);
            if (course) {
                await course.incrementViewCount();
            }

            // Update search query with click
            if (searchQueryId) {
                await SearchQuery.findByIdAndUpdate(searchQueryId, {
                    $push: {
                        clickedCourses: {
                            courseId,
                            clickedAt: new Date()
                        }
                    }
                });
            }

            res.status(200).json({
                success: true,
                message: 'Click tracked successfully'
            });

        } catch (error) {
            console.error('Error in trackCourseClick:', error);
            res.status(500).json({
                success: false,
                message: 'Error tracking click',
                error: error.message
            });
        }
    }

    // Get search analytics (admin only)
    async getSearchAnalytics(req, res) {
        try {
            const { days = 30 } = req.query;

            const [trends, platformStats, popularSearches] = await Promise.all([
                SearchQuery.getSearchTrends(parseInt(days)),
                SearchQuery.getPlatformStats(parseInt(days)),
                SearchQuery.getPopularSearches(10)
            ]);

            res.status(200).json({
                success: true,
                message: 'Search analytics retrieved successfully',
                data: {
                    trends,
                    platformStats,
                    popularSearches
                }
            });

        } catch (error) {
            console.error('Error in getSearchAnalytics:', error);
            res.status(500).json({
                success: false,
                message: 'Error getting search analytics',
                error: error.message
            });
        }
    }

    // Helper method to save search query
    async saveSearchQuery(searchData) {
        try {
            const searchQuery = new SearchQuery(searchData);
            await searchQuery.save();
        } catch (error) {
            console.error('Error saving search query:', error);
        }
    }

    // Helper method to get platform statistics
    getPlatformStats(courses) {
        const platformStats = {};
        
        courses.forEach(course => {
            if (!platformStats[course.platform]) {
                platformStats[course.platform] = 0;
            }
            platformStats[course.platform]++;
        });

        return Object.entries(platformStats).map(([platform, count]) => ({
            platform,
            count
        }));
    }
}

export default SearchController; 