function formatDateWithoutTimezone(date: Date) {
	if (!(date instanceof Date)) {
		throw new Error("Invalid Date object");
	}

	const options: Intl.DateTimeFormatOptions = {
		weekday: "short", // Abbreviated day name (e.g., "Fri")
		year: "numeric", // Full year (e.g., "2025")
		month: "short", // Abbreviated month name (e.g., "Jan")
		day: "2-digit", // Two-digit day (e.g., "24")
		hour: "2-digit", // Two-digit hour (e.g., "00")
		minute: "2-digit", // Two-digit minute (e.g., "54")
		second: "2-digit", // Two-digit second (e.g., "55")
		hour12: false, // 24-hour format
	};

	// Use toLocaleString to format the date
	return date
		.toLocaleString("en-GB", options)
		.replace(/,(\d{2}):(\d{2}):(\d{2}).*/, ", $1:$2:$3");
}

export { formatDateWithoutTimezone };
