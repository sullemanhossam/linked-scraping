const puppeteer = require('puppeteer');

(async () => {
    const email = 'hossamsulleman@gmail.com';  // Replace with your LinkedIn email
    const password = 'Taq24434!';  // Replace with your LinkedIn password

    // Launch browser
    const browser = await puppeteer.launch({
        headless: false,  // Set to true if you don't want the browser window to appear
        slowMo: 50,  // Slows down Puppeteer operations for better visualization
        args: ['--no-sandbox', '--disable-setuid-sandbox']  // Fix potential permissions issues
    });

    const page = await browser.newPage();

    // Set User-Agent and viewport
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setExtraHTTPHeaders({ 'accept-language': 'en-US,en;q=0.9' });
    await page.setViewport({ width: 1280, height: 800 });

    // Disable Puppeteer automation flags
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    // Navigate to LinkedIn login page
    await page.goto("https://www.linkedin.com/login", { waitUntil: 'networkidle2' });

    // Wait for the login elements to load
    await page.waitForSelector('#username', { visible: true });
    await page.waitForSelector('#password', { visible: true });

    // Input email and password
    await page.type("#username", email, { delay: 100 });
    await page.type("#password", password, { delay: 100 });

    // Click the login button
    await page.click('button[type="submit"]');

    // Wait for navigation to the LinkedIn homepage after login
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    console.log("Login successful!");

    // Example: Now visit a LinkedIn profile
    await page.goto('https://www.linkedin.com/in/hossam-sulleman-42712217a/', { waitUntil: 'networkidle2' });

    // Save the page content to a file
    const fs = require('fs');
    const pageContent = await page.content();
    fs.writeFileSync('linkedin_profile_after_login.html', pageContent);

    console.log("Profile page saved!");

    // Close the browser
    await browser.close();
})();
