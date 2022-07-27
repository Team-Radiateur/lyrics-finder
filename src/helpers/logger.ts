import { NextFunction, Request, Response } from "express";

const colors = {
	bright: "\x1b[1m",
	dim: "\x1b[2m",
	underscore: "\x1b[4m",
	blink: "\x1b[5m",
	reverse: "\x1b[7m",
	hidden: "\x1b[8m",
	black: "\x1b[30m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	cyan: "\x1b[36m",
	white: "\x1b[37m",
	bgblack: "\x1b[40m",
	bgred: "\x1b[41m",
	bggreen: "\x1b[42m",
	bgyellow: "\x1b[43m",
	bgblue: "\x1b[44m",
	bgmagenta: "\x1b[45m",
	bgcyan: "\x1b[46m",
	bgwhite: "\x1b[47m",
	reset: "\x1b[0m"
};

type colorName = keyof typeof colors;

const getColorCodeByName = (name: colorName): string => {
	const color = colors[name];
	return color || "\x1b[0m";
};

export function logColor(str: string, color?: colorName): void {
	const formattedColor = color ? color : "reset";

	const colorCode = getColorCodeByName(formattedColor);

	colorCode ? console.log(colorCode, str, getColorCodeByName("reset")) : console.log(str);
}

function readableNow() {
	const now = new Date(Date.now());
	return `${now.toISOString()}`;
}

const resetColor = getColorCodeByName("reset");

function loggerDebug(text: string, ...args: unknown[]): void {
	console.log(`${readableNow()} 🔧 ${getColorCodeByName("blue")}Debug${resetColor}: ${text}`, ...args);
}
function loggerInfo(text: string, ...args: unknown[]): void {
	console.log(`${readableNow()} 💡 ${getColorCodeByName("green")}Info${resetColor}: ${text}`, ...args);
}
function loggerWarning(text: string, ...args: unknown[]): void {
	console.log(`${readableNow()} ⚠️ ${getColorCodeByName("yellow")}Warning${resetColor}: ${text}`, ...args);
}
function loggerError(text: string, ...args: unknown[]): void {
	console.log(`${readableNow()} ❌ ${getColorCodeByName("red")}Error${resetColor}: ${text}`, ...args);
}

export const logger = {
	debug: loggerDebug,
	info: loggerInfo,
	warning: loggerWarning,
	error: loggerError
};

export const logRequest = (req: Request, _res: Response, next: NextFunction): void => {
	logger.info(`new request ${req.method} ${req.path} from ${req.ip}`);
	next();
};
