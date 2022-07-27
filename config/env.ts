import * as dotenv from "dotenv";

dotenv.config();

export const env = {
	// ["local", "dev", "preprod", "production"]
	env: process.env.ENV || process.env.NODE_ENV || "local",
	server: {
		port: process.env.SERVER_PORT || 8081,
		admin: {
			user: process.env.SERVER_ADMIN_USER || "admin",
			password: process.env.SERVER_ADMIN_PASSWORD || ""
		},
		geniusApiKey: process.env.GENIUS_API_KEY || ""
	}
};
