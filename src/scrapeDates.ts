import type { Page } from "puppeteer";

export async function scrapeDates(page: Page) {
	await new Promise((resolve) => setTimeout(resolve, 3000));

	page.on("console", (msg) => {
		for (let i = 0; i < msg.args().length; ++i) {
			console.log(`${i}: ${msg.args()[i]}`);
		}
	});

	return await page.evaluate(async () => {
		// Grab the current URL
		const url = window.location.href;

		// Array to store all date strings
		const allDateStrings: string[] = [];

		// Find and click the expand calendar button
		const expandCalendarButton = document.querySelector<HTMLButtonElement>('[class*="Button-content"]');

		await new Promise((resolve) => setTimeout(resolve, 1000));

		if (expandCalendarButton) {
			try {
				expandCalendarButton.click();
			} catch (err) {
				console.log("Error while clicking dates1:\n", err);
			}
		} else {
			console.log("Expand calendar button not found.");
		}

		await new Promise((resolve) => setTimeout(resolve, 500));

		for (let i = 0; i < 5; i++) {
			const nextButton = document.querySelector<HTMLButtonElement>('[class*="nextButton"]');

			await new Promise((resolve) => setTimeout(resolve, 1000));

			if (nextButton) {
				try {
					nextButton.click();
				} catch (err) {
					console.log("Error while clicking dates2:\n", err);
				}
			} else {
				console.log("Next button not found.");
			}

			await new Promise((resolve) => setTimeout(resolve, 1000));

			const calendarCaptionElement = document.querySelectorAll("div.CalendarMonth_caption")[1];
			if (!calendarCaptionElement) {
				console.log("Calendar caption element not found.");
				continue;
			}

			const calendarCaptionText = calendarCaptionElement.textContent!;

			const month = calendarCaptionText.substring(0, calendarCaptionText.length - 5);

			const tdElements = document.querySelectorAll("div.CalendarMonth td.CalendarDay");
			const filteredAriaLabels = Array.from(tdElements).filter((td) => {
				const ariaLabel = td.getAttribute("aria-label")!;
				return ariaLabel.includes(month) && ariaLabel.includes("Not");
			});

			filteredAriaLabels.forEach((td) => {
				const ariaLabel = td.getAttribute("aria-label")!;
				const dateStartIndex = ariaLabel.indexOf(",") + 2;
				const dateEndIndex = ariaLabel.indexOf(",", dateStartIndex + 1); // Find the index of the next comma after the month

				// Extract the full date string
				const dateString = ariaLabel.substring(dateStartIndex, dateEndIndex);
				const fullDateString = `${dateString.trim()}, ${new Date().getFullYear()}`;

				if (isNaN(new Date(fullDateString).getTime())) {
					console.log("Date is invalid, skipping:", fullDateString);
				} else {
					allDateStrings.push(fullDateString);
				}
			});
		}

		return { allDateStrings, url };
	});
}
