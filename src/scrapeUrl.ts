import { eq } from "drizzle-orm";
import type { Browser, Page } from "puppeteer";
import { db } from "../db";
import { properties, bookedDates } from "../db/schema";
import { scrapeDates } from "./scrapeDates";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function scrapeUrl(browser: Browser, page: Page, url: string) {
	const openedPages: Page[] = [];
	await page.goto(url, { waitUntil: "domcontentloaded" });
	await new Promise((resolve) => setTimeout(resolve, 3000));

	let previousScrollHeight = 0;
	let currentScrollHeight = -1;

	while (previousScrollHeight !== currentScrollHeight) {
		previousScrollHeight = currentScrollHeight;

		currentScrollHeight = await page.evaluate(async () => {
			let element;

			const overflowYScrollElements =
				document.getElementsByClassName("overflow-y-scroll");

			if (overflowYScrollElements.length > 0) {
				element = overflowYScrollElements[0];
			} else {
				element = document.documentElement;
			}
			if (element) {
				element.scrollTo(0, element.scrollHeight);
			}
			await new Promise((resolve) => setTimeout(resolve, 1000));

			return element ? element.scrollHeight : -1;
		});

	}
	let numProps = await page.evaluate(async () => {
		const overflowYScrollElements =
			document.getElementsByClassName("overflow-y-scroll");
		return overflowYScrollElements.length;
	});
	console.log("total number of properties:", numProps);

	await new Promise((resolve) => setTimeout(resolve, 2000));
	let propertyNumber = 0;

	browser.on("targetcreated", async (target) => {
		const newPage = await target.page();
		if (!newPage) return;

		openedPages.push(newPage);

		const { title, allDateStrings } = await scrapeDates(newPage);

		const allDates = allDateStrings.map((s) => new Date(s));

		await newPage.close();
		openedPages.splice(openedPages.indexOf(newPage), 1);

		const propertyId = await db.query.properties
			.findFirst({
				where: eq(properties.name, title),
			})
			.then((res) => res?.id);

		if (!propertyId) {
			console.log(`property not found, skipping: "${title}"`);
			return;
		}

		if (allDates.length === 0) {
			console.log(`no dates found for property, skipping: "${propertyId}"`);
			return;
		}

		await db
			.insert(bookedDates)
			.values(allDates.map((date) => ({ date, propertyId })))
			.onConflictDoNothing();

		console.log(
			`${propertyNumber}: upserted ${allDates.length} dates to property ${propertyId}`
		);
		propertyNumber++;
	});

	try {
		const propertiesData = await page.evaluate(async () => {
			const element =
				document.querySelector(".overflow-y-scroll") ??
				document.querySelector('div[data-property-list="true"]');

			if (element) {
				const divs = Array.from(element.children);
				for (const div of divs) {
					const titleWrapperDiv = div.querySelector(
						'[data-qa="property-title"]'
					);
					const propertyType = div.querySelector('[data-qa="property-type"]');
					const propertyAddress = div.querySelector(
						'[data-qa="property-address"]'
					);
					const propertyGuestsLabel = div.querySelector(
						'[data-qa="property-guests-label"]'
					);
					const propertyFooterSpan = div.querySelector(
						'div[class*="propertyFooter"] span'
					);

					const propertyData = {
						name: titleWrapperDiv?.textContent?.trim(),
						propertyType: propertyType?.textContent?.trim(),
						address: propertyAddress?.textContent?.trim(),
						maxNumGuests: +(
							propertyGuestsLabel?.textContent?.split(" ")[0] ?? ""
						),
						originalNightlyPrice:
							parseFloat(
								propertyFooterSpan!
									.textContent!.replace(/,/g, "")
									.trim()
									.slice(1)
							) * 100,
					};
				}
			}
		});
	} catch (err) {
		console.log("error in original page:\n", err);
	}

	try {
		await page.evaluate(async () => {
			let element = document.querySelector(".overflow-y-scroll");
			if (!element) {
				element = document.querySelector('div[data-property-list="true"]');
			}
			if (element) {
				const divs = Array.from(element.children);
				// console.log("count", divs.length);
				for (let i = 0; i < divs.length; i++) {
					const bookNowButton = divs[i].querySelector('[data-qa="book-now"]');
					if (bookNowButton) {
						bookNowButton.dispatchEvent(
							new MouseEvent("click", {
								bubbles: true,
								button: 1,
							})
						);

						console.log("testlklk");
						const timeout = 15000;
						const startTime = Date.now();
						while (Date.now() - startTime < timeout) {
							await new Promise((resolve) => setTimeout(resolve, 1000));
						}

						console.log("laksdfkl");
					}
				}
			}
		});
	} catch (err) {
		console.log("error in page evaluate:\n", err);
	}

	try {
		while (openedPages.length > 0) {
			console.log("pages:", openedPages.length);
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Add a delay to prevent busy waiting
		}
		console.log("All opened pages closed");
	} catch (err) {
		console.log("err after the page.eval:\n", err);
	}
}
