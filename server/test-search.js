// Test script to verify search functionality imports
import dotenv from 'dotenv';
import SearchService from './utils/searchService.js';
import SearchController from './controllers/searchController.js';
import EdXScraper from './utils/scrapers/edxScraper.js';
import GeeksforGeeksScraper from './utils/scrapers/geeksforgeeksScraper.js';
import SwayamScraper from './utils/scrapers/swayamScraper.js';

// Load environment variables
dotenv.config();

console.log('Testing search functionality imports...');

try {
    // Test scraper imports
    console.log('✓ EdX Scraper imported successfully');
    const edxScraper = new EdXScraper();
    
    console.log('✓ GeeksforGeeks Scraper imported successfully');
    const gfgScraper = new GeeksforGeeksScraper();
    
    console.log('✓ SWAYAM Scraper imported successfully');
    const swayamScraper = new SwayamScraper();
    
    // Test search service
    console.log('✓ Search Service imported successfully');
    const searchService = new SearchService();
    
    // Test search controller
    console.log('✓ Search Controller imported successfully');
    const searchController = new SearchController();
    
    console.log('✓ All search functionality imports successful!');
    console.log('✓ Server should start without errors.');
    
} catch (error) {
    console.error('✗ Import error:', error.message);
    process.exit(1);
} 