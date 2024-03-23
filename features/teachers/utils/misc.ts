export function sanitizeInput(input: string) {
    // Trim the input
    let sanitizedInput = input.trim();

    // Remove extra spaces between words
    sanitizedInput = sanitizedInput.replace(/\s\s+/g, ' ');

    // Normalize the string
    sanitizedInput = sanitizedInput.normalize('NFC');

    return sanitizedInput;
}