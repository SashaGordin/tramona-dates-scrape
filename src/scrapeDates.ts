import type { Page } from "puppeteer";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function scrapeDates(page: Page) {
	await delay(3000);

	page.on("console", (msg) => {
		for (let i = 0; i < msg.args().length; ++i) {
			console.log(`${i}: ${msg.args()[i]}`);
		}
	});

	return await page.evaluate(async () => {
		//grab all text
		const propertyDescriptions = document.querySelectorAll(
			'[class*="propertyDescription"]:not([class*="propertyDescriptionWrapper"])'
		);
		const propertyTexts = Array.from(propertyDescriptions)
			.map((description) => description.textContent?.trim())
			.filter(Boolean)
			.toString();

		const titleEndIndex = propertyTexts.indexOf("Description");
		const title = propertyTexts.substring(0, titleEndIndex);

		//grab all dates
		const allDates: Date[] = [];
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
				console.log("error while clicking dates", err);
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

			const dates = filteredAriaLabels.map((td) => {
				const ariaLabel = td.getAttribute("aria-label")!;
				const dateStartIndex = ariaLabel.indexOf(",") + 2;
				const dateEndIndex = ariaLabel.indexOf(",", dateStartIndex + 1); // Find the index of the next comma after the month

				// Extract the full date string
				const dateString = ariaLabel.substring(
					dateStartIndex,
					dateEndIndex
				);

				console.log(
					"adding:",
					`${dateString.trim()}, ${new Date().getFullYear()}`
				);

				return new Date(
					`${dateString.trim()}, ${new Date().getFullYear()}`
				);
			});

			console.log("unfiltered:", dates);

			console.log(
				"filtered:",
				dates.filter((d) => !isNaN(d.getTime())).filter(Boolean)
			);

			allDates.push(
				...dates.filter((d) => !isNaN(d.getTime())).filter(Boolean)
			);
		}

		return {
			allDates,
			title,
		};
	});
}
