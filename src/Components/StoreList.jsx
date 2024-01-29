import { useEffect, useState } from 'react';
import storeData from '../data/storeData.json';
import L from 'leaflet';
import './StoreList.css';

const StoreList = () => {
    const [map, setMap] = useState(null);

    useEffect(() => {
        const myMap = L.map('map').setView([23.7984463, 90.4031033], 7);
        const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Coded by coder\'s gyan with ❤️';
        const tileLayer = L.tileLayer(tileUrl, { attribution });
        tileLayer.addTo(myMap);
        setMap(myMap);

        // Create custom icon
        const myIcon = L.icon({
            iconUrl: 'sadhin.png',
            iconSize: [30, 40]
        });

        // Add GeoJSON layer with custom icon and onEachFeature function
        const shopsLayer = L.geoJSON(storeData, {
            onEachFeature: onEachFeature,
            pointToLayer: function (feature, latlng) {
                // return L.marker(latlng, { icon: myIcon });
                return L.marker(latlng);
            }
        });
        shopsLayer.addTo(myMap);

        return () => {
            myMap.remove();
        };
    }, [storeData]);

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
        <div>
            <main className=''>
                <div className="store-list col-3">
                    <div className="heading">
                        <h2>Our Connections</h2>
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