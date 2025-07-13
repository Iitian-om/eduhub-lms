import puppeteer from 'puppeteer';
import axios from 'axios';

class SwayamScraper {
    constructor() {
        this.baseUrl = 'https://swayam.gov.in';
        this.searchUrl = 'https://swayam.gov.in/search';
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
            await page.waitForSelector('.course-card, .card, [class*="course"]', { timeout: 10000 });

            // Extract course data
            const courses = await page.evaluate((maxLimit) => {
                const courseCards = document.querySelectorAll('.course-card, .card, [class*="course"]');
                const results = [];

                for (let i = 0; i < Math.min(courseCards.length, maxLimit); i++) {
                    const card = courseCards[i];
                    
                    try {
                        const titleElement = card.querySelector('h3, h4, .course-title, .title');
                        const title = titleElement ? titleElement.textContent.trim() : 'N/A';
                        
                        const instructorElement = card.querySelector('.instructor, .coordinator, .faculty');
                        const instructor = instructorElement ? instructorElement.textContent.trim() : 'N/A';
                        
                        const institutionElement = card.querySelector('.institution, .university, .college');
                        const institution = institutionElement ? institutionElement.textContent.trim() : 'N/A';
                        
                        const priceElement = card.querySelector('.price, .cost, .fee');
                        const price = priceElement ? priceElement.textContent.trim() : 'Free';
                        
                        const durationElement = card.querySelector('.duration, .time, .weeks');
                        const duration = durationElement ? durationElement.textContent.trim() : 'N/A';
                        
                        const imageElement = card.querySelector('img');
                        const image = imageElement ? imageElement.src : '';
                        
                        const linkElement = card.querySelector('a');
                        const link = linkElement ? linkElement.href : '';
                        
                        const descriptionElement = card.querySelector('.description, .desc, .summary');
                        const description = descriptionElement ? descriptionElement.textContent.trim() : 'N/A';

                        const levelElement = card.querySelector('.level, .difficulty');
                        const level = levelElement ? levelElement.textContent.trim() : 'Undergraduate';

                        const languageElement = card.querySelector('.language, .medium');
                        const language = languageElement ? languageElement.textContent.trim() : 'English';

                        results.push({
                            title,
                            instructor,
                            institution,
                            price,
                            duration,
                            image,
                            link,
                            description,
                            level,
                            language,
                            platform: 'SWAYAM',
                            source: 'swayam.gov.in'
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
            console.error('Error scraping SWAYAM:', error);
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
                const instructor = document.querySelector('.instructor, .coordinator')?.textContent.trim() || 'N/A';
                const institution = document.querySelector('.institution, .university')?.textContent.trim() || 'N/A';
                const price = document.querySelector('.price, .cost')?.textContent.trim() || 'Free';
                const duration = document.querySelector('.duration, .time')?.textContent.trim() || 'N/A';
                const level = document.querySelector('.level, .difficulty')?.textContent.trim() || 'Undergraduate';
                const language = document.querySelector('.language, .medium')?.textContent.trim() || 'English';
                const enrollment = document.querySelector('.enrollment, .students')?.textContent.trim() || 'N/A';
                const startDate = document.querySelector('.start-date, .enrollment-date')?.textContent.trim() || 'N/A';

                return {
                    title,
                    description,
                    instructor,
                    institution,
                    price,
                    duration,
                    level,
                    language,
                    enrollment,
                    startDate,
                    platform: 'SWAYAM',
                    source: 'swayam.gov.in'
                };
            });

            await browser.close();
            return courseDetails;

        } catch (error) {
            console.error('Error getting SWAYAM course details:', error);
            return null;
        }
    }

    // Get courses by category (useful for SWAYAM)
    async getCoursesByCategory(category, limit = 7) {
        try {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            
            // Navigate to category page
            await page.goto(`${this.baseUrl}/courses/${category.toLowerCase()}`, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            const courses = await page.evaluate((maxLimit) => {
                const courseCards = document.querySelectorAll('.course-card, .card');
                const results = [];

                for (let i = 0; i < Math.min(courseCards.length, maxLimit); i++) {
                    const card = courseCards[i];
                    
                    try {
                        const titleElement = card.querySelector('h3, .course-title');
                        const title = titleElement ? titleElement.textContent.trim() : 'N/A';
                        
                        const instructorElement = card.querySelector('.instructor, .coordinator');
                        const instructor = instructorElement ? instructorElement.textContent.trim() : 'N/A';
                        
                        const institutionElement = card.querySelector('.institution, .university');
                        const institution = institutionElement ? institutionElement.textContent.trim() : 'N/A';
                        
                        const linkElement = card.querySelector('a');
                        const link = linkElement ? linkElement.href : '';
                        
                        const descriptionElement = card.querySelector('.description, .desc');
                        const description = descriptionElement ? descriptionElement.textContent.trim() : 'N/A';

                        results.push({
                            title,
                            instructor,
                            institution,
                            price: 'Free',
                            duration: 'N/A',
                            image: '',
                            link,
                            description,
                            level: 'Undergraduate',
                            language: 'English',
                            platform: 'SWAYAM',
                            source: 'swayam.gov.in',
                            category: category
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
            console.error('Error getting SWAYAM courses by category:', error);
            return [];
        }
    }
}

export default SwayamScraper; 