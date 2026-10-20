import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { categories } from '../data/categories';
import {
    campusLocationGroups,
    getProductPrice,
    marketplaceCategoryShortcuts,
    products,
} from '../data/products';
import { matchesProductSearch } from '../utils/search';
import { getWhatsAppLink, readSellerListings } from '../utils/sellerListings';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { mapSupabaseListing } from '../data/supabaseListings';

const MAX_PRICE = 50000;
const HOME_PREVIEW_COUNT = 8;
const FAVORITES_STORAGE_KEY = 'kduhub-favorites';

function loadFavoriteIds() {
    return (window.localStorage.getItem(FAVORITES_STORAGE_KEY) || '')
        .split('\n')
        .filter(Boolean);
}

function formatPrice(price) {
    return `₦${Number(price).toLocaleString('en-NG')}`;
}

function loadSellerListingData() {
    try {
        return { listings: readSellerListings(), error: '' };
    } catch (error) {
        return { listings: [], error: error.message };
    }
}

function groupByLocationType(locations) {
    return locations.reduce((groups, location) => {
        const matchingGroup = groups.find((group) => group.name === location.group_name);
        if (matchingGroup) {
            matchingGroup.locations.push(location);
        } else {
            groups.push({ name: location.group_name, locations: [location] });
        }
        return groups;
    }, []);
}

