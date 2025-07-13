import express from 'express';
import { body, query, param } from 'express-validator';
import SearchController from '../controllers/searchController.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { searchRateLimit } from '../middlewares/rateLimit.js';

const router = express.Router();
const searchController = new SearchController();



// Apply rate limiting to search routes
router.use(searchRateLimit);

// Main search endpoint
router.post('/courses', [
    body('query')
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Search query must be between 1 and 200 characters'),
    body('limit')
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage('Limit must be between 1 and 20'),
    body('filters.maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Max price must be a positive number'),
    body('filters.platforms')
        .optional()
        .isArray()
        .withMessage('Platforms must be an array'),
    body('filters.level')
        .optional()
        .isIn(['Beginner', 'Intermediate', 'Advanced'])
        .withMessage('Level must be Beginner, Intermediate, or Advanced'),
    body('filters.maxDuration')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Max duration must be a positive integer'),
    body('filters.language')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Language must be between 1 and 50 characters')
], searchController.searchCourses.bind(searchController));

// Get course recommendations
router.get('/recommendations', [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage('Limit must be between 1 and 20')
], isAuthenticated, searchController.getRecommendations.bind(searchController));

// Get course insights
router.get('/courses/:courseId/insights', [
    param('courseId')
        .isMongoId()
        .withMessage('Invalid course ID')
], searchController.getCourseInsights.bind(searchController));

// Get available platforms
router.get('/platforms', searchController.getPlatforms.bind(searchController));

// Get search history for user
router.get('/history', [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Limit must be between 1 and 50')
], isAuthenticated, searchController.getSearchHistory.bind(searchController));

// Get popular searches
router.get('/popular', [
    query('limit')
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage('Limit must be between 1 and 20')
], searchController.getPopularSearches.bind(searchController));

// Track course click
router.post('/track-click', [
    body('courseId')
        .isMongoId()
        .withMessage('Invalid course ID'),
    body('searchQueryId')
        .optional()
        .isMongoId()
        .withMessage('Invalid search query ID')
], searchController.trackCourseClick.bind(searchController));

// Get search analytics (admin only)
router.get('/analytics', [
    query('days')
        .optional()
        .isInt({ min: 1, max: 365 })
        .withMessage('Days must be between 1 and 365')
], isAuthenticated, searchController.getSearchAnalytics.bind(searchController));

// Health check endpoint for search service
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Search service is healthy',
        timestamp: new Date().toISOString()
    });
});

export default router; 