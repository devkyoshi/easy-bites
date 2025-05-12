import axios from 'axios';

const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY;

export async function fetchRouteCoordinates(
    coordinates: [number, number][]
): Promise<[number, number][]> {
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';
    const body = {
        coordinates: coordinates.map(([lat, lng]) => [lng, lat]) // [lng, lat] order
    };

    const response = await axios.post(url, body, {
        headers: {
            Authorization: ORS_API_KEY,
            'Content-Type': 'application/json'
        }
    });

    const geoCoords = response.data.features[0].geometry.coordinates;
    return geoCoords.map(([lng, lat]: number[]) => [lat, lng]); // convert back to [lat, lng]
}