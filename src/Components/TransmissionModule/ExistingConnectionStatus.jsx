import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import WifiPointIcon from '../../assets/sadhin.png';
import SPIcon from '../../assets/selectedLocation.png';
import NPIconOne from '../../assets/locaionOne.png';
import NPIconTwo from '../../assets/locationTwo.png';
import configUrl from '../../api/config';
import './ExistingConnectionStatus.css';

const ExistingConnectionStatus = () => {
    const [storeData, setStoredData] = useState(null);
    const [myMap, setMyMap] = useState(null);
    const [searchData, setSearchData] = useState({
        division: '',
        district: '',
        thana: '',
        union: '',
        village: '',
        holding: '',
        direction: '',
        address: ''
    });
    const [searchLatLng, setSearchLatLng] = useState(null);
    const [searchMarker, setSearchMarker] = useState(null);
    const [newPos, setNewPos] = useState(null);

    const [routingControlOne, setRoutingControlOne] = useState(null);
    const [routingControlTwo, setRoutingControlTwo] = useState(null);

    const [nearestLocationNameOne, setNearestLocationNameOne] = useState(null);
    const [nearestLocationNameTwo, setNearestLocationNameTwo] = useState(null);

    const [estimatedDistanceOne, setEstimatedDistanceOne] = useState(null);
    const [estimatedDistanceTwo, setEstimatedDistanceTwo] = useState(null);
    const [excessiveDistance, setExcessiveDistance] = useState(false);

    const [estimatedCostOne, setEstimatedCostOne] = useState(null);
    const [estimatedCostTwo, setEstimatedCostTwo] = useState(null);

    const [nearestStoreMarkerOne, setNearestStoreMarkerOne] = useState(null);
    const [nearestStoreMarkerTwo, setNearestStoreMarkerTwo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${configUrl.BASEURL}/api/v1/wificonnection`);
                const data = await response.json();
                if (data.status === 'success') {
                    setStoredData(data.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const form = event.target;
        const division = form.division.value;
        const district = form.district.value;
        const thana = form.thana.value;
        const union = form.union.value;
        const village = form.village.value;
        const holding = form.holding.value;
        // const direction = form.direction.value;
        // const address = form.address.value;

        const searchData = {
            division, district, thana, union, village, holding,
            //  direction, address
        }
        setSearchData(searchData);
    };


    // Function to find the two nearest store
    const findNearestStores = (searchLocation) => {
        let nearestStores = [null, null];
        let shortestDistances = [Infinity, Infinity];
        if (storeData) {
            for (let i = 0; i < storeData.length; i++) {
                const store = storeData[i];
                const storeLocation = L.latLng(store.coordinates[1], store.coordinates[0]);
                const distance = searchLocation.distanceTo(storeLocation);

                // Check if the current distance is shorter than the two shortest distances
                if (distance < shortestDistances[0]) {
                    nearestStores[1] = nearestStores[0];
                    shortestDistances[1] = shortestDistances[0];
                    nearestStores[0] = store;
                    shortestDistances[0] = distance;
                } else if (distance < shortestDistances[1]) {
                    nearestStores[1] = store;
                    shortestDistances[1] = distance;
                }
            }
        }
        return nearestStores;
    };


    // Create wifiPointIcon icon
    const wifiPointIcon = L.icon({
        iconUrl: WifiPointIcon,
        iconSize: [30, 36]
    });

    // Create searchPointIcon icon
    const searchPointIcon = L.icon({
        iconUrl: SPIcon,
        iconSize: [25, 36]
    });

    // Create nearestPointIcon icon One
    const nearestPointIcon1 = L.icon({
        iconUrl: NPIconOne,
        iconSize: [25, 36]
    });

    // Create nearestPointIcon icon Two
    const nearestPointIcon2 = L.icon({
        iconUrl: NPIconTwo,
        iconSize: [25, 36]
    });


    useEffect(() => {
        const myMap = L.map('map').setView([23.7984463, 90.4031033], 7);
        setMyMap(myMap);
        const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

        const tileLayer = L.tileLayer(tileUrl, { attribution });
        tileLayer.addTo(myMap);

        if (searchData) {
            const { division, district, thana, union, village, holding, direction, address } = searchData;
            const searchLocation = `${division}, ${district}, ${thana}, ${union}, ${village} , ${holding}, ${direction}, ${address}`;

            // Initialize the geocoder control
            const geocoder = L.Control.Geocoder.nominatim();


            geocoder.geocode(searchLocation, (results) => {
                if (results && results.length > 0) {
                    const { center } = results[0];
                    setSearchLatLng(center);
                    setNewPos(center)
                    myMap.setView(center);

                    // .addTo(myMap);

                    // Calculate the routes to the nearest two store
                    const nearestStores = findNearestStores(center);

                    if (nearestStores) {
                        const storeLocation1 = L.latLng(nearestStores[0].coordinates[1], nearestStores[0].coordinates[0]);
                        const storeLocation2 = L.latLng(nearestStores[1].coordinates[1], nearestStores[1].coordinates[0]);

                        const routingControl1 = L.Routing.control({
                            waypoints: [L.latLng(center), storeLocation1],
                            routeWhileDragging: true,
                            show: false, // this (show: false) hide the by deault route direction text show
                            lineOptions: {
                                styles: [{ color: '#5533FF', opacity: 0.8, weight: 5 }]
                            },
                            // profile: 'mapbox/walking', // Add the walking profile
                            createMarker: function () { return null; }
                        }).addTo(myMap);

                        const routingControl2 = L.Routing.control({
                            waypoints: [L.latLng(center), storeLocation2],
                            routeWhileDragging: true,
                            show: false, // this (show: false) hide the by deault route direction text show
                            lineOptions: {
                                styles: [{ color: '#FFFC33', opacity: 0.8, weight: 5 }]
                            },
                            // profile: 'mapbox/walking', // Add the walking profile
                            createMarker: function () { return null; }
                        }).addTo(myMap);

                        routingControl1.on('routesfound', function (event) {
                            const routes = event.routes;
                            routes.forEach(function (route, index) {
                                const distance = route.summary.totalDistance;
                                setEstimatedDistanceOne(distance);
                            });
                        });

                        routingControl2.on('routesfound', function (event) {
                            const routes = event.routes;
                            routes.forEach(function (route, index) {
                                const distance = route.summary.totalDistance;
                                setEstimatedDistanceTwo(distance);
                            });
                        });

                        setRoutingControlOne(routingControl1);
                        setRoutingControlTwo(routingControl2);

                        if (searchMarker) {
                            searchMarker.remove();
                        }
                        const searchMarkerIcon = L.marker(center, { icon: searchPointIcon, draggable: true }).addTo(myMap);
                        searchMarkerIcon.on('dragend', function (event) {
                            const newPos = event.target.getLatLng();
                            setNewPos(newPos);
                        });
                        setSearchMarker(searchMarkerIcon);

                        if (nearestStoreMarkerOne) {
                            nearestStoreMarkerOne.remove();
                        }
                        const nearestStoreMarker1 = L.marker(storeLocation1, { icon: nearestPointIcon1, draggable: false }).addTo(myMap);
                        // nearestStoreMarker1.getElement().classList.add('blink');
                        setNearestStoreMarkerOne(nearestStoreMarker1);

                        if (nearestStoreMarkerTwo) {
                            nearestStoreMarkerTwo.remove();
                        }
                        const nearestStoreMarker2 = L.marker(storeLocation2, { icon: nearestPointIcon2, draggable: false }).addTo(myMap);
                        // nearestStoreMarker2.getElement().classList.add('blink');
                        setNearestStoreMarkerTwo(nearestStoreMarker2);


                    }
                }
            });
        }

        // Add GeoJSON layer with custom icon and onEachFeature function
        const shopsLayer = L.geoJSON(storeData, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: wifiPointIcon });
            }
        });

        shopsLayer.addTo(myMap);

        return () => {
            myMap.remove();
        };
    }, [searchData, storeData]);

    useEffect(() => {
        try {
            if (newPos && (routingControlOne || routingControlTwo)) {
                const newNearestStores = findNearestStores(newPos);

                setNearestLocationNameOne(newNearestStores[0]?.locationName);
                setNearestLocationNameTwo(newNearestStores[1]?.locationName);

                const storeLocation1 = L.latLng(newNearestStores[0].coordinates[1], newNearestStores[0].coordinates[0]);
                const storeLocation2 = L.latLng(newNearestStores[1].coordinates[1], newNearestStores[1].coordinates[0]);

                routingControlOne.remove();
                routingControlTwo.remove();

                const newRoutingControl1 = L.Routing.control({
                    waypoints: [L.latLng(newPos), storeLocation1],
                    routeWhileDragging: true,
                    show: false,
                    lineOptions: {
                        styles: [{ color: '#5533FF', opacity: 0.8, weight: 5 }]
                    },
                    // profile: 'mapbox/walking', // Add the walking profile
                    createMarker: function () { return null; }
                }).addTo(myMap);

                const newRoutingControl2 = L.Routing.control({
                    waypoints: [L.latLng(newPos), storeLocation2],
                    routeWhileDragging: true,
                    show: false,
                    lineOptions: {
                        styles: [{ color: '#FFFC33', opacity: 0.8, weight: 5 }]
                    },
                    // profile: 'mapbox/walking', // Add the walking profile
                    createMarker: function () { return null; }
                }).addTo(myMap);

                newRoutingControl1.on('routesfound', function (event) {
                    const routes = event.routes;
                    routes.forEach(function (route, index) {
                        const distance = route.summary.totalDistance;
                        setEstimatedDistanceOne(distance);
                    });
                });

                newRoutingControl2.on('routesfound', function (event) {
                    const routes = event.routes;
                    routes.forEach(function (route, index) {
                        const distance = route.summary.totalDistance;
                        setEstimatedDistanceTwo(distance);
                    });
                });

                setRoutingControlOne(newRoutingControl1);
                setRoutingControlTwo(newRoutingControl2);

                if (searchMarker) {
                    searchMarker.remove();
                }
                const searchMarkerIcon = L.marker(newPos, { icon: searchPointIcon, draggable: true }).addTo(myMap);
                searchMarkerIcon.on('dragend', function (event) {
                    const newPos = event.target.getLatLng();
                    setNewPos(newPos);
                });
                setSearchMarker(searchMarkerIcon);

                if (nearestStoreMarkerOne) {
                    nearestStoreMarkerOne.remove();
                }
                const nearestStoreMarker1 = L.marker(storeLocation1, { icon: nearestPointIcon1, draggable: false }).addTo(myMap);
                // nearestStoreMarker1.getElement().classList.add('blink');
                setNearestStoreMarkerOne(nearestStoreMarker1);

                if (nearestStoreMarkerTwo) {
                    nearestStoreMarkerTwo.remove();
                }
                const nearestStoreMarker2 = L.marker(storeLocation2, { icon: nearestPointIcon2, draggable: false }).addTo(myMap);
                // nearestStoreMarker2.getElement().classList.add('blink');
                setNearestStoreMarkerTwo(nearestStoreMarker2);



                console.log("Estimated Distance One and Two===>>>", estimatedDistanceOne, estimatedDistanceTwo);
            }

        } catch (error) {
            console.log("Error is useEffect", error);
        }

    }, [newPos]);

    useEffect(() => {
        let totalCost1 = 0;
        let totalCost2 = 0;
        const setupCost = 1000;

        totalCost1 = setupCost + estimatedDistanceOne * 15;
        setEstimatedCostOne(totalCost1.toFixed(2));

        totalCost2 = setupCost + estimatedDistanceTwo * 15;
        setEstimatedCostTwo(totalCost2.toFixed(2));

        if (estimatedDistanceOne > 5000) {
            setExcessiveDistance(true);
        } else {
            setExcessiveDistance(false);
        }

    }, [estimatedDistanceOne, estimatedDistanceTwo]);

    return (
        <div className='d-md-flex'>
            <div className='col-3 formArea'>
                <div className='addreddBG p-3'>
                    <h3 className=' fw-bold text-primary'>Address</h3>
                    <form onSubmit={handleSubmit}>
                        <div className='row g-3 mb-2'>
                            <div className='col'>
                                <label htmlFor="division" className="form-label mb-0">Division:</label>
                                <input
                                    type="text"
                                    className="form-control mt-0"
                                    id="division"
                                    name="division"
                                    aria-describedby="division"
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className='row g-3 mb-0'>
                            <div className='col'>
                                <label htmlFor="village" className="form-label mb-0">Village/WordNo:</label>
                                <input
                                    type="text"
                                    className="form-control mt-0"
                                    id="village"
                                    name="village"
                                    aria-describedby="village"
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>


                        {/* <div className='col mb-2'>
                            <label htmlFor="direction" className="form-label mb-0">Direction:</label>
                            <input
                                type="text"
                                className="form-control mt-0"
                                id="direction"
                                name="direction"
                                aria-describedby="direction"
                                onChange={handleInputChange}
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
                                onChange={handleInputChange}
                            />
                        </div> */}

                        {/* <button type="submit" className="btn btn-primary">
                            Search
                        </button> */}

                    </form>


                    <div className=' my-4 small'>
                        {newPos ?
                            <>
                                <p> <b>Selected Position :</b> {newPos?.lat.toFixed(6)},{newPos?.lng.toFixed(6)} </p>
                            </>
                            :
                            <>
                                {searchLatLng ?
                                    <p> <b>Selected Position :</b>  {searchLatLng?.lat.toFixed(6)},{searchLatLng?.lng.toFixed(6)} </p>
                                    :
                                    <>
                                        <h4 className='fw-bold text-center text-success mx-0 mt-0'>Please write your address</h4>
                                    </>
                                }
                            </>
                        }

                        {
                            excessiveDistance &&
                            <div className=' text-center'>
                                <h6 className=' mt-3 mb-1 text-primary' >Nearest Shadhin WifiPoint location is more than 5KM </h6>
                                <p className=' fw-bold text-success'>Please contact on 01958615673 or 0195861567 </p>
                            </div>
                        }

                        {
                            (estimatedDistanceOne && estimatedDistanceTwo) &&
                                (estimatedDistanceOne < estimatedDistanceTwo)
                                ?
                                <>
                                    <p className=''> <b>nearest ShadhinPoint, estimated cost and distance : </b> {nearestLocationNameOne},  {estimatedDistanceOne?.toFixed(2)} M, {estimatedCostOne} TK</p>
                                    <p className='mb-0'> <b>2nd nearest ShadhinPoint, estimated cost and distance : </b> {nearestLocationNameTwo},   {estimatedDistanceTwo?.toFixed(2)} M, {estimatedCostTwo} TK</p>
                                </>
                                :
                                <>
                                    <p className=''> <b>nearest ShadhinPoint, estimated cost and distance : </b> {nearestLocationNameTwo},  {estimatedDistanceTwo?.toFixed(2)} M, {estimatedCostTwo} TK</p>
                                    <p className='mb-0'> <b>2nd nearest ShadhinPoint, estimated cost and distance : </b> {nearestLocationNameOne},   {estimatedDistanceOne?.toFixed(2)} M, {estimatedCostOne} TK</p>
                                </>

                        }


                    </div>
                </div>
            </div>
            <main className='col-9'>
                <div className='col-12' id="map" />
            </main>
        </div>
    );
};

export default ExistingConnectionStatus;