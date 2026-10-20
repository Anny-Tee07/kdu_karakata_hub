import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/NavBar';
import { mapSupabaseListing } from '../data/supabaseListings';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/useAuth';

const tabs = ['Listings', 'Categories', 'Locations', 'Users', 'Reports'];
const emptyListing = {
    name: '',
    description: '',
    category_slug: '',
    location_name: '',
    price: '',
    image_url: '',
    seller_name: '',
    whatsapp_number: '',
    status: 'available',
};

function AdminDashboard() {
    const { user: currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('Listings');
    const [records, setRecords] = useState([]);
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [search, setSearch] = useState('');
    const [listingForm, setListingForm] = useState(emptyListing);
    const [editingListingId, setEditingListingId] = useState('');
    const [categoryForm, setCategoryForm] = useState({ slug: '', name: '', icon: '🛍️', description: '' });
    const [locationForm, setLocationForm] = useState({ name: '', group_name: 'Hostels' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const loadDashboard = useCallback(async () => {
        try {
            const [listingResult, categoryResult, locationResult, profileResult, reportResult] = await Promise.all([
                supabase.from('listings').select('*').order('created_at', { ascending: false }).limit(1000),
                supabase.from('categories').select('*').order('name'),
                supabase.from('campus_locations').select('*').order('group_name').order('name'),
                supabase.from('profiles').select('id, username, display_name, role, is_suspended, created_at').order('created_at', { ascending: false }),
                supabase.from('listing_reports').select('*').order('created_at', { ascending: false }),
            ]);
            const firstError = [listingResult, categoryResult, locationResult, profileResult, reportResult]
                .find((result) => result.error)?.error;
            if (firstError) {
                setError(`Could not load admin data: ${firstError.message}`);
                setLoading(false);
                return;
            }
            setRecords({
                Listings: listingResult.data.map(mapSupabaseListing),
                Categories: categoryResult.data,
                Locations: locationResult.data,
                Users: profileResult.data,
                Reports: reportResult.data,
            });
            setCategories(categoryResult.data);
            setLocations(locationResult.data);
            setLoading(false);
        } catch (loadError) {
            setError(`Could not load admin data: ${loadError.message}`);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const runMutation = async (operation, successText) => {
        setError('');
        setMessage('');
        try {
            const { error: operationError } = await operation;
            if (operationError) {
                setError(operationError.message);
                return false;
            }
            setMessage(successText);
            await loadDashboard();
            return true;
        } catch (operationError) {
            setError(`Could not save changes: ${operationError.message}`);
            return false;
        }
    };

    const saveListing = async (event) => {
        event.preventDefault();
        const price = Number(listingForm.price);
        if (!Number.isFinite(price) || price <= 0) {
            setError('Enter a price greater than zero.');
            return;
        }
        const payload = {
            ...listingForm,
            price,
            owner_id: null,
            is_demo: false,
            image_url: listingForm.image_url.trim(),
            whatsapp_number: listingForm.whatsapp_number.trim(),
        };
        const query = editingListingId
            ? supabase.from('listings').update(payload).eq('id', editingListingId)
            : supabase.from('listings').insert(payload);
        const succeeded = await runMutation(query, editingListingId ? 'Listing updated.' : 'Listing created.');
        if (succeeded) {
            setListingForm(emptyListing);
            setEditingListingId('');
        }
    };

    const editListing = (listing) => {
        setListingForm({
            name: listing.name,
            description: listing.description,
            category_slug: listing.categorySlug,
            location_name: listing.location,
            price: String(listing.priceValue),
            image_url: listing.image || '',
            seller_name: listing.vendor,
            whatsapp_number: listing.whatsappNumber || '',
            status: listing.status,
        });
        setEditingListingId(listing.id);
        setActiveTab('Listings');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteListing = async (id) => {
        if (window.confirm('Permanently delete this listing?')) {
            await runMutation(supabase.from('listings').delete().eq('id', id), 'Listing deleted.');
        }
    };

    const saveCategory = async (event) => {
        event.preventDefault();
        const saved = await runMutation(
            supabase.from('categories').upsert(categoryForm),
            'Category saved.',
        );
        if (saved) {
            setCategoryForm({ slug: '', name: '', icon: '🛍️', description: '' });
        }
    };

    const deleteCategory = async (slug) => {
        if (window.confirm('Delete this category? Listings that still use it will prevent deletion.')) {
            await runMutation(supabase.from('categories').delete().eq('slug', slug), 'Category deleted.');
        }
    };

    const saveLocation = async (event) => {
        event.preventDefault();
        const saved = await runMutation(supabase.from('campus_locations').upsert(locationForm), 'Location saved.');
        if (saved) {
            setLocationForm({ name: '', group_name: 'Hostels' });
        }
    };

    const deleteLocation = async (name) => {
        if (window.confirm('Delete this location? Listings that still use it will prevent deletion.')) {
            await runMutation(supabase.from('campus_locations').delete().eq('name', name), 'Location deleted.');
        }
    };

    const updateUser = async (profile, changes) => {
        await runMutation(
            supabase.from('profiles').update(changes).eq('id', profile.id),
            `Updated ${profile.username}.`,
        );
    };

    const moderateReport = async (report, status) => {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            setError(userError?.message || 'Your session has expired. Sign in again.');
            return;
        }
        await runMutation(
            supabase.from('listing_reports')
                .update({ status, moderator_id: user.id })
                .eq('id', report.id),
            `Report marked ${status}.`,
        );
    };

    const visibleRecords = (records[activeTab] || []).filter((record) => (
        JSON.stringify(record).toLocaleLowerCase().includes(search.toLocaleLowerCase().trim())
    ));

    return (
        <div>
            <Navbar />
            <main className="category-page-container admin-dashboard">
                <Link className="category-back-link" to="/">← Back to marketplace</Link>
                <header className="category-page-header">
                    <span className="section-tag">Authorized administration</span>
                    <h1 className="category-page-title">Admin Dashboard</h1>
                    <p>Changes here are checked again by Supabase row-level security policies.</p>
                </header>
                <nav className="admin-tabs" aria-label="Admin sections">
                    {tabs.map((tab) => (
                        <button
                            className={activeTab === tab ? 'admin-tab active' : 'admin-tab'}
                            type="button"
                            key={tab}
                            onClick={() => { setActiveTab(tab); setSearch(''); setError(''); }}
                        >
                            {tab} <span>{records[tab]?.length ?? '…'}</span>
                        </button>
                    ))}
                </nav>
                {error && <p className="form-error" role="alert">{error}</p>}
                {message && <p className="account-status-message" role="status">{message}</p>}
                <div className="admin-toolbar">
                    <label>
                        Search {activeTab.toLocaleLowerCase()}
                        <input value={search} onChange={(event) => setSearch(event.target.value)} />
                    </label>
                    <button className="reset-btn" type="button" onClick={loadDashboard}>Refresh</button>
                </div>
                {loading ? <p role="status">Loading marketplace administration data…</p> : (
                    <>
                        {activeTab === 'Listings' && (
                            <>
                                <form className="seller-listing-form admin-form" onSubmit={saveListing}>
                                    <label>Listing name<input required maxLength="120" value={listingForm.name} onChange={(event) => setListingForm({ ...listingForm, name: event.target.value })} /></label>
                                    <label>Description<textarea required maxLength="2000" value={listingForm.description} onChange={(event) => setListingForm({ ...listingForm, description: event.target.value })} /></label>
                                    <label>Category<select required value={listingForm.category_slug} onChange={(event) => setListingForm({ ...listingForm, category_slug: event.target.value })}><option value="">Choose</option>{categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></label>
                                    <label>Location<select required value={listingForm.location_name} onChange={(event) => setListingForm({ ...listingForm, location_name: event.target.value })}><option value="">Choose</option>{locations.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</select></label>
                                    <label>Price (₦)<input required type="number" min="1" step="1" value={listingForm.price} onChange={(event) => setListingForm({ ...listingForm, price: event.target.value })} /></label>
                                    <label>Seller display name<input required value={listingForm.seller_name} onChange={(event) => setListingForm({ ...listingForm, seller_name: event.target.value })} /></label>
                                    <label>Image URL (HTTPS)<input type="url" value={listingForm.image_url} onChange={(event) => setListingForm({ ...listingForm, image_url: event.target.value })} /></label>
                                    <label>WhatsApp number (optional)<input type="tel" value={listingForm.whatsapp_number} onChange={(event) => setListingForm({ ...listingForm, whatsapp_number: event.target.value })} /></label>
                                    {editingListingId && <label>Status<select value={listingForm.status} onChange={(event) => setListingForm({ ...listingForm, status: event.target.value })}><option value="available">Available</option><option value="sold">Sold</option><option value="unavailable">Unavailable</option></select></label>}
                                    <div className="seller-form-actions">
                                        <button className="btn-post" type="submit">{editingListingId ? 'Save Listing' : 'Create Listing'}</button>
                                        {editingListingId && <button className="reset-btn" type="button" onClick={() => { setEditingListingId(''); setListingForm(emptyListing); }}>Cancel</button>}
                                    </div>
                                </form>
                                <div className="admin-record-list">
                                    {visibleRecords.map((listing) => (
                                        <article className="admin-record" key={listing.id}>
                                            <div><strong>{listing.name}</strong><span>{listing.vendor} · {listing.price} · {listing.location} · {listing.isDemo ? 'Demo' : listing.status}</span></div>
                                            <div className="seller-form-actions"><button className="text-button" type="button" onClick={() => editListing(listing)}>Edit</button><button className="text-button danger-text" type="button" onClick={() => deleteListing(listing.id)}>Delete</button></div>
                                        </article>
                                    ))}
                                </div>
                            </>
                        )}
                        {activeTab === 'Categories' && (
                            <>
                                <form className="seller-listing-form admin-form" onSubmit={saveCategory}>
                                    <label>Category slug<input required pattern="[a-z0-9-]+" value={categoryForm.slug} onChange={(event) => setCategoryForm({ ...categoryForm, slug: event.target.value })} /></label>
                                    <label>Name<input required value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} /></label>
                                    <label>Icon<input value={categoryForm.icon} onChange={(event) => setCategoryForm({ ...categoryForm, icon: event.target.value })} /></label>
                                    <label>Description<input value={categoryForm.description} onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })} /></label>
                                    <div className="seller-form-actions"><button className="btn-post" type="submit">Save Category</button></div>
                                </form>
                                <div className="admin-record-list">{visibleRecords.map((item) => <article className="admin-record" key={item.slug}><div><strong>{item.icon} {item.name}</strong><span>{item.slug} · {item.description}</span></div><button className="text-button danger-text" type="button" onClick={() => deleteCategory(item.slug)}>Delete</button></article>)}</div>
                            </>
                        )}
                        {activeTab === 'Locations' && (
                            <>
                                <form className="seller-listing-form admin-form" onSubmit={saveLocation}>
                                    <label>Location name<input required value={locationForm.name} onChange={(event) => setLocationForm({ ...locationForm, name: event.target.value })} /></label>
                                    <label>Group<select value={locationForm.group_name} onChange={(event) => setLocationForm({ ...locationForm, group_name: event.target.value })}><option>Hostels</option><option>Shops & Food Locations</option></select></label>
                                    <div className="seller-form-actions"><button className="btn-post" type="submit">Save Location</button></div>
                                </form>
                                <div className="admin-record-list">{visibleRecords.map((item) => <article className="admin-record" key={item.name}><div><strong>{item.name}</strong><span>{item.group_name}</span></div><button className="text-button danger-text" type="button" onClick={() => deleteLocation(item.name)}>Delete</button></article>)}</div>
                            </>
                        )}
                        {activeTab === 'Users' && (
                            <div className="admin-record-list">{visibleRecords.map((item) => <article className="admin-record" key={item.id}><div><strong>{item.display_name} (@{item.username})</strong><span>{item.role} · {item.is_suspended ? 'Suspended' : 'Active'} · {new Date(item.created_at).toLocaleDateString()}</span></div><div className="seller-form-actions"><button className="text-button" type="button" disabled={item.role === 'admin'} onClick={() => updateUser(item, { role: 'admin' })}>Make Admin</button><button className="text-button" type="button" disabled={item.role === 'buyer' || item.id === currentUser?.id} onClick={() => updateUser(item, { role: 'buyer' })}>Set Buyer</button><button className="text-button danger-text" type="button" disabled={item.id === currentUser?.id} onClick={() => updateUser(item, { is_suspended: !item.is_suspended })}>{item.is_suspended ? 'Reactivate' : 'Suspend'}</button></div></article>)}</div>
                        )}
                        {activeTab === 'Reports' && (
                            <div className="admin-record-list">{visibleRecords.map((item) => <article className="admin-record" key={item.id}><div><strong>Report: {item.status}</strong><span>Listing {item.listing_id} · {item.reason}</span><small>Submitted {new Date(item.created_at).toLocaleString()}</small></div><div className="seller-form-actions"><button className="text-button" type="button" onClick={() => moderateReport(item, 'reviewed')}>Mark reviewed</button><button className="text-button" type="button" onClick={() => moderateReport(item, 'dismissed')}>Dismiss</button></div></article>)}</div>
                        )}
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default AdminDashboard;
