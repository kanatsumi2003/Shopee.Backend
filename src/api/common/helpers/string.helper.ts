export class StringHelper {
    /**
     * Trims whitespace from both ends of the string.
     */
    static trim(value: string): string {
        return value.trim();
    }

    /**
     * Converts the string to lowercase and trims it.
     */
    static toLower(value: string): string {
        return value.trim().toLowerCase();
    }

    /**
     * Converts the string to uppercase and trims it.
     */
    static toUpper(value: string): string {
        return value.trim().toUpperCase();
    }

    /**
     * Normalizes the string by trimming and converting to lowercase.
     */
    static normalize(value: string): string {
        return this.toLower(this.trim(value));
    }

    /**
     * Capitalizes the first character and lowercases the rest.
     */
    static capitalize(value: string): string {
        const trimmed = this.trim(value);
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    }
}