import { eq } from "drizzle-orm";
import { db } from "../db";
import { bookedDates, properties } from "../db/schema";

await db
	.select({ propertyName: properties.name, date: bookedDates.date })
	.from(bookedDates)
	.innerJoin(properties, eq(bookedDates.propertyId, properties.id))
	.where(
		eq(
			properties.originalListingUrl,
			"https://alter.guestybookings.com/properties"
		)
	)
	.then(console.log);

process.exit();
