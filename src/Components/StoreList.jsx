import { useEffect, useState } from 'react';
import L from 'leaflet';
import storeData from '../data/storeData.json';
import './StoreList.css';
import SadhinIcon from '../assets/sadhin.png';

const StoreList = () => {
    const [map, setMap] = useState(null);
    const [searchData, setSearchData] = useState(null);
    const [searchResult, setSearchResult] = useState(null);

    console.log("Search Data : ", searchData);

    const handleSubmit = (event) => {
        event.preventDefault();

        const form = event.target;
        const division = form.division.value;
        const district = form.district.value;
        const thana = form.thana.value;
        const union = form.union.value;

        const searchData = {
            division, district, thana, union
        }
        setSearchData(searchData);
    };

    useEffect(() => {
        const myMap = L.map('map').setView([23.7984463, 90.4031033], 7);
        const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

        const tileLayer = L.tileLayer(tileUrl, { attribution });
        tileLayer.addTo(myMap);

        setMap(myMap);

        if (searchData) {
            // Perform the search based on the searchData
            const { division, district, thana, union } = searchData;
            const searchLocation = `${division}, ${district}, ${thana}, ${union}`;

            // Initialize the geocoder control
            const geocoder = L.Control.Geocoder.nominatim();

            geocoder.geocode(searchLocation, (results) => {
                if (results && results.length > 0) {
                    const { center, name } = results[0];
                    setSearchResult({ name, latlng: center });
                    myMap.setView(center);
                    L.marker(center).addTo(myMap);
                } else {
                    console.log('No results found for the search location.');
                }
            });
        }


        // Create custom icon
        const myIcon = L.icon({
            iconUrl: SadhinIcon,
            iconSize: [30, 36]
        });

        // Add GeoJSON layer with custom icon and onEachFeature function
        const shopsLayer = L.geoJSON(storeData, {
            onEachFeature: onEachFeature,
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: myIcon });
                // return L.marker(latlng);
            }
        });
        shopsLayer.addTo(myMap);

        return () => {
            myMap.remove();
        };
    }, [searchData]);


    const onEachFeature = (feature, layer) => {
        // Define what happens on click of each feature
        layer.bindPopup(makePopupContent(feature), { closeButton: false, offset: L.point(0, -8) });
    };

    const makePopupContent = (shop) => {
        return (
            <div>
                <h4>{shop.properties.name}</h4>
                <p>{shop.properties.address}</p>
                <div className="phone-number">
                    <a href={`tel:${shop.properties.phone}`}>{shop.properties.phone}</a>
                </div>
            </div>
        );
    };

    const flyToStore = (store) => {
        const lat = store.geometry.coordinates[1];
        const lng = store.geometry.coordinates[0];
        map.flyTo([lat, lng], 14, { duration: 3 });
        setTimeout(() => {
            L.popup({ closeButton: false, offset: L.point(0, -8) })
                .setLatLng([lat, lng])
                .setContent(makePopupContent(store))
                .openOn(map);
        }, 3000);
    };

    // generateExistingLocationList
    const generateList = () => {
        return storeData.map((shop, index) => (
            <li key={index}>
                <div className="shop-item">
                    <a href="#" onClick={() => flyToStore(shop)}>{shop.properties.name}</a>
                    <p>{shop.properties.address}</p>
                </div>
            </li>
        ));
    };

    return (
        <div className='d-md-flex'>
            <div className='formArea col-3'>
                <div className='addreddBG'>
                    <form onSubmit={handleSubmit}>
                        {/* <form> */}
                        <div className='row g-3 mb-3'>
                            <div className='col'>
                                <label htmlFor="division" className="form-label">Division:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="division"
                                    name="division"
                                    aria-describedby="division"
                                    // value={division}
                                    // onChange={(e) => setDivision(e.target.value)}
                                    onChange={(e) => setSearchData({ ...searchData, division: e.target.value })}

                                />
                            </div>
                            <div className='col'>
                                <label htmlFor="district" className="form-label">District:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="district"
                                    name="district"
                                    aria-describedby="district"
                                    // value={district}
                                    // onChange={(e) => setDistrict(e.target.value)}
                                    onChange={(e) => setSearchData({ ...searchData, district: e.target.value })}

                                />
                            </div>
                        </div>
                        <div className='row g-3 mb-3'>
                            <div className='col'>
                                <label htmlFor="thana" className="form-label">SubDistrict/Thana:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="thana"
                                    name="thana"
                                    aria-describedby="thana"
                                    // value={thana}
                                    // onChange={(e) => setThana(e.target.value)}
                                    onChange={(e) => setSearchData({ ...searchData, thana: e.target.value })}


                                />
                            </div>
                            <div className='col'>
                                <label htmlFor="union" className="form-label">City Corporation/Union:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="union"
                                    name="union"
                                    aria-describedby="union"
                                    // value={union}
                                    // onChange={(e) => setUnion(e.target.value)}
                                    onChange={(e) => setSearchData({ ...searchData, union: e.target.value })}

                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Search
                        </button>
                    </form>

                </div>
            </div>
            <main className='col-9'>
                <div className="store-list col-2">
                    <div className="heading">
                        <h3>Connections</h3>
                    </div>
                    <ul className="list">
                        {generateList()}
                    </ul>
                </div>
                <div className='col-12' id="map" />
            </main>
        </div>
    );
};

export default StoreList;
