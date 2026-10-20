import React from 'react'
import { useLocation } from 'react-router-dom';
import Navbar from "../components/NavBar";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";

function CategoriesPage() {
    const location = useLocation();

    return (
        <div>
            <Navbar key={location.search} />
            <ProductGrid key={location.pathname} />
            <Footer />

        </div>
    );
}

export default CategoriesPage;