function ProductGrid({ homePreview = false }) {
    const { categorySlug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const searchQuery = searchParams.get('search') || '';
    const selectedLocation = searchParams.get('location') || '';
    const [selectedCategorySlug, setSelectedCategorySlug] = useState(categorySlug || '');
    const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
    const [sortOrder, setSortOrder] = useState('newest');
    const [favoriteIds, setFavoriteIds] = useState(loadFavoriteIds);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [sellerListingData] = useState(
        isSupabaseConfigured ? { listings: [], error: '' } : loadSellerListingData,
    );
    const sellerListings = sellerListingData.listings;
    const listingLoadError = sellerListingData.error;
    const [databaseListings, setDatabaseListings] = useState([]);
    const [databaseCategories, setDatabaseCategories] = useState([]);
    const [databaseLocations, setDatabaseLocations] = useState([]);
    const [backendLoading, setBackendLoading] = useState(isSupabaseConfigured);
    const [backendError, setBackendError] = useState('');
    const dialogRef = useRef(null);
    const lastFocusedElement = useRef(null);

    useEffect(() => {
        if (!supabase) {
            return undefined;
        }

        let active = true;
        Promise.all([
            supabase.from('listings').select('*').order('created_at', { ascending: false }).limit(1000),
            supabase.from('categories').select('slug, name, icon, description').eq('is_active', true).order('name'),
            supabase.from('campus_locations').select('name, group_name').eq('is_active', true).order('group_name').order('name'),
        ]).then(([listingResult, categoryResult, locationResult]) => {
            if (!active) {
                return;
            }
            const queryError = [listingResult, categoryResult, locationResult]
                .find((result) => result.error)?.error;
            if (queryError) {
                setBackendError(`Could not load marketplace data: ${queryError.message}`);
            } else {
                setDatabaseListings(listingResult.data.map((listing) => (
                    mapSupabaseListing(listing, categoryResult.data)
                )));
                setDatabaseCategories(categoryResult.data);
                setDatabaseLocations(locationResult.data);
            }
            setBackendLoading(false);
        }).catch((queryError) => {
            if (!active) {
                return;
            }
            setBackendError(`Could not load marketplace data: ${queryError.message}`);
            setBackendLoading(false);
        });

        return () => {
            active = false;
        };
    }, []);

    const closeProductDialog = useCallback(() => {
        setSelectedProduct(null);
        lastFocusedElement.current?.focus();
    }, []);

    useEffect(() => {
        if (!selectedProduct) {
            return undefined;
        }

        dialogRef.current?.focus();
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') {
                closeProductDialog();
            }
        };

        window.addEventListener('keydown', closeOnEscape);
        return () => window.removeEventListener('keydown', closeOnEscape);
    }, [selectedProduct, closeProductDialog]);

    const openProductDialog = (product) => {
        lastFocusedElement.current = document.activeElement;
        setSelectedProduct(product);
    };

    const categoryForPage = categories.find((category) => (
        category.slug === selectedCategorySlug
    ));
    const shortcutForPage = marketplaceCategoryShortcuts.find((shortcut) => (
        shortcut.slug === selectedCategorySlug
    ));
    const databaseCategoryForPage = databaseCategories.find((category) => (
        category.slug === selectedCategorySlug
    ));
    const selectedCategory = categoryForPage || shortcutForPage || databaseCategoryForPage;

    const catalogProducts = isSupabaseConfigured
        ? databaseListings
        : [
            ...products,
            ...sellerListings.filter((listing) => listing.status === 'available'),
        ];
    const filterCategories = isSupabaseConfigured
        ? databaseCategories
        : marketplaceCategoryShortcuts;
    const filterLocations = isSupabaseConfigured
        ? databaseLocations
        : campusLocationGroups.flatMap((group) => (
            group.locations.map((name) => ({ name, group_name: group.name }))
        ));
    const visibleProducts = catalogProducts.filter((product) => {
        const matchesCategory = !selectedCategorySlug
            || product.categorySlugs.includes(selectedCategorySlug);
        const matchesLocation = !selectedLocation
            || product.location === selectedLocation;
        const matchesPrice = getProductPrice(product) <= maxPrice;

        return matchesCategory
            && matchesLocation
            && matchesPrice
            && matchesProductSearch(product, searchQuery);
    });

    const sortedProducts = [...visibleProducts].sort((first, second) => {
        if (sortOrder === 'price-low') {
            return getProductPrice(first) - getProductPrice(second);
        }
        if (sortOrder === 'price-high') {
            return getProductPrice(second) - getProductPrice(first);
        }
        return Number(second.createdAt) - Number(first.createdAt);
    });
    const displayedProducts = homePreview
        ? sortedProducts.slice(0, HOME_PREVIEW_COUNT)
        : sortedProducts;

    const handleLocationChange = (event) => {
        const nextParams = new URLSearchParams(searchParams);
        const nextLocation = event.target.value;

        if (nextLocation) {
            nextParams.set('location', nextLocation);
        } else {
            nextParams.delete('location');
        }
        setSearchParams(nextParams);
    };

    const toggleFavorite = (productId) => {
        const nextFavoriteIds = favoriteIds.includes(productId)
            ? favoriteIds.filter((savedId) => savedId !== productId)
            : [...favoriteIds, productId];

        setFavoriteIds(nextFavoriteIds);
        window.localStorage.setItem(FAVORITES_STORAGE_KEY, nextFavoriteIds.join('\n'));
    };

    const resetFilters = () => {
        setSelectedCategorySlug('');
        setMaxPrice(MAX_PRICE);
        setSortOrder('newest');

        if (categorySlug) {
            navigate('/categories');
        } else {
            setSearchParams({});
        }
    };

    return (
        <div className={`marketplace-layout${homePreview ? ' marketplace-layout-home' : ''}`} id="explore">
            {!homePreview && <aside className="filters-sidebar" aria-label="Listing filters">
                <div className="filters-header">
                    <h2>Filters</h2>
                    <button className="reset-btn" type="button" onClick={resetFilters}>
                        Reset
                    </button>
                </div>

                <div className="filter-group">
                    <label htmlFor="category-filter" className="filter-group-title">Category</label>
                    <select
                        id="category-filter"
                        className="sort-select filter-select"
                        value={selectedCategorySlug}
                        onChange={(event) => setSelectedCategorySlug(event.target.value)}
                    >
                        <option value="">All categories</option>
                        {filterCategories.map((category) => (
                            <option key={category.slug} value={category.slug}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="location-filter" className="filter-group-title">Campus location</label>
                    <select
                        id="location-filter"
                        className="sort-select filter-select"
                        value={selectedLocation}
                        onChange={handleLocationChange}
                    >
                        <option value="">All locations</option>
                        {isSupabaseConfigured
                            ? groupByLocationType(filterLocations).map((group) => (
                                    <optgroup key={group.name} label={group.name}>
                                        {group.locations.map((location) => (
                                            <option key={location.name} value={location.name}>{location.name}</option>
                                        ))}
                                    </optgroup>
                                ))
                            : campusLocationGroups.map((group) => (
                                <optgroup key={group.name} label={group.name}>
                                    {group.locations.map((location) => (
                                        <option key={location} value={location}>{location}</option>
                                    ))}
                                </optgroup>
                            ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="price-filter" className="filter-group-title">
                        Maximum price: {formatPrice(maxPrice)}
                    </label>
                    <input
                        id="price-filter"
                        type="range"
                        min="500"
                        max={MAX_PRICE}
                        step="500"
                        value={maxPrice}
                        onChange={(event) => setMaxPrice(Number(event.target.value))}
                        className="price-slider"
                    />
                    <div className="price-range-labels">
                        <span>₦500</span>
                        <span>₦50,000</span>
                    </div>
                </div>

                <p className="filter-data-note">
                    Demo listings are not live inventory. Seller identities and availability are not verified.
                </p>
            </aside>}

            <main className="marketplace-main">
                {homePreview && (
                    <header className="category-page-header">
                        <span className="section-tag">KDU campus marketplace</span>
                        <h2 className="category-page-title">Featured demo listings</h2>
                        <p>Explore a sample of the 100-item demonstration catalogue.</p>
                    </header>
                )}
                {selectedCategory && (
                    <header className="category-page-header">
                        <span className="section-tag">
                            {selectedCategory.icon} {selectedCategory.name}
                        </span>
                        <h1 className="category-page-title">{selectedCategory.name}</h1>
                        {selectedCategory.description && <p>{selectedCategory.description}</p>}
                        <Link className="category-back-link" to="/categories">
                            View all categories
                        </Link>
                    </header>
                )}

                {listingLoadError && (
                    <p className="search-empty-state" role="alert">
                        Your browser-local listings could not be loaded: {listingLoadError}
                    </p>
                )}
                {backendError && <p className="search-empty-state" role="alert">{backendError}</p>}

                <div className="listings-header-bar">
                    <span className="listings-count" aria-live="polite">
                        Showing {displayedProducts.length} of {sortedProducts.length} matching listings
                    </span>
                    <div className="sort-container">
                        <label htmlFor="product-sort">Sort by:</label>
                        <select
                            id="product-sort"
                            className="sort-select"
                            value={sortOrder}
                            onChange={(event) => setSortOrder(event.target.value)}
                        >
                            <option value="newest">Newest first</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {backendLoading ? <p className="search-empty-state" role="status">Loading marketplace listings…</p> : displayedProducts.length > 0 ? (
                    <div className="products-grid">
                        {displayedProducts.map((product) => {
                            const isFavorite = favoriteIds.includes(product.id);

                            return (
                                <article className="product-card" key={product.id}>
                                    <div className="product-image-container">
                                        <span className="product-location-badge">{product.location}</span>
                                        <button
                                            className="favorite-btn"
                                            type="button"
                                            aria-label={isFavorite
                                                ? `Remove ${product.name} from saved listings`
                                                : `Save ${product.name}`}
                                            aria-pressed={isFavorite}
                                            onClick={() => toggleFavorite(product.id)}
                                        >
                                            {isFavorite ? '❤️' : '🤍'}
                                        </button>
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                onError={(event) => {
                                                    event.currentTarget.parentElement?.classList.add('image-unavailable');
                                                }}
                                            />
                                        ) : (
                                            <span className="image-fallback-label">Image not provided</span>
                                        )}
                                    </div>
                                    <div className="product-info">
                                        <div className="vendor-row">
                                            {product.isDemo ? 'Demo listing' : 'Browser-local preview'} · {product.vendor}
                                        </div>
                                        <h2 className="product-title">{product.name}</h2>
                                        <p className="product-desc">{product.description}</p>
                                        <div className="product-footer">
                                            <span className="product-price">{product.price}</span>
                                            <button
                                                className={`card-action-btn ${product.actionStyle}`}
                                                type="button"
                                                onClick={() => openProductDialog(product)}
                                            >
                                                Quick view
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <p className="search-empty-state" role="status">
                        No listings match the current search and filters. Try changing your search,
                        category, location, or maximum price.
                        {' '}
                        <button className="text-button" type="button" onClick={resetFilters}>
                            Clear filters
                        </button>
                    </p>
                )}

                {homePreview && (
                    <Link className="view-more-listings" to="/categories">
                        View More Listings
                    </Link>
                )}
            </main>

            {selectedProduct && (
                <div
                    className="product-dialog-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeProductDialog();
                        }
                    }}
                >
                    <section
                        className="product-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="product-dialog-title"
                        tabIndex="-1"
                        ref={dialogRef}
                    >
                        <button
                            className="product-dialog-close"
                            type="button"
                            aria-label="Close listing details"
                            onClick={closeProductDialog}
                        >
                            ×
                        </button>
                        <span className="section-tag">Listing details</span>
                        <h2 id="product-dialog-title">{selectedProduct.name}</h2>
                        <p className="vendor-row">
                            {selectedProduct.isDemo ? 'Demo listing' : 'Browser-local preview'} · {selectedProduct.vendor}
                        </p>
                        <p>{selectedProduct.description}</p>
                        <dl className="product-dialog-facts">
                            <div><dt>Price</dt><dd>{selectedProduct.price}</dd></div>
                            <div><dt>Location</dt><dd>{selectedProduct.location}</dd></div>
                            <div><dt>Category</dt><dd>{selectedProduct.categoryNames[0]}</dd></div>
                        </dl>
                        <p className="product-dialog-note">
                            {selectedProduct.isDemo
                                ? 'Demo listing only. Confirm all details with the seller before arranging anything.'
                                : 'This listing is saved only in this browser and is not published to other visitors.'}
                            {' '}This site does not process orders or payments.
                        </p>
                        {getWhatsAppLink(selectedProduct) && (
                            <a
                                className="btn-post product-contact-link"
                                href={getWhatsAppLink(selectedProduct)}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Ask the seller on WhatsApp
                            </a>
                        )}
                        <Link
                            className="card-action-btn product-dialog-details-link"
                            to={`/product/${encodeURIComponent(selectedProduct.id)}`}
                            onClick={closeProductDialog}
                        >
                            Open full listing
                        </Link>
                        <button
                            className="card-action-btn"
                            type="button"
                            onClick={closeProductDialog}
                        >
                            Close
                        </button>
                    </section>
                </div>
            )}
        </div>
    );
}

export default ProductGrid;
