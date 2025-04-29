package com.ds.commons.utils;

import java.math.BigDecimal;

public class GeoUtils {

    private static final int EARTH_RADIUS_KM = 6371;

    /**
     * Calculates the distance between two coordinates using the Haversine formula.
     */
    public static double calculateDistance(BigDecimal lat1, BigDecimal lon1, BigDecimal lat2, BigDecimal lon2) {
        double lat1d = lat1.doubleValue();
        double lon1d = lon1.doubleValue();
        double lat2d = lat2.doubleValue();
        double lon2d = lon2.doubleValue();

        double latDistance = Math.toRadians(lat2d - lat1d);
        double lonDistance = Math.toRadians(lon2d - lon1d);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1d)) * Math.cos(Math.toRadians(lat2d))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }

    /**
     * Checks if two coordinates are within a certain radius (in km).
     */
    public static boolean isWithinRadius(BigDecimal lat1, BigDecimal lon1,
                                         BigDecimal lat2, BigDecimal lon2,
                                         double radiusKm) {
        return calculateDistance(lat1, lon1, lat2, lon2) <= radiusKm;
    }

    /**
     * Generates a static Google Map URL centered at the given coordinates.
     */
    public static String getStaticMapUrl(BigDecimal lat, BigDecimal lng, int width, int height) {
        return String.format("https://maps.googleapis.com/maps/api/staticmap?center=%.6f,%.6f&zoom=15&size=%dx%d&markers=%.6f,%.6f",
                lat.doubleValue(), lng.doubleValue(), width, height, lat.doubleValue(), lng.doubleValue());
    }
}
