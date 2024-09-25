// Function to simulate random mouse movements
export const moveMouseRandomly = async (page) => {
    const x = Math.floor(Math.random() * 800);
    const y = Math.floor(Math.random() * 600);
    await page.mouse.move(x, y);
    // await page.mouse.click(x, y);
};

// Function to wait for a random time
export const waitRandomTime = (min = 500, max = 1500) => {
    return new Promise(resolve => {
        const time = Math.floor(Math.random() * (max - min + 1)) + min;
        setTimeout(resolve, time);
    });
};