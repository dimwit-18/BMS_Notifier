import puppeteer from "puppeteer";
// import { moveMouseRandomly, waitRandomTime } from "./simulateUserService.js";

const baseURL = 'https://in.bookmyshow.com/explore/home';

const runWebScrapingService = async (inputURL, bookingURL = '', theatreName = '') => {
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox'
        ],
        headless: true
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'); // user agent to mimic real browser
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': baseURL,  // Use the appropriate referer
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Connection': 'keep-alive',
    });

    if (bookingURL) {
        await page.goto(bookingURL, { waitUntil: "networkidle2", timeout: 5*60*1000  });
    } else {
        await page.goto(inputURL, { waitUntil: "networkidle2", timeout: 5*60*1000 });
    }

    const cookies = await page.cookies();
    await page.setCookie(...cookies); // set cookies

    // Set geolocation (latitude, longitude)
    const latitude = 17.4065; 
    const longitude = 78.4772;
    await page.setGeolocation({ latitude, longitude });

    // Grant location permission
    await page.evaluateOnNewDocument(() => {
        const originalGetCurrentPosition = navigator.geolocation.getCurrentPosition;
        navigator.geolocation.getCurrentPosition = (success) => {
            success({ coords: { latitude: 17.4065, longitude: 78.4772 } });
        };
    });


    const searchString = theatreName.toLowerCase();
    
    if(!bookingURL && !searchString){
        // Check if there's a span with "book tickets" text
        const hasBookTicketsText = await page.evaluate(() => {
            const elements = [...document.querySelectorAll('span')];
            return elements.some(el => el.textContent.toLowerCase().includes('book tickets'));
        });
        
        // console.log(hasBookTicketsText ? "Yes" : "No");
        browser.close();
        return hasBookTicketsText;
    }
    
    const isTheatreAvailable = await page.evaluate(searchString => {
        const bodyText = document.body.innerText;
        return bodyText.toLowerCase().includes(searchString);
    }, searchString);

    // console.log(isTheatreAvailable ? "Yes" : "No");
    browser.close();
    return isTheatreAvailable;


    // const buttonClicked = await page.evaluate(() => {
    //     // Find all buttons on the page
    //     const buttons = [...document.querySelectorAll('button')];

    //     // Iterate over the buttons to find one that has a span inside with text "book tickets"
    //     for (let button of buttons) {
    //         const span = button.querySelector('div span');
    //         if (span && span.textContent.toLowerCase().includes('book tickets')) {
    //             button.click();  // Click the button
    //             return true;     // Return true to confirm the button was clicked
    //         }
    //     }
    //     return false;  // Return false if no button with the desired structure was found
    // });

    // if (buttonClicked) {
    //     // await moveMouseRandomly(page);
    //     // await waitRandomTime();
    //     console.log('Clicked the "book tickets" button.');

        
    //     try { // click continue if 'A' rated certificate modal appears
    //         await page.waitForSelector('div.sc-10qvp23-1.Dvdam', { timeout: 5000 });

    //         const modalClicked = await page.evaluate(() => {
    //             const parentDiv = document.querySelector('div.sc-10qvp23-1.Dvdam');
    //             if (!parentDiv) return false;

    //             const outerDivs = [...parentDiv.querySelectorAll('div')];
    //             for (let outerDiv of outerDivs) {
    //                 const innerDiv = outerDiv.querySelector('div');
    //                 if (innerDiv && innerDiv.textContent.toLowerCase().includes('continue')) {
    //                     innerDiv.click(); // click continue button
    //                     return true;
    //                 }
    //             }
    //             return false;
    //         });

    //         if (modalClicked) {
    //             console.log('Clicked the "continue" button in the modal.');
    //         } else {
    //             console.log('No "continue" button found in the subtree, so moving on...');
    //         }
    //     } catch (e) {
    //         console.log('The specified element or the "continue" button was not found.');
    //     }

    //     try { // click the first button when shown language/movie format option
    //         // Wait for the div with the specific classes to appear again
    //         await page.waitForSelector('div.sc-10qvp23-1.Dvdam', { timeout: 5000 });
    //         // await moveMouseRandomly(page);
    //         // await waitRandomTime();

    //         // Click the first div with classes sc-vhz3gb-3 ksLpgw if it exists
    //         const firstDivClicked = await page.evaluate(async () => {
    //             const parentDiv = document.querySelector('div.sc-10qvp23-1.Dvdam');
    //             console.log("parentDiv is", parentDiv)
    //             if (!parentDiv) return false;

    //             const targetDiv = parentDiv.querySelector('div.sc-vhz3gb-3.ksLpgw');
    //             if (targetDiv) {
    //                 targetDiv.click();  // Click the first matching div
    //                 return true;
    //             }
                
    //             return false;
    //         });

    //         if (firstDivClicked) {
    //             console.log('Clicked the first div with classes "sc-vhz3gb-3 ksLpgw".');
    //         } else {
    //             console.log('No div with classes "sc-vhz3gb-3 ksLpgw" found.');
    //         }
    //     } catch (e) {
    //         console.log('The specified div did not appear.', e);
    //     }
    

    // } else {
    //     console.log('Failed to find the "book tickets" button.');
    // }
}

// runWebScrapingService('https://in.bookmyshow.com/bengaluru/movies/devara-part-1/ET00310216', 'https://in.bookmyshow.com/buytickets/devara-part-1-bengaluru/movie-bang-ET00310216-MT/20240927', 'Sri Vinayaka Marathahalli 4k A/C Dolby Atmos');

export default runWebScrapingService;