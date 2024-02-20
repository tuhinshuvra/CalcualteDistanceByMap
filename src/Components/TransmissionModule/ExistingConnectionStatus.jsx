import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import SadhinIcon from '../../assets/sadhin.png';
import configUrl from '../../api/config';
import './ExistingConnectionStatus.css';

const ExistingConnectionStatus = () => {
    const [storeData, setStoredData] = useState(null);
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
    const [routingControl, setRoutingControl] = useState(null);
    const [nearestPoint, setNearestPoint] = useState(null);
    const [newPos, setNewPos] = useState(null);
    const [estimatedDistance, setEstimatedDistance] = useState(null);
    const [estimatedCost, setEstimatedCost] = useState(null);
    const [myMap, setMyMap] = useState(null);

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
    const findNearestStore = (searchLocation) => {
        let nearestStore = null;
        let shortestDistance = Infinity;

        if (storeData) {
            for (let i = 0; i < storeData.length; i++) {
                const store = storeData[i];

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

                        setRoutingControl(routingControl);

                        routingControl.on('routesfound', function (event) {
                            const routes = event.routes;
                            routes.forEach(function (route, index) {
                                const distance = route.summary.totalDistance;
                                setEstimatedDistance(distance);
                            });
                        });
                    }
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


    if (routingControl) {
        routingControl.on('routingstart', (event) => {
            const newDraggedPos = event.waypoints[0].latLng;
            setNewPos(newDraggedPos)
        });
    }

    useEffect(() => {
        try {
            if (newPos && routingControl) {
                const newNearestStore = findNearestStore(newPos);
                const storeLocation = L.latLng(newNearestStore.coordinates[1], newNearestStore.coordinates[0]);
                // console.log("*******newPos===>********", newPos);

                routingControl.remove();

                const newRoutingControl = L.Routing.control({
                    waypoints: [
                        L.latLng(newPos),
                        storeLocation
                    ],
                    routeWhileDragging: true
                })
                    .addTo(myMap);

                newRoutingControl.on('routesfound', function (event) {
                    const routes = event.routes;
                    routes.forEach(function (route, index) {
                        const distance = route.summary.totalDistance;
                        setEstimatedDistance(distance);
                    });
                });

                setRoutingControl(newRoutingControl);
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

                    {
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
                            <p className=' fw-bold text-primary mb-0'> <b>Estimated Cost</b></p>
                            <p className=' mb-0'>Distance from nearest point = {estimatedDistance} Meter </p>
                            <p className=' mt-0'>Total Cost(SetupCost + Cable ) = {estimatedCost} TK</p>
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

export default ExistingConnectionStatus;