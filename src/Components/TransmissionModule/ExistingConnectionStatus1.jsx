import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import SadhinIcon from '../../assets/sadhin.png';
import NearestPointMarker from '../../assets/selectedLocation.png';
import configUrl from '../../api/config';
import './ExistingConnectionStatus.css';

const ExistingConnectionStatus1 = () => {
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
    const [newPos, setNewPos] = useState(null);
    const [newPos1, setNewPos1] = useState(null);
    const [newPos2, setNewPos2] = useState(null);

    const [routingControl, setRoutingControl] = useState(null);
    const [routingControlOne, setRoutingControlOne] = useState(null);
    const [routingControlTwo, setRoutingControlTwo] = useState(null);

    const [nearestLocationName, setNearestLocationName] = useState(null);
    const [nearestLocationNameOne, setNearestLocationNameOne] = useState(null);
    const [nearestLocationNameTwo, setNearestLocationNameTwo] = useState(null);

    const [estimatedDistance, setEstimatedDistance] = useState(null);
    const [estimatedDistanceOne, setEstimatedDistanceOne] = useState(null);
    const [estimatedDistanceTwo, setEstimatedDistanceTwo] = useState(null);

    const [estimatedCost, setEstimatedCost] = useState(null);
    const [estimatedCostOne, setEstimatedCostOne] = useState(null);
    const [estimatedCostTwo, setEstimatedCostTwo] = useState(null);


    const [nearestStoreMarker, setNearestStoreMarker] = useState(null);
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


    // Function to find the nearest store
    // const findNearestStore = (searchLocation) => {
    //     let nearestStore = null;
    //     let shortestDistance = Infinity;

    //     if (storeData) {
    //         for (let i = 0; i < storeData.length; i++) {
    //             const store = storeData[i];

    //             const storeLocation = L.latLng(store.coordinates[1], store.coordinates[0]);
    //             const distance = searchLocation.distanceTo(storeLocation);
    //             if (distance < shortestDistance) {
    //                 shortestDistance = distance;
    //                 nearestStore = store;
    //             }
    //         }
    //     }
    //     return nearestStore;
    // };

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
                    // setNewPos(center)
                    myMap.setView(center);

                    // Calculate the route to the nearest store
                    // const nearestStore = findNearestStore(center);


                    // if (nearestStore) {
                    //     const storeLocation = L.latLng(nearestStore.coordinates[1], nearestStore.coordinates[0]);

                    //     const routingControl = L.Routing.control({
                    //         waypoints: [
                    //             L.latLng(center),
                    //             storeLocation
                    //         ],
                    //         routeWhileDragging: true,
                    //         show: false // this (show: false) hide the by deault route direction text show
                    //     }).addTo(myMap);

                    //     setRoutingControl(routingControl);

                    //     routingControl.on('routesfound', function (event) {
                    //         const routes = event.routes;
                    //         routes.forEach(function (route, index) {
                    //             const distance = route.summary.totalDistance;
                    //             setEstimatedDistance(distance);
                    //         });
                    //     });
                    //     // Add marker for nearest store
                    //     if (nearestStoreMarker) {
                    //         nearestStoreMarker.remove();
                    //     }
                    //     const nearestStoreMarker1 = L.marker(storeLocation, { draggable: false }).addTo(myMap);
                    //     setNearestStoreMarker(nearestStoreMarker1);
                    // }

                    const nearestStores = findNearestStores(center);
                    // console.log("Nearest Store 1 out =========>", nearestStores[0].coordinates[1], nearestStores[0].coordinates[0]);
                    // console.log("Nearest Store 2 out =========>", nearestStores[1].coordinates[1], nearestStores[1].coordinates[0]);

                    if (nearestStores) {
                        const storeLocation1 = L.latLng(nearestStores[0].coordinates[1], nearestStores[0].coordinates[0]);
                        const storeLocation2 = L.latLng(nearestStores[1].coordinates[1], nearestStores[1].coordinates[0]);

                        // console.log("NearestStores==============>", nearestStores);
                        // console.log("Nearest two store==============>", storeLocation1, storeLocation2);

                        const routingControl1 = L.Routing.control({
                            waypoints: [
                                L.latLng(center),
                                storeLocation1
                            ],
                            routeWhileDragging: true,
                            show: false // this (show: false) hide the by deault route direction text show
                        }).addTo(myMap);

                        const routingControl2 = L.Routing.control({
                            waypoints: [
                                L.latLng(center),
                                storeLocation2
                            ],
                            routeWhileDragging: true,
                            show: false // this (show: false) hide the by deault route direction text show
                        }).addTo(myMap);


                        setRoutingControlOne(routingControl1);
                        setRoutingControlTwo(routingControl2);

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
                                route.route.setOpacity(0);  //this hide the route path for the 2nd nearest point
                            });

                        });


                        // Add marker for nearest store one
                        if (nearestStoreMarkerOne) {
                            nearestStoreMarkerOne.remove();
                        }
                        const nearestStoreMarker1 = L.marker(storeLocation1, { draggable: false }).addTo(myMap);
                        setNearestStoreMarkerOne(nearestStoreMarker1);

                        // Add marker for nearest store two
                        if (nearestStoreMarkerTwo) {
                            nearestStoreMarkerTwo.remove();
                        }
                        const nearestStoreMarker2 = L.marker(storeLocation2, { draggable: false }).addTo(myMap);
                        setNearestStoreMarkerTwo(nearestStoreMarker2);
                    }

                    // setNearestLocationName(nearestStore?.locationName);
                    setNearestLocationNameOne(nearestStores[0]?.locationName);
                    setNearestLocationNameTwo(nearestStores[1]?.locationName);
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
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: myIcon });
            }
        });

        shopsLayer.addTo(myMap);

        return () => {
            myMap.remove();
        };
    }, [searchData, storeData]);


    if (routingControlOne) {
        routingControlOne.on('routingstart', (event) => {
            const newDraggedPos = event.waypoints[0].latLng;
            console.log("New dragged position One =========>", newDraggedPos);
            setNewPos1(newDraggedPos)
        });
    }

    if (routingControlTwo) {
        routingControlTwo.on('routingstart', (event) => {
            const newDraggedPos = event.waypoints[0].latLng;
            console.log("New dragged position Two =========>", newDraggedPos);
            setNewPos2(newDraggedPos)
        });
    }

    // useEffect(() => {
    //     try {
    //         if (newPos && routingControl) {
    //             const newNearestStore = findNearestStore(newPos);

    //             // console.log("*******newNearestStore ===>********", newNearestStore?.locationName);
    //             setNearestLocationName(newNearestStore?.locationName);

    //             const storeLocation = L.latLng(newNearestStore.coordinates[1], newNearestStore.coordinates[0]);

    //             routingControl.remove();

    //             const newRoutingControl = L.Routing.control({
    //                 waypoints: [
    //                     L.latLng(newPos),
    //                     storeLocation
    //                 ],
    //                 routeWhileDragging: true,
    //                 show: false // this (show: false) hide the by deault route direction text show
    //             })
    //                 .addTo(myMap);

    //             newRoutingControl.on('routesfound', function (event) {
    //                 const routes = event.routes;
    //                 routes.forEach(function (route, index) {
    //                     const distance = route.summary.totalDistance;
    //                     setEstimatedDistance(distance);
    //                 });
    //             });
    //             setRoutingControl(newRoutingControl);

    //             // Add marker for nearest store
    //             if (nearestStoreMarker) {
    //                 nearestStoreMarker.remove();
    //             }
    //             const nearestStoreMarker1 = L.marker(storeLocation, { draggable: false }).addTo(myMap); // Make this marker not draggable
    //             setNearestStoreMarker(nearestStoreMarker1);
    //         }

    //     } catch (error) {
    //         console.log("Error is useEffect", error);
    //     }

    // }, [newPos]);


    console.log("After drag new position out ====>", newPos1, newPos2);

    useEffect(() => {
        try {
            if (newPos && (routingControlOne || routingControlTwo)) {
                const newNearestStores = findNearestStores(newPos);

                console.log("*******after drag location nearest Stores ===>********", newPos);

                const storeLocation1 = L.latLng(newNearestStores[0].coordinates[1], newNearestStores[0].coordinates[0]);
                const storeLocation2 = L.latLng(newNearestStores[1].coordinates[1], newNearestStores[1].coordinates[0]);

                console.log("After drag store One, store Two =====>>>", storeLocation1, storeLocation2);

                routingControlOne.remove();
                routingControlTwo.remove();

                const newRoutingControl1 = L.Routing.control({
                    waypoints: [
                        L.latLng(newPos),
                        storeLocation1
                    ],
                    routeWhileDragging: true,
                    show: false // this (show: false) hide the by deault route direction text show
                }).addTo(myMap);

                const newRoutingControl2 = L.Routing.control({
                    waypoints: [
                        L.latLng(newPos),
                        storeLocation2
                    ],
                    routeWhileDragging: true,
                    show: false // this (show: false) hide the by deault route direction text show
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
                        route.route.setOpacity(0);  //this hide the route path for the 2nd nearest point
                    });
                });

                // Add marker for nearest store one
                if (nearestStoreMarkerOne) {
                    nearestStoreMarkerOne.remove();
                }
                const nearestStoreMarker1 = L.marker(storeLocation1, { draggable: false }).addTo(myMap);
                setNearestStoreMarkerOne(nearestStoreMarker1);

                // Add marker for nearest store two
                if (nearestStoreMarkerTwo) {
                    nearestStoreMarkerTwo.remove();
                }
                const nearestStoreMarker2 = L.marker(storeLocation2, { draggable: false }).addTo(myMap);
                setNearestStoreMarkerTwo(nearestStoreMarker2);

                // setRoutingControlOne(newRoutingControl1);
                // setRoutingControlTwo(newRoutingControl2);

                setNearestLocationNameOne(newNearestStores[0]?.locationName);
                setNearestLocationNameTwo(newNearestStores[1]?.locationName);
            }

        } catch (error) {
            console.log("Error is useEffect", error);
        }

    }, [newPos]);


    useEffect(() => {
        let totalCost = 0;
        const setupCost = 1000;

        totalCost = setupCost + estimatedDistance * 15;
        setEstimatedCost(totalCost.toFixed(2));
    }, [estimatedDistance]);

    useEffect(() => {
        let totalCost1 = 0;
        let totalCost2 = 0;
        const setupCost = 1000;

        totalCost1 = setupCost + estimatedDistanceOne * 15;
        totalCost2 = setupCost + estimatedDistanceTwo * 15;

        setEstimatedCostOne(totalCost1.toFixed(2));
        setEstimatedCostTwo(totalCost2.toFixed(2));

    }, [estimatedDistanceOne, estimatedDistanceTwo]);



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

                        <div className='row g-3 mb-2'>
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

                        <button type="submit" className="btn btn-primary">
                            Search
                        </button>

                    </form>

                    {/* {
                        estimatedDistance &&
                        <div className=' my-4 fw-bold'>
                            {newPos ?
                                <>
                                    <p> <b>Selected Position :</b> {newPos?.lat.toFixed(6)},{newPos?.lng.toFixed(6)} </p>
                                </>
                                :
                                <>
                                    <p> <b>Selected Position :</b>  {searchLatLng?.lat.toFixed(6)},{searchLatLng?.lng.toFixed(6)} </p>
                                </>
                            }
                            <p className=' fw-bold text-primary mb-0'> <b>Nearest Shadhin Point Name</b></p>
                            <p className=' mb-0 small'>{nearestLocationName}</p>
                            <p className=' fw-bold text-primary mb-0'> <b>Estimated Distance & Cost</b></p>
                            <p className=' mb-0 small'>Distance & cost = {estimatedDistance} M, {estimatedCost} TK</p>
                        </div>
                    } */}

                    {
                        (estimatedDistanceOne || estimatedDistanceTwo) &&
                        <div className=' my-4'>
                            {newPos ?
                                <>
                                    <p> <b>Selected Position :</b> {newPos?.lat.toFixed(6)},{newPos?.lng.toFixed(6)} </p>
                                </>
                                :
                                <>
                                    <p> <b>Selected Position :</b>  {searchLatLng?.lat.toFixed(6)},{searchLatLng?.lng.toFixed(6)} </p>
                                </>
                            }

                            <p className='text-primary mb-0 small'> <b>1st Nearest Shadhin Point Name: </b>{nearestLocationNameOne}</p>
                            <p className='text-primary mb-0 small'> <b>2nd Nearest Shadhin Point Name: </b>{nearestLocationNameTwo}</p>

                            <p className=' fw-bold text-primary mb-0'> <b>Estimated Distance & Cost</b></p>
                            <p className=' mb-0 small'>Distance1 & cost = {estimatedDistanceOne} M, {estimatedCostOne} TK</p>
                            <p className=' mb-0 small'>Distance2 & cost = {estimatedDistanceTwo} M, {estimatedCostTwo} TK</p>
                        </div>
                    }
                </div>
            </div>
            <main className='col-9'>
                <div className='col-12' id="map" />
            </main>
        </div>
    );
};

export default ExistingConnectionStatus1;