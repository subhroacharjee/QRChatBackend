import { WinstonOption } from '../interface/Logger';
import winston from 'winston';

const consoleFormat = winston.format.combine(
	winston.format.colorize(),
	winston.format.timestamp(),
	winston.format.align(),
	winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);


const winstonOptions: WinstonOption = {

	transports: [
		new winston.transports.Console({
			format: consoleFormat
		})
	],
	exceptionHandlers: [
		new winston.transports.Console(),
	]
};

if (process.env.ENV === 'PROD') {
	winstonOptions.transports = winstonOptions.transports.concat([
		new winston.transports.File({
			filename: 'combined.log',
			dirname: '.'
		}),
		new winston.transports.File({
			level: 'error',
			filename: 'error.log',
			dirname: '.'
		})]);
	winstonOptions.exceptionHandlers.push(new winston.transports.File({ filename: './exceptions.log' }));
}

const Logger = winston.createLogger(winstonOptions);

export default Logger;