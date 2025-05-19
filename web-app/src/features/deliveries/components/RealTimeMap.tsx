// RealTimeMap.tsx
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { IOrder, IDeliveryResponse } from '@/services/types/delivery.type';
import { fetchOrderDetails } from '@/services/delivery-service.ts';
import { fetchRouteCoordinates } from '@/services/routing-service.ts';

// Custom marker icons
const driverIcon = new L.Icon({
    iconUrl: '/images/markers/driver-marker.png',
    iconRetinaUrl: '/images/markers/driver-marker-2x.png',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -40],
    shadowUrl: '/images/markers/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41]
});

const pickupIcon = new L.Icon({
    iconUrl: '/images/markers/restaurant-marker.png',
    iconRetinaUrl: '/images/markers/restaurant-marker-2x.png',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -40],
    shadowUrl: '/images/markers/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41]
});

const deliveryIcon = new L.Icon({
    iconUrl: '/images/markers/marker-icon.png',
    iconRetinaUrl: '/images/markers/marker-icon-2x.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: '/images/markers/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [12, 41]
});

interface RealTimeMapProps {
    driverLocation: { lat: number; lng: number };
    orders: IOrder[];
    activeDelivery: IDeliveryResponse | null;
    className?: string;
    isStatic?: boolean;
}

const MapUpdater = ({ center, zoom }: { center: [number, number]; zoom?: number }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, zoom || map.getZoom(), { duration: 1 });
    }, [center, zoom, map]);
    return null;
};

export const RealTimeMap = ({
                                driverLocation,
                                activeDelivery,
                                className = 'h-[500px] w-full rounded-xl shadow-lg border border-gray-300 overflow-hidden',
                                isStatic = false
                            }: RealTimeMapProps) => {
    const [orderDetails, setOrderDetails] = useState<IOrder | null>(null);
    const [loading, setLoading] = useState(false);
    const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

    const center: [number, number] = [driverLocation.lat, driverLocation.lng];
    const zoom = activeDelivery ? 15 : 13;

    useEffect(() => {
        if (!activeDelivery) {
            setOrderDetails(null);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const orderData = await fetchOrderDetails(activeDelivery.orderId);
                setOrderDetails(orderData);

                const route = await fetchRouteCoordinates([
                    [driverLocation.lat, driverLocation.lng],
                    [activeDelivery.pickupLat, activeDelivery.pickupLng],
                    [activeDelivery.deliveryLat, activeDelivery.deliveryLng]
                ]);
                setRouteCoords(route);
            } catch (error) {
                console.error('Failed to fetch map data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeDelivery]);

    const restaurantName = orderDetails?.items[0]?.restaurantName || 'Restaurant';

    return (
        <div className={className}>
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%', borderRadius: '0.5rem', filter: 'brightness(95%) contrast(110%)' }}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {!isStatic && <MapUpdater center={center} zoom={zoom} />}

                {/* Driver Marker */}
                <Marker position={center} icon={driverIcon}>
                    <Popup className="font-sans">
                        <div className="space-y-1">
                            <h4 className="font-bold text-blue-600">Your Location</h4>
                            <p className="text-sm">{center[0].toFixed(6)}, {center[1].toFixed(6)}</p>
                        </div>
                    </Popup>
                </Marker>

                {/* Route */}
                {activeDelivery && !loading && (
                    <>
                        {routeCoords.length > 0 && (
                            <Polyline
                                positions={routeCoords}
                                color="#2563eb"
                                weight={6}
                                opacity={0.7}
                                dashArray="10, 6"
                            />
                        )}

                        {/* Pickup Marker */}
                        <Marker position={[activeDelivery.pickupLat, activeDelivery.pickupLng]} icon={pickupIcon}>
                            <Popup>
                                <div className="font-sans space-y-1">
                                    <h4 className="font-bold text-green-600">Pickup Location</h4>
                                    <p className="text-sm">{restaurantName}</p>
                                </div>
                            </Popup>
                        </Marker>

                        {/* Delivery Marker */}
                        <Marker position={[activeDelivery.deliveryLat, activeDelivery.deliveryLng]} icon={deliveryIcon}>
                            <Popup>
                                <div className="font-sans space-y-1">
                                    <h4 className="font-bold text-purple-600">Delivery Location</h4>
                                    <p className="text-sm">{orderDetails?.deliveryAddress || 'Delivery address'}</p>
                                </div>
                            </Popup>
                        </Marker>
                    </>
                )}
            </MapContainer>
        </div>
    );
};
