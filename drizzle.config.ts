export default {
	schema: "./src/server/db/schema/*", //separate the schemas
	driver: "pg",
	verbose: true,
	dbCredentials: {
		connectionString: process.env.DATABASE_URL,
	},
	out: "./src/server/drizzle",
	// tablesFilter: ["t3-drzl_*"],
};
