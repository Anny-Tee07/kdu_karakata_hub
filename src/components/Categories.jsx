import React from 'react';

function Categories() {
    return (
        <section id="categories" className="categories-section">
            <div className="categories-header">
                <div>
                    <h2>Campus Categories</h2>
                    <p>Browse items curated specifically for student life</p>
                </div>
                <a href="#all" className="view-all">View All &gt;</a>
            </div>

            <div className="categories-grid">
                <div className="category-card">
                    <div className="category-icon">🍔</div>
                    <h4>Food & Drinks</h4>
                    <p>128 items</p>
                </div>

                <div className="category-card">
                    <div className="category-icon">⚡</div>
                    <h4>Electronics</h4>
                    <p>84 items</p>
                </div>

                <div className="category-card">
                    <div className="category-icon">🧥</div>
                    <h4>Fashion</h4>
                    <p>92 items</p>
                </div>

                <div className="category-card">
                    <div className="category-icon">📚</div>
                    <h4>Books & Notes</h4>
                    <p>64 items</p>
                </div>

                <div className="category-card">
                    <div className="category-icon">💄</div>
                    <h4>Beauty & Hair</h4>
                    <p>45 items</p>
                </div>

                <div className="category-card">
                    <div className="category-icon">🔧</div>
                    <h4>Repairs & Tech</h4>
                    <p>38 items</p>
                </div>

                <div className="category-card">
                    <div className="category-icon">🛏️</div>
                    <h4>Hostel Needs</h4>
                    <p>52 items</p>
                </div>

                <div className="category-card">
                    <div className="category-icon">🖨️</div>
                    <h4>Printing Hub</h4>
                    <p>71 items</p>
                </div>
            </div>
        </section>
    );
}

export default Categories;