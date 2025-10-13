export const maskEmail = (email: string): string => {
    if (!email || typeof email !== 'string') return '';
    const at = email.indexOf('@');
    if (at <= 1) return email;
    const local = email.substring(0, at);
    const domain = email.substring(at);
    const masked = local.length > 2 ? local.substring(0,2) + '*'.repeat(local.length - 2) : '*'.repeat(local.length);
    return masked + domain;
 };
