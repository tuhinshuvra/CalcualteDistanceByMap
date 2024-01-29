import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import L from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.js';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import './Address/Address.css';

const UserGEOLocationSetForm = () => {
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
        const map = L.map('map').setView([23.7984463, 90.4031033], 13);
        const mapLink = "<a href='http://openstreetmap.org'>OpenStreetMap</a>";

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: 'Leaflet &copy; ' + mapLink + ', contribution',
            maxZoom: 18
        }).addTo(map);

        if (searchData) {
            // Perform the search based on the searchData
            const { division, district, thana, union } = searchData;

            // Example: Center the map on the location specified in searchData
            const searchLocation = `${division}, ${district}, ${thana}, ${union}`;

            console.log("Search Location Data : ", searchLocation)

            const geocoder = L.Control.Geocoder.nominatim();

            geocoder.geocode(searchLocation, (results) => {
                if (results && results.length > 0) {
                    const { center, name } = results[0];
                    setSearchResult({ name, latlng: center });
                    map.setView(center);
                    L.marker(center).addTo(map);
                } else {
                    console.log('No results found for the search location.');
                }
            });
        }

        return () => {
            map.remove();
        };
    }, [searchData]);


    return (
        <div>
            <h2 className=' text-center text-primary my-4'>Location Search</h2>
            <div className=' col-md-12 d-md-flex justify-content-between '>
                <div className=' col-md-6'>
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
                                    <label htmlFor="union" className="form-label">City Corporation / Union / Municipality:</label>
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
                <div className=' col-md-6' id="map" />
            </div>

            {searchResult && (
                <div className=' text-center'>
                    <h3 className='text-success fw-bold my-3'>Search Result</h3>
                    <p>
                        <b> Location Name: </b> {searchResult.name}</p>
                    <p> <b>Latitude:</b> {searchResult.latlng.lat}, <b>Longitude: </b>  {searchResult.latlng.lng}</p>
                </div>
            )}

        </div>

    );
};

export default UserGEOLocationSetForm;