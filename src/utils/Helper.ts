export const interchanges = [
    { id: 1, name: 'Zero point', distance: 0 },
    { id: 2, name: 'NS Interchange', distance: 5 },
    { id: 3, name: 'Ph4 Interchange', distance: 10 },
    { id: 4, name: 'Ferozpur Interchange', distance: 17 },
    { id: 5, name: 'Lake City Interchange', distance: 24 },
    { id: 6, name: 'Raiwand Interchange', distance: 29 },
    { id: 7, name: 'Bahria Interchange', distance: 34 },
]

export function formatDate(date: Date) {
    const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

export function numberPlateFormatter(text: string) {
    if (!text || !text.length) {
        return '';
    }

    // Remove any non-alphanumeric characters
    const cleanedText = text.replace(/[^a-zA-Z0-9]/g, '');

    // Split letters and numbers
    const letters = cleanedText.slice(0, 3).toUpperCase(); // First 3 characters as letters
    const numbers = cleanedText.slice(3, 6); // Next 3 characters as numbers

    // Format as LLL-NNN
    const formatted = letters + (numbers ? `-${numbers}` : '');

    return formatted
}

export const baseRate = 20;
export const distanceRate = 0.2;
export const weekendMultiplier = 1.5;
export const nationalHolidays = ["03-23", "08-14", "12-25"]; // Format: MM-DD

export const distanceBetweenTwoInterchanges = (entryPoint: string, exitPoint: string) => {
    const entryDistance = interchanges.find(res => res.name === entryPoint)?.distance!;
    const exitDistance = interchanges.find(res => res.name === exitPoint)?.distance!;

    const distanceTraveled = Math.abs(exitDistance - entryDistance);

    return distanceTraveled;
}
