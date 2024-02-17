import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import SadhinIcon from '../../assets/sadhin.png';
import './ExistingConnectionStatus.css';
import configUrl from '../../api/config';

const ExistingConnectionStatus = () => {
    const [storeData, setStoredData] = useState(null);
    const [map, setMap] = useState(null);
    const [searchData, setSearchData] = useState(null);
    const [searchLocationLatLng, setSearchLocationLatLng] = useState(null);
    const [newPos, setNewtPos] = useState(null);
    const [estimatedDistance, setEstimatedDistance] = useState(null);
    const [estimatedCost, setEstimatedCost] = useState(null);
    // const [searchResult, setSearchResult] = useState(null);

    console.log("new Dragged Position : ", newPos);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${configUrl.BASEURL}/api/v1/wificonnection`);
                const data = await response.json();
                // console.log("All Saved Connections: ", data.status);

                if (data.status === 'success') {
                    setStoredData(data.data);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);


    const handleSubmit = (event) => {
        event.preventDefault();

        const form = event.target;
        const division = form.division.value;
        const district = form.district.value;
        const thana = form.thana.value;
        const union = form.union.value;
        const village = form.village.value;
        const holding = form.holding.value;
        const direction = form.direction.value;
        const address = form.address.value;

        const searchData = {
            division, district, thana, union, village, holding, direction, address
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
            const { division, district, thana, union, village, holding, direction, address } = searchData;
            const searchLocation = `${division}, ${district}, ${thana}, ${union}, ${village} , ${holding}, ${direction}, ${address}`;

            // Initialize the geocoder control
            const geocoder = L.Control.Geocoder.nominatim();

            geocoder.geocode(searchLocation, (results) => {
                if (results && results.length > 0) {
                    const { center } = results[0];
                    setSearchLocationLatLng(center);
                    myMap.setView(center);

                    // Calculate the route to the nearest store
                    const nearestStore = findNearestStore(center);
                    if (nearestStore) {
                        const storeLocation = L.latLng(nearestStore.coordinates[1], nearestStore.coordinates[0]);

                        const routingControl = L.Routing.control({
                            waypoints: [
                                L.latLng(center),
                                storeLocation
                            ],
                            routeWhileDragging: true
                        }).addTo(myMap);

                        routingControl.on('routingstart', (event) => {
                            const newDraggedPos = event.waypoints[0].latLng;
                            setNewtPos(newDraggedPos)
                        });

                        routingControl.on('routesfound', function (event) {
                            const routes = event.routes;
                            routes.forEach(function (route, index) {
                                // console.log(`Route ${index + 1}:`);
                                const distance = route.summary.totalDistance;
                                setEstimatedDistance(distance);
                                // console.log(` Routing Step Distance to nearest store: ${distance} meters`);
                                // route.instructions.forEach(function (instruction, i) {
                                //     console.log(`Routing Step ${i + 1}: ${instruction.text}`);
                                // });
                            });
                        });
                    }
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
            }
        });

        shopsLayer.addTo(myMap);

        return () => {
            myMap.remove();
        };
    }, [searchData, storeData]);

    console.log("searchLocationLatLng ===> ", searchLocationLatLng);


    useEffect(() => {
        let totalCost = 0;
        const setupCost = 1000;

        totalCost = setupCost + estimatedDistance * 15;
        setEstimatedCost(totalCost.toFixed(2));
    }, [estimatedDistance]);

    const onEachFeature = (feature, layer) => {
        // Define what happens on click of each feature
        layer.bindPopup(makePopupContent(feature), { closeButton: false, offset: L.point(0, -8) });
    };

    const makePopupContent = (shop) => {
        return (
            <div>
                <h4>{shop.name}</h4>
                <p>{shop.locationName}</p>
                <div className="phone-number">
                    <a href={`tel:${shop.phone}`}>{shop.phone}</a>
                </div>
            </div>
        );
    };

    const flyToStore = (store) => {
        const lat = store.coordinates[1];
        const lng = store.coordinates[0];
        map.flyTo([lat, lng], 15, { duration: 3 });
        setTimeout(() => {
            L.popup({ closeButton: false, offset: L.point(0, -8) })
                .setLatLng([lat, lng])
                .setContent(makePopupContent(store))
                .openOn(map);
        }, 3000);

    };

    // generateExistingLocationList
    const generateList = () => {
        if (!storeData || storeData.length === 0) {
            return <li>No store data available.</li>;
        }

        return storeData.map((shop, index) => (
            <li key={index}>
                <div className="shop-item">
                    <a href="#" onClick={() => flyToStore(shop)}>{shop.name}</a>
                    <p>{shop.locationName}</p>
                </div>
            </li>
        ));
    };



    // Function to find the nearest store

    const findNearestStore = (searchLocation) => {
        if (!storeData || storeData.length === 0) {
            return <li>No store data available.</li>;
        }

        console.log("Store data is available");

        let nearestStore = null;
        let shortestDistance = Infinity;


        if (storeData) {
            for (let i = 0; i < storeData.length; i++) {
                const store = storeData[i];

                // console.log("storeLocation ==>", store);
                const storeLocation = L.latLng(store.coordinates[1], store.coordinates[0]);

                const distance = searchLocation.distanceTo(storeLocation);
                if (distance < shortestDistance) {
                    shortestDistance = distance;
                    nearestStore = store;
                }
            }
        }

        return nearestStore;
    };


    return (
        <div className='d-md-flex'>
            <div className='formArea col-3'>

                <div className='addreddBG p-3'>
                    <h3 className=' fw-bold text-primary'>Address</h3>
                    <form onSubmit={handleSubmit}>
                        {/* <form> */}
                        <div className='row g-3 mb-2'>
                            <div className='col'>
                                <label htmlFor="division" className="form-label mb-0">Division:</label>
                                <input
                                    type="text"
                                    className="form-control mt-0"
                                    id="division"
                                    name="division"
                                    aria-describedby="division"
                                    // value={division}
                                    // onChange={(e) => setDivision(e.target.value)}
                                    onChange={(e) => setSearchData({ ...searchData, division: e.target.value })}

                                />
                            </div>
                            <div className='col'>
                                <label htmlFor="district" className="form-label mb-0">District:</label>
                                <input
                                    type="text"
                                    className="form-control mt-0"
                                    id="district"
                                    name="district"
                                    aria-describedby="district"
                                    // value={district}
                                    // onChange={(e) => setDistrict(e.target.value)}
                                    onChange={(e) => setSearchData({ ...searchData, district: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className='row g-3 mb-2'>
                            <div className='col'>
                                <label htmlFor="thana" className="form-label mb-0">SubDistrict/Thana:</label>
                                <input
                                    type="text"
                                    className="form-control mt-0"
                                    id="thana"
                                    name="thana"
                                    aria-describedby="thana"
                                    // value={thana}
                                    // onChange={(e) => setThana(e.target.value)}
                                    onChange={(e) => setSearchData({ ...searchData, thana: e.target.value })}
                                />
                            </div>
                            <div className='col'>
                                <label htmlFor="union" className="form-label mb-0">CityCorporation/Union:</label>
                                <input
                                    type="text"
                                    className="form-control mt-0"
                                    id="union"
                                    name="union"
                                    aria-describedby="union"
                                    // value={union}
                                    // onChange={(e) => setUnion(e.target.value)}
                                    onChange={(e) => setSearchData({ ...searchData, union: e.target.value })}
                                />
                            </div>


                        </div>

                        <div className='row g-3 mb-2'>
                            <div className='col'>
                                <label htmlFor="village" className="form-label mb-0">Village/WordNo:</label>
                                <input
                                    type="text"
                                    className="form-control mt-0"
                                    id="village"
                                    name="village"
                                    aria-describedby="village"
                                    // value={village}
                                    // onChange={(e) => setVillage(e.target.value)}
                                    onChange={(e) => setSearchData({ ...searchData, village: e.target.value })}
                                />
                            </div>
                            <div className='col'>
                                <label htmlFor="holding" className="form-label mb-0">HoldingNo:</label>
                                <input
                                    type="text"
                                    className="form-control mt-0"
                                    id="holding"
                                    name="holding"
                                    aria-describedby="holding"
                                    // value={holding}
                                    // onChange={(e) => setHolding(e.target.value)}
                                    onChange={(e) => setSearchData({ ...searchData, holding: e.target.value })}
                                />
                            </div>
                        </div>


                        <div className='col mb-2'>
                            <label htmlFor="direction" className="form-label mb-0">Direction:</label>
                            <input
                                type="text"
                                className="form-control mt-0"
                                id="direction"
                                name="direction"
                                aria-describedby="direction"
                                // value={direction}
                                // onChange={(e) => setDirection(e.target.value)}
                                onChange={(e) => setSearchData({ ...searchData, direction: e.target.value })}
                            />
                        </div>

                        <div className='col mb-2'>
                            <label htmlFor="address" className="form-label mb-0">Address:</label>
                            <input
                                type="text"
                                className="form-control mt-0"
                                id="address"
                                name="address"
                                aria-describedby="address"
                                // value={address}
                                // onChange={(e) => setAddress(e.target.value)}
                                onChange={(e) => setSearchData({ ...searchData, address: e.target.value })}
                            />
                        </div>


                        <button type="submit" className="btn btn-primary">
                            Search
                        </button>
                    </form>

                    {
                        estimatedDistance &&
                        <div className=' my-4 fw-bold'>
                            <p> <b>Selected Position :</b> {newPos?.lat.toFixed(6)},{newPos?.lng.toFixed(6)} </p>

                            <p className=' fw-bold text-primary mb-0'> <b>Estimated Cost</b></p>
                            <p className=' mb-0'>Distance from nearest point = {estimatedDistance} Meter </p>
                            <p className=' mt-0'>Total Cost(SetupCost + Cable ) = {estimatedCost} TK</p>
                        </div>
                    }

                </div>
            </div>
            <main className='col-9'>
                {/* <div className="store-list col-2"> */}
                <div className="store-list">
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

export default ExistingConnectionStatus;