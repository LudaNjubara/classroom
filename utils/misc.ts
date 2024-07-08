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

export function formatFileSize(bytes?: number) {
    if (!bytes) {
        return "0 Bytes";
    }
    bytes = Number(bytes);
    if (bytes === 0) {
        return "0 Bytes";
    }
    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDateTime(date: Date) {
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}