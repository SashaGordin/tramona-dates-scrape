import type { Page } from "puppeteer";

export async function scrapeDates(page: Page) {
	await new Promise((resolve) => setTimeout(resolve, 3000));

	page.on("console", (msg) => {
		for (let i = 0; i < msg.args().length; ++i) {
			console.log(`${i}: ${msg.args()[i]}`);
		}
	});

	return await page.evaluate(async () => {
		//grab all text
		const url = window.location.href;
		// const propertyDescriptions = document.querySelectorAll(
		// 	'[class*="propertyDescription"]:not([class*="propertyDescriptionWrapper"])'
		// );
		// const propertyTexts = Array.from(propertyDescriptions)
		// 	.map((description) => description.textContent?.trim())
		// 	.filter(Boolean)
		// 	.toString();

		// const titleEndIndex = propertyTexts.indexOf("Description");
		// const title = propertyTexts.substring(0, titleEndIndex);

		//grab all dates
		const allDateStrings: string[] = [];

		const expandCalendarButton =
			document.querySelectorAll<HTMLButtonElement>(
				'[class*="Button-content"]'
			);
		expandCalendarButton[0].click();

		await new Promise((resolve) => setTimeout(resolve, 500));

		for (let i = 0; i < 5; i++) {
			const expandCalendarButton =
				document.querySelector<HTMLButtonElement>(
					'[class*="nextButton"]'
				)!;

			try {
				expandCalendarButton.click();
			} catch (err) {
				console.log("error while clicking dates:\n", err);
			}

			await new Promise((resolve) => setTimeout(resolve, 1000));

			const calendarCaptionText = document.querySelectorAll(
				"div.CalendarMonth_caption"
			)[1].textContent!;

			const month = calendarCaptionText.substring(
				0,
				calendarCaptionText.length - 5
			);

			const tdElements = document.querySelectorAll(
				"div.CalendarMonth td.CalendarDay"
			);
			const filteredAriaLabels = Array.from(tdElements).filter((td) => {
				const ariaLabel = td.getAttribute("aria-label")!;
				return ariaLabel.includes(month) && !ariaLabel.includes("Not");
			});

			filteredAriaLabels.forEach((td) => {
				const ariaLabel = td.getAttribute("aria-label")!;
				const dateStartIndex = ariaLabel.indexOf(",") + 2;
				const dateEndIndex = ariaLabel.indexOf(",", dateStartIndex + 1); // Find the index of the next comma after the month

				// Extract the full date string
				const dateString = ariaLabel.substring(
					dateStartIndex,
					dateEndIndex
				);

				const fullDateString = `${dateString.trim()}, ${new Date().getFullYear()}`;

				if (isNaN(new Date(fullDateString).getTime())) {
					console.log("date is invalid, skipping:", fullDateString);
				} else {
					allDateStrings.push(fullDateString);
				}
			});
		}

		return { allDateStrings, url };
	});
}
