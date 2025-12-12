

// Arrays for the words for numbers
const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

// Arrays for larger number groupings
const thousands = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion'];

/**
 * Converts a number less than 1000 into words.
 * @param n The number to convert.
 * @returns The number in words.
 */
function convertChunk(n: number): string {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    
    return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 !== 0 ? ' ' + convertChunk(n % 100) : '');
}

/**
 * Converts a number into words.
 * @param n The number to convert.
 * @returns The number in words, capitalized.
 */
export function numberToWords(n: number): string {
    if (n === 0) return 'Zero';

    if (n < 0) {
        return 'Minus ' + numberToWords(Math.abs(n));
    }
    
    let words = '';
    let i = 0;

    do {
        const chunk = n % 1000;
        if (chunk !== 0) {
            words = convertChunk(chunk) + (thousands[i] ? ' ' + thousands[i] : '') + (words ? ' ' + words : '');
        }
        n = Math.floor(n / 1000);
        i++;
    } while (n > 0);

    // Capitalize the first letter and trim whitespace
    const result = words.trim();
    return result.charAt(0).toUpperCase() + result.slice(1);
}
