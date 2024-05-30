import puppeteer from "puppeteer";

export async function lauchPuppeteer() {
	return await puppeteer.launch({
		headless: "new",
		// headless: false,
		args: [
			`--window-size=1920,1080`,
			"--disable-background-timer-throttling",
			"--disable-backgrounding-occluded-windows",
			"--disable-renderer-backgrounding",
		],
		defaultViewport: {
			width: 1920,
			height: 1080,
		},
		protocolTimeout: 4000000,
	});
}
