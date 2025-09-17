/**
 * Masks the local part of an email address for privacy.
 * - If the local part is 2 characters or less, only the first character is shown, the rest are replaced by asterisks.
 * - If the local part is longer, the first 2 and last 2 characters are shown, the middle is replaced by asterisks.
 * - If the input is not a valid email, returns the input as-is.
 * - Example: "john.doe@example.com" -> "jo****doe@example.com"
 *
 * @param {string} email - The email address to mask.
 * @returns {string} The masked email address.
 */

export function maskEmail(email) {
    if (!email || typeof email !== 'string' || !email.includes('@')) {
        return email; 
    }

    const [localPart, domainPart] = email.split('@');
    let maskedLocalPart = '';

    if (localPart.length <= 2) {
        maskedLocalPart = localPart.charAt(0) + '*'.repeat(localPart.length - 1);
    } else if (localPart.length > 2) {
        const start = localPart.substring(0, 2);
        const end = localPart.substring(localPart.length - 2);
        const middleMask = '*'.repeat(Math.max(1, localPart.length - 4));
        maskedLocalPart = start + middleMask + end;
    }

    return `${maskedLocalPart}@${domainPart}`;
}