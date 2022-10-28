import { transport } from 'winston';
export interface WinstonOption {
	transports: transport[],
	exceptionHandlers: transport[]
}