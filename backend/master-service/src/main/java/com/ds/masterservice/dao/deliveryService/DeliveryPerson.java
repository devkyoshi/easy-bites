package com.ds.masterservice.dao.deliveryService;

import com.ds.commons.enums.VehicleType;
import com.ds.masterservice.dao.authService.User;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@DiscriminatorValue("DELIVERY_PERSON")
public class DeliveryPerson extends User {

    @Enumerated(EnumType.STRING)
    private VehicleType vehicleType;

    @Column(unique = true)
    private String vehicleNumber;

    @Column(unique = true)
    private String licenseNumber;

    private Boolean isAvailable = true;

    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Deliveries> deliveries;

    @Column(precision = 10, scale = 8)
    private BigDecimal currentLat;

    @Column(precision = 11, scale = 8)
    private BigDecimal currentLng;

}