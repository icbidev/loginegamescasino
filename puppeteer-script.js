const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false }); // Launch in non-headless mode for debugging
    const page = await browser.newPage();

    // Listen for all network responses
    page.on('response', async (response) => {
        const url = response.url();
        const status = response.status();
        const contentType = response.headers()['content-type'];

        if (contentType && contentType.includes('application/json')) {
            // Log JSON responses
            const responseBody = await response.json();
            console.log(`URL: ${url}`);
            console.log(`Status: ${status}`);
            console.log(`Response Body:`, responseBody);
        } else {
            // Log other types of responses
            console.log(`URL: ${url}`);
            console.log(`Status: ${status}`);
        }
    });

    await page.goto('https://rgp.egamescasino.ph/');

    // Verify page load
    console.log('Page loaded:', await page.title());

    // Fill out the form
    await page.type('[name="ub_mobile_number"]', 'ubza8v2b');
    await page.type('[name="pincode"]', '062021');

    // Click the submit button
    await page.click('input[id="login_submit"]');

    // Wait for the popup to appear and click it with additional delay
    try {
        // Wait for the selector of the popup button to be visible
        await page.waitForSelector('.swal2-confirm.swal2-styled.swal2-default-outline', { visible: true, timeout: 10000 });
        console.log('Popup detected.');

        // Additional delay before clicking the popup button
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds delay

        // Click the popup button
        await page.click('.swal2-confirm.swal2-styled.swal2-default-outline');
        console.log('Popup button clicked.');
    } catch (error) {
        console.error('Popup did not appear or other error:', error);
    }

    // Wait for the popup action to complete (if necessary) and navigate to the new URL
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds delay

    // Navigate to the new URL
    await page.goto('https://rgplobby.egamescasino.ph');
    console.log('Navigated to new page:', await page.title());

    // Keep the browser open for further actions
    console.log('Browser kept open for further actions.');
})();
