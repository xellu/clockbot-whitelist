import { marked } from 'marked';
import DOMPurify from 'dompurify';

export function toAgo(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();

    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) { return `${years} year${years > 1 ? 's' : ''} ago`; }
    if (months > 0) { return `${months} month${months > 1 ? 's' : ''} ago`; }
    if (days > 0) { return `${days} day${days > 1 ? 's' : ''} ago`; }
    if (hours > 0) { return `${hours} hour${hours > 1 ? 's' : ''} ago`; }
    if (minutes > 0) { return `${minutes} minute${minutes > 1 ? 's' : ''} ago`; }

    return `just now`;
}

export function toIn(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();

    const diff = date.getTime() - now.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) { return `in ${years} year${years > 1 ? 's' : ''}`; }
    if (months > 0) { return `in ${months} month${months > 1 ? 's' : ''}`; }
    if (days > 0) { return `in ${days} day${days > 1 ? 's' : ''}`; }
    if (hours > 0) { return `in ${hours} hour${hours > 1 ? 's' : ''}`; }
    if (minutes > 0) { return `in ${minutes} minute${minutes > 1 ? 's' : ''}`; }

    return `now`;
}

export function MarkdownParser(content: string): string {
    const html: string = marked(content) as string;
    // const clean = DOMPurify.sanitize(html || "", { USE_PROFILES: { html: true } });
    
    return html;
}

export function toDataUnit(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unit = 0;

    while (bytes >= 1024) {
        bytes /= 1024;
        unit++;
    }

    return bytes.toFixed(bytes.toFixed(1).toString().endsWith("0") ? 0 : 1) + units[unit];
}

export function constructDomain(domain: string, subdomain?: string | null): string {
    return subdomain ? `${subdomain}.${domain}` : domain;
}