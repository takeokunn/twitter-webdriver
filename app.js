require('dotenv').config();

const puppeteer = require('puppeteer');

const TWITTER = {
    RELATION_ID: process.env.TWITTER_RELATION_ID,
    USERNAME: process.env.TWITTER_USERNAME,
    PASSWORD: process.env.TWITTER_PASSWORD
};
const LOGIN_URL = "https://mobile.twitter.com/login";
const RELATED_USERS_URL = `https://mobile.twitter.com/i/related_users/${TWITTER.RELATION_ID}`;
const BROWSER_OPTIONS = ['--no-sandbox', '--disable-setuid-sandbox'];
const IS_HEADLESS = false;

const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

const main = async () => {
    const browser = await puppeteer.launch({ headless: IS_HEADLESS, args: BROWSER_OPTIONS });
    const page = await browser.newPage();

    // login
    await page.goto(LOGIN_URL);
    await page.waitFor('div[role="button"]', { timeout: 12000 });
    await page.type('input[type="text"]', TWITTER.USERNAME);
    await page.type('input[type="password"]', TWITTER.PASSWORD);
    await page.click('div[role="button"]');

    // follow related users
    for (var i = 0; i < 10; i++) {
        await page.goto(RELATED_USERS_URL, { waitUntil: "domcontentloaded" });
        await sleep(3000);
        await page.evaluate(selector => {
            document.querySelectorAll(selector).forEach(async btn => {
                await btn.click();
                await sleep(1);
            });
        }, 'div[data-testid="UserCell"] div[role="button"]');
        await sleep(1000);
    }

    await browser.close();
};

main();
