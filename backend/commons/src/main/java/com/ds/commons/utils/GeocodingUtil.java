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
        try {
            String uri = UriComponentsBuilder
                    .fromUriString(geocodingApiUrl)
                    .queryParam("q", address)
                    .queryParam("format", responseFormat)
                    .queryParam("limit", 1)
                    .build()
                    .toUriString();

            ResponseEntity<NominatimResponse[]> response =
                    restTemplate.getForEntity(uri, NominatimResponse[].class);

            if (response.getBody() != null && response.getBody().length > 0) {
                BigDecimal lat = new BigDecimal(response.getBody()[0].getLat());
                BigDecimal lon = new BigDecimal(response.getBody()[0].getLon());
                return new BigDecimal[]{lat, lon};
            }
            else {
                log.error("No coordinates returned for address: {}", address);
                throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
            }

        } catch (Exception e) {
            log.error("Failed to fetch coordinates for address: {}", address, e);
            throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
        }
    }
}
