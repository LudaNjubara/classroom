export function sanitizeInput(input: string) {
    // Trim the input
    let sanitizedInput = input.trim();

    // Remove extra spaces between words
    sanitizedInput = sanitizedInput.replace(/\s\s+/g, ' ');

    // Normalize the string
    sanitizedInput = sanitizedInput.normalize('NFC');

    return sanitizedInput;
}

export function isToday(date: Date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}