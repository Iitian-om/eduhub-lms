import puppeteer from 'puppeteer';
import axios from 'axios';

class EdXScraper {
    constructor() {
        this.baseUrl = 'https://www.edx.org';
        this.searchUrl = 'https://www.edx.org/search';
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
            
            // Navigate to search page
            await page.goto(`${this.searchUrl}?q=${encodeURIComponent(query)}`, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            // Wait for course cards to load
            await page.waitForSelector('[data-testid="course-card"]', { timeout: 10000 });

            // Extract course data
            const courses = await page.evaluate((maxLimit) => {
                const courseCards = document.querySelectorAll('[data-testid="course-card"]');
                const results = [];

                for (let i = 0; i < Math.min(courseCards.length, maxLimit); i++) {
                    const card = courseCards[i];
                    
                    try {
                        const titleElement = card.querySelector('h3, .course-title, [data-testid="course-title"]');
                        const title = titleElement ? titleElement.textContent.trim() : 'N/A';
                        
                        const instructorElement = card.querySelector('.instructor, .course-instructor');
                        const instructor = instructorElement ? instructorElement.textContent.trim() : 'N/A';
                        
                        const priceElement = card.querySelector('.price, .course-price');
                        const price = priceElement ? priceElement.textContent.trim() : 'Free';
                        
                        const ratingElement = card.querySelector('.rating, .course-rating');
                        const rating = ratingElement ? ratingElement.textContent.trim() : 'N/A';
                        
                        const durationElement = card.querySelector('.duration, .course-duration');
                        const duration = durationElement ? durationElement.textContent.trim() : 'N/A';
                        
                        const imageElement = card.querySelector('img');
                        const image = imageElement ? imageElement.src : '';
                        
                        const linkElement = card.querySelector('a');
                        const link = linkElement ? linkElement.href : '';
                        
                        const descriptionElement = card.querySelector('.description, .course-description');
                        const description = descriptionElement ? descriptionElement.textContent.trim() : 'N/A';

                        results.push({
                            title,
                            instructor,
                            price,
                            rating,
                            duration,
                            image,
                            link,
                            description,
                            platform: 'edX',
                            source: 'edx.org'
                        });
                    } catch (error) {
                        console.error('Error parsing course card:', error);
                    }
                }

                return results;
            }, limit);

            await browser.close();
            return courses;

        } catch (error) {
            console.error('Error scraping edX:', error);
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
                const title = document.querySelector('h1')?.textContent.trim() || 'N/A';
                const description = document.querySelector('.course-description, .description')?.textContent.trim() || 'N/A';
                const instructor = document.querySelector('.instructor-name, .instructor')?.textContent.trim() || 'N/A';
                const price = document.querySelector('.price, .course-price')?.textContent.trim() || 'Free';
                const duration = document.querySelector('.duration, .course-duration')?.textContent.trim() || 'N/A';
                const level = document.querySelector('.level, .difficulty')?.textContent.trim() || 'N/A';
                const language = document.querySelector('.language')?.textContent.trim() || 'English';
                const rating = document.querySelector('.rating')?.textContent.trim() || 'N/A';
                const enrollment = document.querySelector('.enrollment-count')?.textContent.trim() || 'N/A';

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
                    platform: 'edX',
                    source: 'edx.org'
                };
            });

            await browser.close();
            return courseDetails;

        } catch (error) {
            console.error('Error getting edX course details:', error);
            return null;
        }
    }
}

export default EdXScraper; 