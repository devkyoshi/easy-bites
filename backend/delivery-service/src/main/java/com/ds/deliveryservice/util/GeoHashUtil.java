package com.ds.deliveryservice.util;

import ch.hsr.geohash.GeoHash;

public class GeoHashUtil {
    private static final int GEOHASH_PRECISION = 7; // Adjust for area radius ~153m

    public static String encode(double latitude, double longitude) {
        return GeoHash.withCharacterPrecision(latitude, longitude, GEOHASH_PRECISION).toBase32();
    }
}
