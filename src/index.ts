import { scrapeUrl } from "./scrapeUrl";
import { lauchPuppeteer } from "./utils";

const urls = [
	 "https://stayawhilevillas.guestybookings.com/properties",
	"https://openairhomes.guestybookings.com/properties",
	"https://staywildflower.guestybookings.com/properties",
	"https://mybookings.guestybookings.com/properties",
	"https://artthaus.guestybookings.com/properties",
	"https://abode.guestybookings.com/properties",
	"https://goodliferesorts.guestybookings.com/properties?city=San+Diego",
	"https://titanbr.guestybookings.com/properties?city=San+Diego",
	"https://alter.guestybookings.com/properties",
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
	// "https://luluhomes.guestybookings.com/properties",
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
	// "https://booknow.vare.properties/properties",
	// "https://kingstreetcollection.guestybookings.com/properties",
	// "https://thenicholas.guestybookings.com/properties",
	// "https://homefrontstays.guestybookings.com/properties",
	// "https://vacationcondosforless.guestybookings.com/properties",
	// "https://oasiscollections.guestybookings.com/properties",
	// "https://staywithhideaway.guestybookings.com/properties",
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
	// "https://seconddoor.guestybookings.com/properties",
	// "https://walkervacationrentals.guestybookings.com/properties",
	// "https://beachhomespuntacana.guestybookings.com/properties",
	// "https://russopg.guestybookings.com/properties",
	// "https://hostedjourney.guestybookings.com/properties",
];

process.on("unhandledRejection", (reason, promise) => {
	console.error("Unhandled Rejection at:", promise, "reason:", reason);
	// You can add additional debugging information here if needed
});

try {
	for (const url of urls) {
		const browser = await lauchPuppeteer();
		const page = await browser.newPage();
		await scrapeUrl(browser, page, url); // Retrieve data from scrapeUrl function
		await browser.close();
	}
} catch (error) {
	console.log("scraping failed:", error);
}

process.exit();
