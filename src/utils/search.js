export function normalizeSearchText(value) {
    return String(value ?? '')
        .toLocaleLowerCase()
        .replace(/['’]/g, '')
        .replace(/[^\p{L}\p{N}]+/gu, ' ')
        .trim()
        .replace(/\s+/g, ' ');
}

export function cleanSearchQuery(value) {
    return String(value ?? '').trim().replace(/\s+/g, ' ');
}

export function matchesProductSearch(product, query) {
    const normalizedQuery = normalizeSearchText(query);

    if (!normalizedQuery) {
        return true;
    }

    const searchableText = [
        product.name,
        product.description,
        product.vendor,
        ...(product.categoryNames || []),
    ].map(normalizeSearchText).join(' ');

    const searchWords = normalizedQuery.split(' ');
    return searchWords.every((word) => searchableText.includes(word));
}
