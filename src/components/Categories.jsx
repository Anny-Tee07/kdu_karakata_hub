import React from 'react';
import { Link } from 'react-router-dom';
import { useMarketplaceOptions } from '../data/useMarketplaceOptions';

function Categories() {
    const { categories, error } = useMarketplaceOptions();
    return (
        <section id="categories" className="campus-categories-section" style={{ padding: '30px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>
                        Campus Categories
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
                        Browse items curated specifically for student life
                    </p>
                </div>
                <Link
                    to="/categories"
                    style={{ color: '#16a34a', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}
                >
                    View All &gt;
                </Link>
            </div>

            {error && <p className="form-error" role="alert">{error}</p>}
            <div
                className="categories-grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '16px',
                }}
            >
                {categories.map((cat) => (
                    <Link
                        key={cat.slug}
                        to={`/categories/${cat.categorySlug || cat.slug}`}
                        style={{
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            padding: '20px 12px',
                            textAlign: 'center',
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'all 0.2s ease-in-out',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#16a34a';
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(22, 163, 74, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
                        }}
                    >
                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
                            {cat.icon}
                        </div>
                        <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#0f172a', marginBottom: '4px' }}>
                            {cat.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {cat.listingCount} {cat.listingCount === 1 ? 'listing' : 'listings'}
                        </div>
                    </Link>
                ))}
            </div>

        </section>
    );
}

export default Categories;