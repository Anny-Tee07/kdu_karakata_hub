import { categories } from './categories.js';
import { demoListingSpecs } from './demoListings.js';

export const marketplaceCategoryShortcuts = [
    { slug: 'food-drinks', name: 'Food & Drinks', icon: '🍲', categorySlug: 'food' },
    { slug: 'electronics', name: 'Electronics', icon: '⚡', categorySlug: 'electronics' },
    { slug: 'fashion', name: 'Fashion', icon: '👟', categorySlug: 'fashion-beauty' },
    { slug: 'books-notes', name: 'Books & Notes', icon: '📚', categorySlug: 'academic' },
    { slug: 'beauty-hair', name: 'Beauty & Hair', icon: '💄', categorySlug: 'fashion-beauty' },
    { slug: 'repairs-tech', name: 'Repairs & Tech', icon: '🔧', categorySlug: 'services' },
    { slug: 'hostel-needs', name: 'Hostel Needs', icon: '🛏️', categorySlug: 'hostel-essentials' },
    { slug: 'printing-hub', name: 'Printing Hub', icon: '🖨️', categorySlug: 'academic' },
    { slug: 'groceries', name: 'Groceries', icon: '🛒', categorySlug: 'groceries' },
    { slug: 'footwear', name: 'Footwear', icon: '👟', categorySlug: 'footwear' },
    { slug: 'bags', name: 'Bags', icon: '🎒', categorySlug: 'bags' },
    { slug: 'stationery', name: 'Stationery', icon: '✏️', categorySlug: 'stationery' },
    { slug: 'laundry', name: 'Laundry', icon: '🧺', categorySlug: 'laundry' },
    { slug: 'tutoring', name: 'Tutoring', icon: '📖', categorySlug: 'tutoring' },
];

export const campusLocationGroups = [
    {
        name: 'Hostels',
        locations: ['Abebi', 'Jayieola', 'Bolanle', 'Subomi Balogun', 'New Boys Hostel'],
    },
    {
        name: 'Shops & Food Locations',
        locations: [
            'KDU Cafe Shop 1',
            'KDU Cafe Shop 2',
            'KDU Cafe Shop 3',
            'KDU Cafe Shop 4',
            'KDU Cafe Shop 5',
            'KDU Cafe Shop 6',
            'KDU Cafe Shop 7',
            'KDU Cafe Shop 8',
            'KDU Cafe Shop 9',
            'KDU Cafe Shop 10',
            'Cafeteria',
        ],
    },
];

export const productLocations = campusLocationGroups.flatMap((group) => group.locations);

const aliasSlugsByCategory = {
    food: ['food-drinks'],
    electronics: ['electronics'],
    'fashion-beauty': (product) => (
        /braid|hair|makeup|gele|manicure|beauty/i.test(product.name)
            ? ['beauty-hair']
            : ['fashion']
    ),
    academic: (product) => (
        /print|bind/i.test(product.name) || product.vendor === 'Campus Print Hub'
            ? ['printing-hub']
            : ['books-notes']
    ),
    'hostel-essentials': ['hostel-needs'],
    services: (product) => {
        if (/braid|hair|makeup|gele|manicure|beauty|barber/i.test(product.name)) {
            return ['beauty-hair'];
        }
        return /print|bind/i.test(product.name) || product.vendor === 'Campus Print Hub'
            ? ['printing-hub']
            : ['repairs-tech'];
    },
    groceries: ['groceries'],
    footwear: ['footwear'],
    bags: ['bags'],
    stationery: ['stationery'],
    laundry: ['laundry'],
    tutoring: ['tutoring'],
};

function getCategoryNames(category, product) {
    const names = [category.name];
    const aliases = aliasSlugsByCategory[category.slug] || [];
    const aliasSlugs = typeof aliases === 'function' ? aliases(product) : aliases;

    aliasSlugs.forEach((slug) => {
        const shortcut = marketplaceCategoryShortcuts.find((item) => item.slug === slug);
        if (shortcut) {
            names.push(shortcut.name);
        }
    });

    return names;
}

function getProductId(product) {
    return encodeURIComponent(`${product.vendor}|${product.name}`);
}

const productsById = new Map();

categories.forEach((category) => {
    category.products.forEach((product) => {
        const id = getProductId(product);
        const existingProduct = productsById.get(id);
        const categoryNames = getCategoryNames(category, product);
        const aliases = aliasSlugsByCategory[category.slug] || [];
        const aliasSlugs = typeof aliases === 'function' ? aliases(product) : aliases;

        if (existingProduct) {
            existingProduct.categoryNames.push(...categoryNames);
            existingProduct.categorySlugs.push(category.slug, ...aliasSlugs);
        } else {
            productsById.set(id, {
                ...product,
                id,
                isDemo: true,
                whatsappNumber: '',
                createdAt: 0,
                categoryNames,
                categorySlugs: [category.slug, ...aliasSlugs],
            });
        }
    });
});

const demoImageByCategory = {
    food: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600',
    'fashion-beauty': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600',
    electronics: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600',
    academic: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600',
    'hostel-essentials': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600',
    services: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600',
    groceries: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600',
    footwear: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
    bags: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
    stationery: 'https://images.unsplash.com/photo-1455390582262-044c059277c6?w=600',
    laundry: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600',
    tutoring: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600',
};

demoListingSpecs.forEach((spec, index) => {
    const category = categories.find((item) => item.slug === spec.categorySlug);
    const sellerNumber = String(index + 1).padStart(3, '0');
    const product = {
        ...spec,
        vendor: `Demo Seller ${sellerNumber}`,
        rating: '',
        location: productLocations[index % productLocations.length],
        image: demoImageByCategory[spec.categorySlug],
        action: 'Details',
        actionStyle: '',
        isDemo: true,
        whatsappNumber: '',
        createdAt: index + 1,
    };
    const id = getProductId(product);
    const categoryAliases = aliasSlugsByCategory[category.slug] || [];
    const aliasSlugs = typeof categoryAliases === 'function'
        ? categoryAliases(product)
        : categoryAliases;

    productsById.set(id, {
        ...product,
        id,
        categoryNames: getCategoryNames(category, product),
        categorySlugs: [category.slug, ...aliasSlugs],
    });
});

export const products = Array.from(productsById.values()).map((product) => ({
    ...product,
    categoryNames: [...new Set(product.categoryNames)],
    categorySlugs: [...new Set(product.categorySlugs)],
}));

export function getProductPrice(product) {
    const priceText = String(product.price).replace(/,/g, '');
    const priceNumber = priceText.match(/\d+(?:\.\d+)?/);
    return priceNumber ? Number(priceNumber[0]) : 0;
}
