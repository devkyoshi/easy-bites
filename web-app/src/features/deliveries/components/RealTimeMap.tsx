// RealTimeMap.tsx
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { IOrder, IDeliveryResponse } from '@/services/types/delivery.type';
import { fetchOrderDetails } from '@/services/delivery-service.ts';

// Fix default marker icons
const iconRetinaUrl = '/images/markers/marker-icon-2x.png';
const iconUrl = '/images/markers/marker-icon.png';
const shadowUrl = '/images/markers/marker-shadow.png';

const iconDefault = L.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

interface RealTimeMapProps {
    driverLocation: { lat: number; lng: number };
    orders: IOrder[];
    activeDelivery: IDeliveryResponse | null;
    className?: string;
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
                                className = 'h-[500px] w-full rounded-xl border'
                            }: RealTimeMapProps) => {
    const [orderDetails, setOrderDetails] = useState<IOrder | null>(null);
    const [loading, setLoading] = useState(false);

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
            } catch (error) {
                console.error('Failed to fetch map data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeDelivery]);

    // Get restaurant name from order items (first item's restaurant)
    const restaurantName = orderDetails?.items[0]?.restaurantName || 'Restaurant';

    return (
        <div className={className}>
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <MapUpdater center={center} zoom={zoom} />

                {/* Driver Marker */}
                <Marker position={center}>
                    <Popup className="font-sans">
                        <div className="space-y-1">
                            <h4 className="font-bold text-blue-600">Your Location</h4>
                            <p className="text-sm">
                                {center[0].toFixed(6)}, {center[1].toFixed(6)}
                            </p>
                        </div>
                    </Popup>
                </Marker>

                {/* Active Delivery Route */}
                {activeDelivery && !loading && (
                    <>
                        <Polyline
                            positions={[
                                center,
                                [activeDelivery.pickupLat, activeDelivery.pickupLng],
                                [activeDelivery.deliveryLat, activeDelivery.deliveryLng]
                            ]}
                            color="#3b82f6"
                            weight={4}
                            dashArray="5, 5"
                        />
                        {/* Pickup Marker (Restaurant) */}
                        <Marker position={[activeDelivery.pickupLat, activeDelivery.pickupLng]}>
                            <Popup>
                                <div className="font-sans space-y-1">
                                    <h4 className="font-bold text-green-600">Pickup Location</h4>
                                    <p className="text-sm">{restaurantName}</p>
                                </div>
                            </Popup>
                        </Marker>
                        {/* Delivery Marker */}
                        <Marker position={[activeDelivery.deliveryLat, activeDelivery.deliveryLng]}>
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