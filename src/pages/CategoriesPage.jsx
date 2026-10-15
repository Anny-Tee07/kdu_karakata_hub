import React from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/NavBar";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";

function CategoriesPage() {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />
            <ProductGrid />
            <Footer />

        </div>
    );
}

export default CategoriesPage;

