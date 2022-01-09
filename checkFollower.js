require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const cookiesPath = 'cookies.txt';

module.exports = async function checkFollower(usernameToCheck) {
    const start = await Date.now();
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const context = browser.defaultBrowserContext();
    context.overridePermissions('https://www.instagram.com', [
        'geolocation',
        'notifications',
    ]);

    const page = await browser.newPage();

    // If the cookies file exists, read the cookies.
    const previousSession = fs.existsSync(cookiesPath);
    if (previousSession) {
        const content = fs.readFileSync(cookiesPath);
        const cookiesArr = JSON.parse(content);
        if (cookiesArr.length !== 0) {
            for (let cookie of cookiesArr) {
                await page.setCookie(cookie);
            }
            console.log('Session has been loaded in the browser');
        }
    } else {
        console.log('No cookies detected :(');
        await page.goto('https://www.instagram.com', {
            waitUntil: 'networkidle0',
        });
        await page.type('input[name="username"]', process.env.IG_USERNAME);
        await page.type('input[name="password"]', process.env.IG_PASSWORD);
        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ]);

        // Write Cookies
        const cookiesObject = await page.cookies();
        fs.writeFileSync(cookiesPath, JSON.stringify(cookiesObject));
        console.log('Session has been saved to ' + cookiesPath);
    }

    await page.goto(`https://www.instagram.com/${usernameToCheck}`, {
        waitUntil: 'networkidle0',
    });

    const followBackButton = await page.$x(
        "//button[contains(text(), 'Follow Back')]"
    );

    await browser.close();
    const end = await Date.now();
    await console.log(`DONE in ${(end - start) / 1000} second.`);

    if (await followBackButton.length) {
        await console.log(`${usernameToCheck} has already followed you!`);
        return {
            username: usernameToCheck,
            isFollower: true,
        };
    } else {
        await console.log(`${usernameToCheck} isn't following you!`);
        return {
            username: usernameToCheck,
            isFollower: false,
        };
    }
};
