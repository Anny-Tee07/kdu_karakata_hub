import { Link } from 'react-router-dom';
import { useMarketplaceOptions } from '../data/useMarketplaceOptions';

function LocationDiscovery() {
    const { locations, error } = useMarketplaceOptions();
    return (
        <section className="location-discovery-section" aria-labelledby="location-discovery-title">
            <div className="location-discovery-heading">
                <div>
                    <span className="section-tag">Explore by campus location</span>
                    <h2 id="location-discovery-title">Find listings near you</h2>
                    <p>Choose a KDU location to see listings tagged there in this demo catalogue.</p>
                </div>
            </div>
            <div className="location-groups">
                {locations.map((group) => (
                    <section className="location-group" key={group.name}>
                        <h3>{group.name}</h3>
                        <div className="location-tiles">
                            {group.locations.map((location) => (
                                <Link
                                    key={location.name}
                                    className="location-tile"
                                    to={`/categories?location=${encodeURIComponent(location.name)}`}
                                >
                                    {location.name}
                                </Link>
                            ))}
                        </div>
                        {error && <p className="form-error" role="alert">{error}</p>}
                    </section>
                ))}
            </div>
            <p className="demo-data-note">
                Location assignments in this catalogue are sample data, not confirmed vendor addresses.
            </p>
            <div className="vendor-callout">
                <div>
                    <h3>Have something to sell or offer?</h3>
                    <p>Create a listing preview saved only in this browser.</p>
                </div>
                <Link className="btn-post vendor-back-button" to="/vendor-hub">Open Vendor Hub</Link>
            </div>
        </section>
    );
}

export default LocationDiscovery;
