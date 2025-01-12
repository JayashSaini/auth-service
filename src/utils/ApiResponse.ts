class ApiResponse<T> {
	statusCode: number;
	data: T;
	message: string;
	success: boolean;

	/**
	 *
	 * @param statusCode - HTTP status code for the response.
	 * @param data - The data to be sent in the response.
	 * @param message - Optional message (defaults to "Success").
	 */
	constructor(statusCode: number, data: T, message: string = "Success") {
		this.statusCode = statusCode;
		this.data = data;
		this.message = message;
		this.success = statusCode < 400;
	}
}

export { ApiResponse };
