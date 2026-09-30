import React from 'react'

function Listings() {
    return (
        <div>
            <div class="marketplace-layout">

                <aside class="filters-sidebar">
                    <div class="filters-header">
                        <h3>Filters</h3>
                        <button class="reset-btn">Reset</button>
                    </div>


                    <div class="filter-group">
                        <label>Max Price: ₦25,000</label>
                        <input type="range" min="500" max="50000" value="25000" class="price-slider" />
                        <div class="price-range-labels">
                            <span>₦500</span>
                            <span>₦50,000+</span>
                        </div>
                    </div>


                    <div class="filter-group">
                        <label class="filter-group-title">Availability</label>
                        <label class="checkbox-label">
                            <input type="checkbox" checked /> In Stock / Immediate Handover
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" /> Pre-order & Cooked on Demand
                        </label>
                    </div>


                    <div class="filter-group">
                        <label class="filter-group-title">Hostel / Campus Zone</label>
                        <label class="checkbox-label">
                            <input type="checkbox" checked /> Male Hostels (Hall 1 & 2)
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" checked /> Female Hostels (Queen Amina)
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" checked /> Cafeteria & Student Center
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" /> Faculty Blocks & Labs
                        </label>
                    </div>

                    <div class="filter-group toggle-group">
                        <span class="toggle-label">Verified Vendors Only</span>
                        <label class="switch">
                            <input type="checkbox" checked />
                            <span class="slider round"></span>
                        </label>
                    </div>
                </aside>


                <main class="marketplace-main">
                    <div class="listings-header-bar">
                        <span class="listings-count">Showing 8 of 480+ campus listings</span>
                        <div class="sort-container">
                            <span>Sort by:</span>
                            <div class="custom-select-wrapper">
                                <select class="sort-select">
                                    <option>Most Recent First</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Top Rated Campus Vendors</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="products-grid">

                        <div class="product-card">
                            <div class="product-image-container">
                                <span class="product-location-badge">Male Hostel B</span>
                                <button class="favorite-btn">🤍</button>
                                <img src="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400" alt="Charger" />
                            </div>
                            <div class="product-info">
                                <div class="vendor-row">TechPlug (4.9★)</div>
                                <h4 class="product-title">Type-C Fast Charging Head & Cable</h4>
                                <p class="product-desc">Brand new GaN dual fast charging head. Charges...</p>
                                <div class="product-footer">
                                    <span class="product-price">₦8,000</span>
                                    <button class="card-action-btn">Details</button>
                                </div>
                            </div>
                        </div>

                        <div class="product-card">
                            <div class="product-image-container">
                                <span class="product-location-badge">Main Cafeteria</span>
                                <button class="favorite-btn">🤍</button>
                                <img src="https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400" alt="Jollof" />
                            </div>
                            <div class="product-info">
                                <div class="vendor-row">Buddy's Kitchen (4.8★)</div>
                                <h4 class="product-title">Jollof Rice & Chicken Combo</h4>
                                <p class="product-desc">Smoky party jollof served hot with dodo and tender...</p>
                                <div class="product-footer">
                                    <span class="product-price">₦2,500</span>
                                    <button class="card-action-btn accent">Order</button>
                                </div>
                            </div>
                        </div>

                        <div class="product-card">
                            <div class="product-image-container">
                                <span class="product-location-badge">Hall 1 Delivery</span>
                                <button class="favorite-btn">🤍</button>
                                <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400" alt="Hoodie" />
                            </div>
                            <div class="product-info">
                                <div class="vendor-row">KDU Swag Co. (4.7★)</div>
                                <h4 class="product-title">Campus Heavyweight Hoodie</h4>
                                <p class="product-desc">Heavy 400GSM fleece fabric. Available in Forest...</p>
                                <div class="product-footer">
                                    <span class="product-price">₦15,000</span>
                                    <button class="card-action-btn">Details</button>
                                </div>
                            </div>
                        </div>


                        <div class="product-card">
                            <div class="product-image-container">
                                <span class="product-location-badge">Amina Hostel</span>
                                <button class="favorite-btn">🤍</button>
                                <img src="https://images.unsplash.com/photo-1560869713-7d0a29430803?w=400" alt="Braids" />
                            </div>
                            <div class="product-info">
                                <div class="vendor-row">Amina Braids (4.9★)</div>
                                <h4 class="product-title">Knotless Braids - Student Special</h4>
                                <p class="product-desc">Painless student braiding session in hostel or home...</p>
                                <div class="product-footer">
                                    <span class="product-price">₦8,000+</span>
                                    <button class="card-action-btn accent-book">Book</button>
                                </div>
                            </div>
                        </div>

                        <div class="product-card">
                            <div class="product-image-container">
                                <span class="product-location-badge">Hostel Hall 2</span>
                                <button class="favorite-btn">🤍</button>
                                <img src="https://images.unsplash.com/photo-1563770660941-20978e870e26?w=400" alt="Extension Box" />
                            </div>
                            <div class="product-info">
                                <div class="vendor-row">Room 4 Gadgets (4.6★)</div>
                                <h4 class="product-title">Heavy-Duty 3-Way Extension Box</h4>
                                <p class="product-desc">Trusted surge-protected extension socket for hostel use...</p>
                                <div class="product-footer">
                                    <span class="product-price">₦4,500</span>
                                    <button class="card-action-btn">Details</button>
                                </div>
                            </div>
                        </div>

                        <div class="product-card">
                            <div class="product-image-container">
                                <span class="product-location-badge">Student Center</span>
                                <button class="favorite-btn">🤍</button>
                                <img src="https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400" alt="Efo Riro" />
                            </div>
                            <div class="product-info">
                                <div class="vendor-row">Mama G Bukka (4.9★)</div>
                                <h4 class="product-title">Efo Riro & Semo Pack with Titus Fish</h4>
                                <p class="product-desc">Freshly made hot local swallow packed securely for delivery...</p>
                                <div class="product-footer">
                                    <span class="product-price">₦2,800</span>
                                    <button class="card-action-btn accent">Order</button>
                                </div>
                            </div>
                        </div>


                        <div class="product-card">
                            <div class="product-image-container">
                                <span class="product-location-badge">Faculty of Science</span>
                                <button class="favorite-btn">🤍</button>
                                <img src="https://images.unsplash.com/photo-1594980598770-a773d2a1334c?w=400" alt="Calculator" />
                            </div>
                            <div class="product-info">
                                <div class="vendor-row">Campus Bookstore (5.0★)</div>
                                <h4 class="product-title">Casio fx-991ES Plus Calculator</h4>
                                <p class="product-desc">Original scientific calculator required for engineering exams...</p>
                                <div class="product-footer">
                                    <span class="product-price">₦6,500</span>
                                    <button class="card-action-btn">Details</button>
                                </div>
                            </div>
                        </div>


                        <div class="product-card">
                            <div class="product-image-container">
                                <span class="product-location-badge">Queen Amina</span>
                                <button class="favorite-btn">🤍</button>
                                <img src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400" alt="Ring Light" />
                            </div>
                            <div class="product-info">
                                <div class="vendor-row">Glow & Tech (4.7★)</div>
                                <h4 class="product-title">LED Desk Ring Light with Phone Holder</h4>
                                <p class="product-desc">Perfect for reading at night or shooting TikTok video content...</p>
                                <div class="product-footer">
                                    <span class="product-price">₦7,500</span>
                                    <button class="card-action-btn">Details</button>
                                </div>
                            </div>
                        </div>


                        <div class="product-card">
                            <div class="product-image-container">
                                <span class="product-location-badge">Hall 3 Gate</span>
                                <button class="favorite-btn">🤍</button>
                                <img src="https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400" alt="Custom Hoodie" />
                            </div>
                            <div class="product-info">
                                <div class="vendor-row">Stitches by Bee (4.8★)</div>
                                <h4 class="product-title">Custom KDU Departmental Hoodie</h4>
                                <p class="product-desc">High quality embroidered department hoodies on pre-order...</p>
                                <div class="product-footer">
                                    <span class="product-price">₦12,000</span>
                                    <button class="card-action-btn">Details</button>
                                </div>
                            </div>
                        </div>


                        <div class="product-card">
                            <div class="product-image-container">
                                <span class="product-location-badge">Room 214 Block B</span>
                                <button class="favorite-btn">🤍</button>
                                <img src="https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400" alt="Desk Fan" />
                            </div>
                            <div class="product-info">
                                <div class="vendor-row">Hostel Mart (4.5★)</div>
                                <h4 class="product-title">Portable USB Rechargeable Desk Fan</h4>
                                <p class="product-desc">Essential mini fan for surviving power outages during reading...</p>
                                <div class="product-footer">
                                    <span class="product-price">₦9,500</span>
                                    <button class="card-action-btn">Details</button>
                                </div>
                            </div>
                        </div>


                        <div class="product-card">
                            <div class="product-image-container">
                                <span class="product-location-badge">Off-Campus Lodge</span>
                                <button class="favorite-btn">🤍</button>
                                <img src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400" alt="Makeup" />
                            </div>
                            <div class="product-info">
                                <div class="vendor-row">Faces by Temi (4.9★)</div>
                                <h4 class="product-title">Professional Makeup & Gele Styling</h4>
                                <p class="product-desc">Get glammed up right in your hostel for dinners and parties...</p>
                                <div class="product-footer">
                                    <span class="product-price">₦5,500</span>
                                    <button class="card-action-btn accent-book">Book</button>
                                </div>
                            </div>
                        </div>


                        <div class="product-card">
                            <div class="product-image-container">
                                <span class="product-location-badge">ICT Center</span>
                                <button class="favorite-btn">🤍</button>
                                <img src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400" alt="LAN Cable" />
                            </div>
                            <div class="product-info">
                                <div class="vendor-row">NetConnect KDU (4.7★)</div>
                                <h4 class="product-title">10-Meter Ethernet LAN Internet Cable</h4>
                                <p class="product-desc">High-speed structured networking cable for stable hostel wifi...</p>
                                <div class="product-footer">
                                    <span class="product-price">₦3,000</span>
                                    <button class="card-action-btn">Details</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    )
}

export default Listings