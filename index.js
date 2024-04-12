import fs from "fs/promises";

import puppeteer, { Browser, Page } from "puppeteer";

const urls = [
	//  "https://stayawhilevillas.guestybookings.com/properties",
	// "https://openairhomes.guestybookings.com/properties",
	// "https://staywildflower.guestybookings.com/properties",
	// "https://mybookings.guestybookings.com/properties",
	// "https://artthaus.guestybookings.com/properties",
	// "https://abode.guestybookings.com/properties",
	// "https://goodliferesorts.guestybookings.com/properties?city=San+Diego",
	// "https://titanbr.guestybookings.com/properties?city=San+Diego",
	// "https://alter.guestybookings.com/properties",
	// "https://cardo.guestybookings.com/properties",
	// "https://excelsiorstays.guestybookings.com/properties?city=San+Diego&country=United+States",
	// "https://stayrelax.guestybookings.com/properties",
	// "https://skylandvacation.guestybookings.com/properties",
	// "https://amazinghome-presente.guestybookings.com/properties",
	// "https://happiesthouserentals.guestybookings.com/properties",
	// "https://dcfurnishedliving.guestybookings.com/properties",
	// "https://homesweetcity.guestybookings.com/properties",
	// "https://greatdwellings.guestybookings.com/properties",
	// "https://staylocal.guestybookings.com/properties",
	// "https://yolostays.guestybookings.com/properties",
	// "https://valtarealty.guestybookings.com/properties",
	// "https://maverick.guestybookings.com/properties",
	"https://luluhomes.guestybookings.com/properties",
	// "https://westhome.guestybookings.com/properties?city=Atlanta",
	// "https://skyhaus.guestybookings.com/properties",
	// "https://woolworthupstairs.guestybookings.com/properties",
	// "https://welcomematvacations.guestybookings.com/properties",
	// "https://aloeyall.guestybookings.com/properties",
	// "https://beckonguests.guestybookings.com/properties",
	// "https://staylocalatx.guestybookings.com/properties",
	// "https://fortunatefoundations.guestybookings.com/properties",
	// "https://thecpcdenver.guestybookings.com/properties",
	// "https://stayinmydistrict.guestybookings.com/properties",
	// "https://thebungalows.guestybookings.com/properties",
	"https://booknow.vare.properties/properties",
	// "https://kingstreetcollection.guestybookings.com/properties",
	// "https://thenicholas.guestybookings.com/properties",
	// "https://homefrontstays.guestybookings.com/properties",
	"https://vacationcondosforless.guestybookings.com/properties",
	// "https://oasiscollections.guestybookings.com/properties",
	"https://staywithhideaway.guestybookings.com/properties",
	// "https://experiencehedge.guestybookings.com/properties",
	// "https://seagrapehospitality.guestybookings.com/properties",
	// "https://lajollabungalows.guestybookings.com/properties",
	// "https://nxt.guestybookings.com/properties",
	// "https://go_travli.guestybookings.com/properties?city=Sedona&country=United+States",
	// "https://halcyonhomehosting.guestybookings.com/properties",
	// "https://mammothrockvillas.guestybookings.com/properties",
	// "https://unwrittenstays.guestybookings.com/properties",
	// "https://scottsdalebeachclub.guestybookings.com/properties",
	// "https://thectbrothers.guestybookings.com/properties",
	// "https://arizonabnb.guestybookings.com/properties",
	// "https://aspening.guestybookings.com/properties",
	// "https://townandislandcompany.guestybookings.com/properties",
	// "https://brightwild.guestybookings.com/properties",
	// "https://tahoeasap.guestybookings.com/properties",
	// "https://laketahoevacationhomes.guestybookings.com/properties",
	// "https://vistasvacations.guestybookings.com/properties",
	// "https://pvhawaii.guestybookings.com/properties",
	// "https://rsbmanagement.guestybookings.com/properties",
	// "https://myobxvacation.guestybookings.com/properties",
	// "https://vegas.guestybookings.com/properties",
	// "https://mahin.guestybookings.com/properties",
	// "https://lasvegas.guestybookings.com/properties",
	// "https://saltairecottages.guestybookings.com/properties",
	// "https://shsrealtyservices.guestybookings.com/properties",
	// "https://blissfulliving.guestybookings.com/properties",
	// "https://reluxme.guestybookings.com/properties",
	// "https://zionstinygetaway.guestybookings.com/properties",
	// "https://coopmedcenter.guestybookings.com/properties",
	"https://seconddoor.guestybookings.com/properties",
	// "https://walkervacationrentals.guestybookings.com/properties",
	// "https://beachhomespuntacana.guestybookings.com/properties",
	// "https://russopg.guestybookings.com/properties",
	// "https://hostedjourney.guestybookings.com/properties",
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//eslint-disable-next-line import/no-anonymous-default-export
// export default async (req, res) => {
// const url = req.query.url as string;
async function main() {
	process.on("unhandledRejection", (reason, promise) => {
		console.error("Unhandled Rejection at:", promise, "reason:", reason);
		// You can add additional debugging information here if needed
	});
	try {
		let propertyData = {};

		for (const url of urls) {
			const browser = await puppeteer.launch({
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
			const page = await browser.newPage();
			const newData = await scrapeUrl(browser, page, url, propertyData); // Retrieve data from scrapeUrl function
			propertyData = { ...propertyData, ...newData };
			await browser.close();
		}

		await fs.writeFile(
			"./scrape-data-date-minus.json",
			JSON.stringify(propertyData)
		);

		// 		res.status(200).json({ success: true, data: propertyData });
	} catch (error) {
		console.log("scraping failed:", error);
	}
}
// };

async function scrapeUrl(browser, page, url, propertyData) {
	let tempData = propertyData;
	const openedPages = [];
	await page.goto(url, { waitUntil: "domcontentloaded" });
	await delay(3000);

	async function scrollDownUntilNoChange(page) {
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

			// currentScrollHeight = await page.evaluate(() => {
			// 	const element = document.getElementsByClassName("overflow-y-scroll")[0];
			// });
		}
	}

	// Usage
	await scrollDownUntilNoChange(page);

	await delay(2000);
	let propertyNumber = 0;

	const handleNewPage = async (newPage) => {
		await delay(3000);
		try {
			newPage.on("console", (msg) => {
				for (let i = 0; i < msg.args().length; ++i) {
					console.log(`${i}: ${msg.args()[i]}`);
				}
			});
			const returnedData = await newPage.evaluate(async (propertyNumber) => {
				//grab all text
				const propertyDescriptions = document.querySelectorAll(
					'[class*="propertyDescription"]:not([class*="propertyDescriptionWrapper"])'
				);
				let propertyTexts = Array.from(propertyDescriptions).map(
					(description) => description.textContent.trim()
				);
				propertyTexts = propertyTexts.toString();

				const titleEndIndex = propertyTexts.indexOf("Description");
				const title = propertyTexts.substring(0, titleEndIndex);

				//grab all dates
				const allDates = [];
				let expandCalendarButton = document.querySelectorAll(
					'[class*="Button-content"]'
				);
				expandCalendarButton[0].click();

				await new Promise((resolve) => setTimeout(resolve, 500));

				for (let i = 0; i < 5; i++) {
					let expandCalendarButton = document.querySelector(
						'[class*="nextButton"]'
					);

					try {
						expandCalendarButton.click();
					} catch (err) {
						console.log("error while clicking dates", err);
					}

					await new Promise((resolve) => setTimeout(resolve, 1000));

					const calendarCaptionText = document.querySelectorAll(
						"div.CalendarMonth_caption"
					)[1].textContent;
					const month = calendarCaptionText.substring(
						0,
						calendarCaptionText.length - 5
					);

					const tdElements = document.querySelectorAll(
						"div.CalendarMonth td.CalendarDay"
					);
					const filteredAriaLabels = Array.from(tdElements).filter((td) => {
						const ariaLabel = td.getAttribute("aria-label");
						return ariaLabel.includes(month) && !ariaLabel.includes("Not");
					});

					const dates = filteredAriaLabels.map((td) => {
						const ariaLabel = td.getAttribute("aria-label");
						const dateStartIndex = ariaLabel.indexOf(",") + 2;
						const dateEndIndex = ariaLabel.indexOf(",", dateStartIndex + 1); // Find the index of the next comma after the month

						// Extract the full date string
						const dateString = ariaLabel.substring(
							dateStartIndex,
							dateEndIndex
						);

						// Format the date as desired (e.g., March 31, 2024)
						return `${dateString.trim()}, ${new Date().getFullYear()}`;
					});
					allDates.push(dates);
				}

				return {
					allDates,
					title,
				}; // Return property number and image sources
			});

			await newPage.close(); // Close the new page after evaluating its content
			openedPages.splice(openedPages.indexOf(newPage), 1);
			return returnedData;
		} catch (err) {
			console.log("error in handle new page: ", err);
		}
	};

	browser.on("targetcreated", (target) => {
		void (async () => {
			if (target.type() === "page") {
				const newPage = await target.page();
				openedPages.push(newPage);
				try {
					const returnedData = await handleNewPage(newPage);

					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					if (returnedData.title) {
						tempData[returnedData.title] = {
							...(tempData[returnedData.title] || {}),
							dates: returnedData.allDates,
						};
					}

					console.log(propertyNumber);
					propertyNumber++;
				} catch (err) {
					console.log("error handling new page", err);
				}
			}
		})();
	});

	try {
		const propertiesData = await page.evaluate(async () => {
			let element = document.querySelector(".overflow-y-scroll");
			if (!element) {
				element = document.querySelector('div[data-property-list="true"]');
			}
			const data = {};
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

					const propertyTitle = titleWrapperDiv
						? titleWrapperDiv.textContent.trim()
						: "";

					const propertyData = {
						propertyType: propertyType ? propertyType.textContent.trim() : "",
						address: propertyAddress ? propertyAddress.textContent.trim() : "",
						maxNumGuests: propertyGuestsLabel.textContent
							? +propertyGuestsLabel.textContent.split(" ")[0]
							: null,
						originalNightlyPrice:
							parseFloat(
								propertyFooterSpan.textContent.replace(/,/g, "").trim().slice(1)
							) * 100,
					};
					if (propertyTitle) {
						data[propertyTitle] = propertyData;
					}
				}
			}
			return data;
		});
		tempData = propertiesData;
	} catch (err) {
		console.log("error in original page ", err);
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

				// eslint-disable-next-line @typescript-eslint/prefer-for-of
				for (let i = 0; i < divs.length; i++) {
					const bookNowButton = divs[i].querySelector('[data-qa="book-now"]');
					if (bookNowButton) {
						bookNowButton.dispatchEvent(
							new MouseEvent("click", { bubbles: true, button: 1 })
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
		console.log("error in page evaluate", err);
	}
	console.log("here");
	try {
		const waitForPagesToClose = async () => {
			while (openedPages.length > 0) {
				console.log("pages:", openedPages.length);
				await delay(1000); // Add a delay to prevent busy waiting
			}
			console.log("All opened pages closed");
		};

		await waitForPagesToClose();
	} catch (err) {
		console.log("err after the page.eval", err);
	}
	return tempData;
}

main();
