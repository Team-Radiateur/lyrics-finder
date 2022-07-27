import { inspect } from "util";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { queryParser } from "express-query-parser";
import { Client } from "genius-lyrics";

import { logger, logRequest } from "./helpers/logger";
import { env } from "../config/env";

const serverConfig = env.server;

const geniusClient = new Client(serverConfig.geniusApiKey);

function createApp() {
	const app = express()
		.use(cors())
		.use(logRequest)
		.use(
			queryParser({
				parseNull: true,
				parseUndefined: true,
				parseBoolean: true,
				parseNumber: true
			})
		);

	if (env.env === "production") {
		app.enable("trust proxy");
	}

	app["get"]("/", (_req: Request, res: Response) => {
		res.status(200).send("Usage: /lyrics/:song where song is the name of the song and the name of the artist");
	});
	app["get"](
		"/lyrics/:song",
		(req: Request, res: Response, next: NextFunction) => {
			const { username, password } = req.headers;

			if (!username || !password || username !== serverConfig.admin.user || password !== serverConfig.admin.password) {
				res.status(401).send("You do not have the right to access this route");
			} else {
				next();
			}
		},
		async (req: Request, res: Response) => {
			const { song } = req.params;
			const found = await geniusClient.songs.search(song);

			if (found.length === 0) {
				res.status(404).json({
					error: 404,
					message: "Song not found"
				});
			}

			try {
				const lyrics = await found[0].lyrics();

				res.status(200).json({
					content: lyrics,
					image: found[0].image
				});
			} catch (error) {
				res.status(500).json({
					error: 500,
					message: "Internal server error"
				});
			}
		}
	);

	return app;
}

async function startApp() {
	try {
		createApp()
			.listen(serverConfig.port, () => {
				logger.info(`App listen on port ${serverConfig.port} 📡\n`);
				logger.info(`environment : `, env.env);
			})
			.on("error", (error: Error & { code: string; port: number }) => {
				logger.error(error.code === "EADDRINUSE" ? `Address in use ${error.port}` : `App Error ${error.code}`);
			});
	} catch (error) {
		logger.error(`App error : ${inspect(error)}`);
	}
}

startApp();
