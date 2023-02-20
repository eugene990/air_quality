/**
 * Converts string to snake case
 */
 export const toSnakeCase = (input: string): string =>
 (input.match(/[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g) ?? []).map(x => x.toLowerCase()).join('_');
 