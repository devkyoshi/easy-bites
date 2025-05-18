package com.ds.commons.utils;

import com.ds.commons.exception.CustomException;
import com.ds.commons.exception.ExceptionCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "geocoding.api.url")
public class GeocodingUtil {

    private final RestTemplate restTemplate;

    @Value("${geocoding.api.url}")
    private String geocodingApiUrl;

    @Value("${geocoding.api.format}")
    private String responseFormat;

    public BigDecimal[] getCoordinates(String address) throws CustomException {
        List<String> addressVariants = generateAddressVariants(address);

        for (String variant : addressVariants) {
            try {
                String uri = UriComponentsBuilder
                        .fromUriString(geocodingApiUrl)
                        .queryParam("q", variant)
                        .queryParam("format", responseFormat)
                        .queryParam("limit", 1)
                        .queryParam("addressdetails", 1)
                        .queryParam("dedupe", 1)
                        .build()
                        .toUriString();

                log.info("Attempting geocoding with address variant: {}", variant);
                log.info("Geocoding URI: {}", uri);

                ResponseEntity<NominatimResponse[]> response =
                        restTemplate.getForEntity(uri, NominatimResponse[].class);

                if (response.getBody() != null && response.getBody().length > 0) {
                    NominatimResponse res = response.getBody()[0];
                    if (res.getLat() != null && res.getLon() != null) {
                        BigDecimal lat = new BigDecimal(res.getLat());
                        BigDecimal lon = new BigDecimal(res.getLon());

                        log.info("Coordinates found: {}, {}", lat, lon);
                        return new BigDecimal[]{lat, lon};
                    }
                }

                log.warn("No result for address variant: {}", variant);

            } catch (Exception e) {
                log.warn("Failed geocoding attempt for variant: {}", variant, e);
                // Continue to next variant
            }
        }

        // All attempts failed
        log.error("All geocoding attempts failed for address: {}", address);
        throw new CustomException(ExceptionCode.NO_COORDINATES_FOUND);
    }

    private List<String> generateAddressVariants(String address) {
        List<String> variants = new ArrayList<>();
        variants.add(address); // Original

        // Remove things that confuse geocoders
        variants.add(address.replaceAll("(?i)No\\s*\\d+", "").trim());
        variants.add(address.replaceAll("\\d{5}", "").trim()); // Remove ZIP/postal
        variants.add(address.replaceAll(",\\s*Western Province.*", "").trim());
        variants.add(address.replaceAll(",\\s*Sri Lanka", "").trim());

        // Simplified last-chance fallback (e.g., just city and country)
        variants.add("Colombo, Sri Lanka");
        return variants;
    }
}
