import { useState } from 'react';
import { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { useMarketplaceOptions } from '../data/useMarketplaceOptions';
import { marketplaceCategoryShortcuts } from '../data/products';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { useAuth } from '../auth/useAuth';
import { mapSupabaseListing } from '../data/supabaseListings';
import {
    isValidWhatsAppNumber,
    readSellerListings,
    saveSellerListings,
} from '../utils/sellerListings';

const emptyForm = {
    vendor: '',
    name: '',
    description: '',
    price: '',
    categorySlug: '',
    location: '',
    image: '',
    whatsappNumber: '',
    status: 'available',
};

function loadInitialListings() {
    try {
        return { listings: readSellerListings(), error: '' };
    } catch (error) {
        return { listings: [], error: error.message };
    }
}

function VendorHub() {
    const { categories, locations, loading: optionsLoading } = useMarketplaceOptions();
    const { user, profile } = useAuth();
    const userId = user?.id;
    const [initialListings] = useState(
        isSupabaseConfigured ? { listings: [], error: '' } : loadInitialListings,
    );
    const [listings, setListings] = useState(initialListings.listings);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState('');
    const [error, setError] = useState('');
    const storageError = initialListings.error;
    const [success, setSuccess] = useState('');

    const loadMyListings = useCallback(async () => {
        if (!supabase || !userId) {
            return;
        }
        try {
            const { data, error: queryError } = await supabase
                .from('listings')
                .select('*')
                .eq('owner_id', userId)
                .order('created_at', { ascending: false });
            if (queryError) {
                setError(`Could not load your listings: ${queryError.message}`);
                return;
            }
            setListings(data.map((listing) => mapSupabaseListing(listing, categories)));
        } catch (queryError) {
            setError(`Could not load your listings: ${queryError.message}`);
        }
    }, [userId, categories]);

    useEffect(() => {
        if (isSupabaseConfigured && userId && categories.length > 0) {
            loadMyListings();
        }
    }, [userId, categories, loadMyListings]);

    const updateForm = (event) => {
        setForm((currentForm) => ({ ...currentForm, [event.target.name]: event.target.value }));
    };

    const saveForm = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        const price = Number(form.price);
        if (
            !form.vendor.trim()
            || !form.name.trim()
            || !form.description.trim()
            || !form.categorySlug
            || !form.location
            || !Number.isFinite(price)
            || price <= 0
            || price > 50000
        ) {
            setError('Add a seller display name, listing details, category, location, and a price between ₦1 and ₦50,000.');
            return;
        }
        if (form.whatsappNumber && !isValidWhatsAppNumber(form.whatsappNumber)) {
            setError('Enter a valid WhatsApp number with its country code, or leave the field empty.');
            return;
        }
        if (form.image) {
            try {
                if (new URL(form.image).protocol !== 'https:') {
                    setError('Image links must use HTTPS.');
                    return;
                }
            } catch {
                setError('Enter a valid HTTPS image link or leave the field empty.');
                return;
            }
        }

        const category = categories.find((item) => item.slug === form.categorySlug);
        if (!category) {
            setError('Choose an available category before saving this listing.');
            return;
        }
        const matchingShortcut = marketplaceCategoryShortcuts.find(
            (shortcut) => shortcut.categorySlug === category.slug,
        );
        const currentListing = listings.find((listing) => listing.id === editingId);
        if (isSupabaseConfigured) {
            const listingRecord = {
                category_slug: form.categorySlug,
                location_name: form.location,
                name: form.name.trim(),
                description: form.description.trim(),
                price,
                image_url: form.image.trim(),
                seller_name: profile?.display_name || form.vendor.trim(),
                whatsapp_number: form.whatsappNumber.trim(),
                status: form.status,
                is_demo: false,
            };
            const request = editingId
                ? supabase.from('listings').update(listingRecord).eq('id', editingId)
                : supabase.from('listings').insert({ ...listingRecord, owner_id: user.id });

            try {
                const { error: saveError } = await request;
                if (saveError) {
                    setError(`Could not save listing: ${saveError.message}`);
                    return;
                }
                await loadMyListings();
                setForm(emptyForm);
                setEditingId('');
                setSuccess('Listing saved to your authenticated marketplace account.');
            } catch (saveError) {
                setError(`Could not save listing: ${saveError.message}`);
            }
            return;
        }

        const id = editingId || `local-${globalThis.crypto?.randomUUID?.() || Date.now()}`;
        const listing = {
            id,
            vendor: form.vendor.trim(),
            name: form.name.trim(),
            description: form.description.trim(),
            price: `₦${price.toLocaleString('en-NG')}`,
            categorySlug: category.slug,
            categoryNames: [category.name],
            categorySlugs: [category.slug, ...(matchingShortcut ? [matchingShortcut.slug] : [])],
            location: form.location,
            image: form.image.trim(),
            whatsappNumber: form.whatsappNumber.trim(),
            status: form.status,
            isDemo: false,
            createdAt: currentListing?.createdAt || Date.now(),
        };
        const nextListings = editingId
            ? listings.map((item) => item.id === editingId ? listing : item)
            : [...listings, listing];

        try {
            saveSellerListings(nextListings);
            setListings(nextListings);
            setForm(emptyForm);
            setEditingId('');
            setSuccess(
                'Saved in this browser only. This listing is not published to other users or a server.',
            );
        } catch (saveError) {
            setError(`Could not save this browser-local listing: ${saveError.message}`);
        }
    };

    const editListing = (listing) => {
        setForm({
            vendor: listing.vendor,
            name: listing.name,
            description: listing.description,
            price: String(Number(listing.price.replace(/[^\d.]/g, ''))),
            categorySlug: listing.categorySlug,
            location: listing.location,
            image: listing.image || '',
            whatsappNumber: listing.whatsappNumber || '',
            status: listing.status,
        });
        setEditingId(listing.id);
        setError('');
        setSuccess('');
    };

    const cancelEdit = () => {
        setForm(emptyForm);
        setEditingId('');
        setError('');
    };

    const updateStatus = (listing, status) => {
        if (isSupabaseConfigured) {
            supabase.from('listings').update({ status }).eq('id', listing.id).then(
                async ({ error: updateError }) => {
                    if (updateError) {
                        setError(`Could not update listing status: ${updateError.message}`);
                        return;
                    }
                    await loadMyListings();
                    setSuccess(`Listing marked ${status}.`);
                },
            ).catch((updateError) => {
                setError(`Could not update listing status: ${updateError.message}`);
            });
            return;
        }
        const nextListings = listings.map((item) => (
            item.id === listing.id ? { ...item, status } : item
        ));
        try {
            saveSellerListings(nextListings);
            setListings(nextListings);
            setSuccess(`Listing marked ${status}. The change is saved only in this browser.`);
        } catch (saveError) {
            setError(`Could not update this browser-local listing: ${saveError.message}`);
        }
    };

    return (
        <div>
            <Navbar />
            <main className="category-page-container">
                <Link className="category-back-link" to="/">← Back to marketplace</Link>
                <header className="category-page-header">
                    <span className="section-tag">For campus sellers</span>
                    <h1 className="category-page-title">Vendor Hub</h1>
                    <p>
                        {isSupabaseConfigured
                            ? 'Create and manage listings attached to your signed-in account.'
                            : 'Create a local listing preview. No account, server, or public publishing is configured.'}
                    </p>
                </header>
                <section className="vendor-hub-notice">
                    <p>
                        {isSupabaseConfigured
                            ? 'Listings are saved to Supabase. Access is restricted by database row-level security to the owner and administrators.'
                            : 'Demo listing data is stored in this browser only. It is not uploaded, shared with other visitors, or protected by sign-in.'}
                    </p>
                    {isSupabaseConfigured && !user && (
                        <p className="account-status-message">
                            <Link to="/signin">Sign in</Link> to create and manage your listings.
                        </p>
                    )}
                    {isSupabaseConfigured && profile?.is_suspended && (
                        <p className="form-error" role="alert">This account is suspended from marketplace management.</p>
                    )}
                    {optionsLoading && <p role="status">Loading categories and locations…</p>}
                    {storageError && <p className="form-error" role="alert">{storageError}</p>}
                    {(!isSupabaseConfigured || (user && !profile?.is_suspended)) && <form className="seller-listing-form" onSubmit={saveForm}>
                        <label>
                            Seller display name
                            <input name="vendor" value={form.vendor} onChange={updateForm} required maxLength="80" />
                        </label>
                        <label>
                            Listing name
                            <input name="name" value={form.name} onChange={updateForm} required maxLength="100" />
                        </label>
                        <label>
                            Description
                            <textarea name="description" value={form.description} onChange={updateForm} required rows="4" maxLength="600" />
                        </label>
                        <label>
                            Price in naira
                            <input name="price" type="number" min="1" max="50000" step="1" value={form.price} onChange={updateForm} required />
                        </label>
                        <label>
                            Category
                            <select name="categorySlug" value={form.categorySlug} onChange={updateForm} required>
                                <option value="">Choose a category</option>
                                {categories.map((category) => (
                                    <option key={category.slug} value={category.slug}>{category.name}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            KDU location
                            <select name="location" value={form.location} onChange={updateForm} required>
                                <option value="">Choose a location</option>
                                {locations.map((group) => (
                                    <optgroup key={group.name} label={group.name}>
                                        {group.locations.map((location) => (
                                            <option key={location.name} value={location.name}>{location.name}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </label>
                        <label>
                            Image link (optional, HTTPS)
                            <input name="image" type="url" value={form.image} onChange={updateForm} placeholder="https://..." />
                        </label>
                        <label>
                            WhatsApp number (optional, include country code)
                            <input name="whatsappNumber" type="tel" value={form.whatsappNumber} onChange={updateForm} placeholder="+234..." />
                        </label>
                        {editingId && (
                            <label>
                                Listing status
                                <select name="status" value={form.status} onChange={updateForm}>
                                    <option value="available">Available in this browser</option>
                                    <option value="sold">Sold</option>
                                    <option value="unavailable">Unavailable</option>
                                </select>
                            </label>
                        )}
                        {error && <p className="form-error" role="alert">{error}</p>}
                        {success && (
                            <p className="account-status-message" role="status">
                                {success} <Link to="/categories">Browse catalogue</Link>
                            </p>
                        )}
                        <div className="seller-form-actions">
                            <button className="btn-post" type="submit">
                                {editingId
                                    ? 'Save changes'
                                    : isSupabaseConfigured ? 'Publish Listing' : 'Save local listing'}
                            </button>
                            {editingId && (
                                <button className="reset-btn" type="button" onClick={cancelEdit}>Cancel edit</button>
                            )}
                        </div>
                    </form>}
                    {(!isSupabaseConfigured || user) && <section className="seller-listings-management">
                        <h2>Your listings {isSupabaseConfigured ? '' : 'in this browser'} ({listings.length})</h2>
                        {listings.length === 0 ? (
                            <p>You have not saved any local listings yet.</p>
                        ) : listings.map((listing) => (
                            <article className="seller-listing-row" key={listing.id}>
                                <div>
                                    <strong>{listing.name}</strong>
                                    <span>{listing.status} · {listing.location}</span>
                                </div>
                                <div className="seller-form-actions">
                                    <button className="text-button" type="button" onClick={() => editListing(listing)}>Edit</button>
                                    {listing.status !== 'sold' && (
                                        <button className="text-button" type="button" onClick={() => updateStatus(listing, 'sold')}>Mark sold</button>
                                    )}
                                    {listing.status !== 'unavailable' && (
                                        <button className="text-button" type="button" onClick={() => updateStatus(listing, 'unavailable')}>Mark unavailable</button>
                                    )}
                                </div>
                            </article>
                        ))}
                    </section>}
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default VendorHub;
