export interface ControllerReturnType<T> {
	error:ErrorInterface | null,
	data:T | null
}

export interface ErrorInterface {
	[key:string]: string | string[]
}