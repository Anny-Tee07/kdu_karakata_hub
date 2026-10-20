import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/NavBar';
import { products } from '../data/products';
import { getWhatsAppLink, readSellerListings } from '../utils/sellerListings';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { mapSupabaseListing } from '../data/supabaseListings';
import { useAuth } from '../auth/useAuth';

function loadLocalSellerListingData() {
    try {
        return { listings: readSellerListings(), error: '' };
    } catch (error) {
        return { listings: [], error: error.message };
    }
}

function ProductDetailsPage() {
    const { productId } = useParams();
    const { user } = useAuth();
    const [sellerListingData] = useState(
        isSupabaseConfigured ? { listings: [], error: '' } : loadLocalSellerListingData,
    );
    const [backendListing, setBackendListing] = useState(null);
    const [loading, setLoading] = useState(isSupabaseConfigured);
    const [storageError, setStorageError] = useState(sellerListingData.error);
    const [reportOpen, setReportOpen] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportMessage, setReportMessage] = useState('');
    const [reportError, setReportError] = useState('');
    const [reporting, setReporting] = useState(false);

    useEffect(() => {
        if (!supabase) {
            return undefined;
        }
        let active = true;
        supabase.from('listings').select('*, categories(name)')
            .eq('id', productId)
            .maybeSingle()
            .then(({ data, error }) => {
                if (!active) {
                    return;
                }
                if (error) {
                    setStorageError(`Could not load listing: ${error.message}`);
                } else if (data) {
                    setBackendListing(mapSupabaseListing(data));
                }
                setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [productId]);

    const product = isSupabaseConfigured
        ? backendListing
        : [...products, ...sellerListingData.listings].find((listing) => listing.id === productId);
    const contactLink = product ? getWhatsAppLink(product) : '';

    const submitReport = async (event) => {
        event.preventDefault();
        setReportError('');
        setReportMessage('');
        if (!user) {
            setReportError('Sign in to report a listing.');
            return;
        }
        if (!product || reportReason.trim().length < 5) {
            setReportError('Please explain the concern in at least 5 characters.');
            return;
        }
        setReporting(true);
        const { error } = await supabase.from('listing_reports').insert({
            listing_id: product.id,
            reporter_id: user.id,
            reason: reportReason.trim(),
        });
        setReporting(false);
        if (error) {
            setReportError(error.message);
        } else {
            setReportMessage('Report submitted for review.');
            setReportOpen(false);
            setReportReason('');
        }
    };

    return (
        <div>
            <Navbar />
            <main className="category-page-container product-details-page">
                <Link className="category-back-link" to="/categories">← Back to all listings</Link>
                {storageError && (
                    <p className="search-empty-state" role="alert">
                        Browser-local listings could not be loaded: {storageError}
                    </p>
                )}
                {loading ? <p role="status">Loading listing…</p> : !product ? (
                    <section className="product-detail-card">
                        <span className="section-tag">Listing not found</span>
                        <h1 className="category-page-title">This listing is unavailable.</h1>
                        <p>It may have been removed from this browser or the link may be incorrect.</p>
                    </section>
                ) : (
                    <article className="product-detail-card">
                        <div className={`product-detail-image${product.image ? '' : ' image-unavailable'}`}>
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
                        <div className="product-detail-content">
                            <span className="section-tag">
                                {product.isDemo ? 'Demonstration listing' : 'Browser-local listing'}
                            </span>
                            <h1 className="category-page-title">{product.name}</h1>
                            <p className="vendor-row">Seller display name: {product.vendor}</p>
                            <p className="product-detail-description">{product.description}</p>
                            <dl className="product-dialog-facts">
                                <div><dt>Price</dt><dd>{product.price}</dd></div>
                                <div><dt>Category</dt><dd>{product.categoryNames?.[0] || 'Listing'}</dd></div>
                                <div><dt>Campus location</dt><dd>{product.location || 'Not provided'}</dd></div>
                                {product.status && (
                                    <div><dt>Listing status</dt><dd>{product.status}</dd></div>
                                )}
                            </dl>
                            {contactLink ? (
                                <a
                                    className="btn-post product-contact-link"
                                    href={contactLink}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Ask the seller on WhatsApp
                                </a>
                            ) : (
                                <p className="product-dialog-note">
                                    No seller contact number was provided for this listing. Contact
                                    cannot be started from this demo.
                                </p>
                            )}
                            <p className="demo-data-note">
                                This site does not process orders or payments. If you contact a
                                seller, arrange any transaction directly and verify the details first.
                            </p>
                            {isSupabaseConfigured && product.status === 'available' && (
                                <div className="listing-report-control">
                                    {!user ? (
                                        <Link to="/signin">Sign in to report this listing</Link>
                                    ) : (
                                        <button className="text-button" type="button" onClick={() => setReportOpen((open) => !open)}>
                                            Report this listing
                                        </button>
                                    )}
                                    {reportOpen && (
                                        <form onSubmit={submitReport}>
                                            <label htmlFor="listing-report-reason">Tell us why this listing should be reviewed</label>
                                            <textarea
                                                id="listing-report-reason"
                                                value={reportReason}
                                                onChange={(event) => setReportReason(event.target.value)}
                                                minLength="5"
                                                maxLength="1000"
                                                required
                                            />
                                            {reportError && <p className="form-error" role="alert">{reportError}</p>}
                                            <button className="btn-post" type="submit" disabled={reporting}>
                                                {reporting ? 'Sending…' : 'Submit report'}
                                            </button>
                                        </form>
                                    )}
                                    {reportMessage && <p className="account-status-message" role="status">{reportMessage}</p>}
                                </div>
                            )}
                        </div>
                    </article>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default ProductDetailsPage;
