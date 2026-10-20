import { campusLocationGroups } from '../data/products';
import { categories } from '../data/categories';

export const SELLER_LISTINGS_STORAGE_KEY = 'kduhub-local-seller-listings';

const legacyShopLocationNames = new Map(
    Array.from({ length: 10 }, (_, index) => [
        `Shop ${index + 1}`,
        `KDU Cafe Shop ${index + 1}`,
    ]),
);

export function readSellerListings() {
    const savedListings = window.localStorage.getItem(SELLER_LISTINGS_STORAGE_KEY);
    if (!savedListings) {
        return [];
    }

    const listings = JSON.parse(savedListings);
    if (Array.isArray(listings)) {
        let hasLegacyLocation = false;
        const migratedListings = listings.map((listing) => {
            const updatedLocation = legacyShopLocationNames.get(listing?.location);
            if (!updatedLocation) {
                return listing;
            }
            hasLegacyLocation = true;
            return { ...listing, location: updatedLocation };
        });

        const validatedListings = validateSellerListings(migratedListings);
        if (hasLegacyLocation) {
            saveSellerListings(validatedListings);
        }
        return validatedListings;
    }
    return validateSellerListings(listings);
}

function validateSellerListings(listings) {
    if (!Array.isArray(listings) || !listings.every(isValidSellerListing)) {
        throw new Error('Saved local listings are not in a valid format.');
    }
    return listings;
}

export function saveSellerListings(listings) {
    window.localStorage.setItem(SELLER_LISTINGS_STORAGE_KEY, JSON.stringify(listings));
}

export function isValidWhatsAppNumber(value) {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 8 && digits.length <= 15;
}

export function getWhatsAppLink(listing) {
    const digits = listing.whatsappNumber?.replace(/\D/g, '');
    if (!digits || digits.length < 8 || digits.length > 15) {
        return '';
    }

    const message = encodeURIComponent(`Hi, is "${listing.name}" still available?`);
    return `https://wa.me/${digits}?text=${message}`;
}

export function isValidSellerListing(listing) {
    const allowedLocations = campusLocationGroups.flatMap((group) => group.locations);
    const allowedCategories = categories.map((category) => category.slug);

    return Boolean(
        listing
        && typeof listing.id === 'string'
        && typeof listing.name === 'string'
        && typeof listing.vendor === 'string'
        && typeof listing.description === 'string'
        && typeof listing.price === 'string'
        && allowedCategories.includes(listing.categorySlug)
        && allowedLocations.includes(listing.location)
        && ['available', 'sold', 'unavailable'].includes(listing.status),
    );
}
