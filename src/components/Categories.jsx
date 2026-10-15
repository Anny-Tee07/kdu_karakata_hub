import React from 'react';
import { Link } from 'react-router-dom';


function Categories() {
    return (
        <section id="categories" className="categories-section">
            <div className="categories-header">
                <div>
                    <h2>Campus Categories</h2>
                    <p>Browse items curated specifically for student life</p>
                </div>
                <Link to="/categories" className="view-all">View All &gt;</Link>
            </div>

       
        </section>
    );
}

export default Categories;