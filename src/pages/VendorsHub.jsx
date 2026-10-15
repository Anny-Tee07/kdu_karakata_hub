import React from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/NavBar";

function VendorHub() {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />

        </div>
    );
}

export default VendorHub;
