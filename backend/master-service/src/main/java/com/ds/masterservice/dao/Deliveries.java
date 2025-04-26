package com.ds.masterservice.dao;

import com.ds.commons.enums.DeliveryStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Deliveries {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pickup_lat", precision = 10, scale = 8)
    private BigDecimal pickupLat;

    @Column(name = "pickup_lng", precision = 11, scale = 8)
    private BigDecimal pickupLng;

    @Column(name = "delivery_lat", precision = 10, scale = 8)
    private BigDecimal deliveryLat;

    @Column(name = "delivery_lng", precision = 11, scale = 8)
    private BigDecimal deliveryLng;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DeliveryStatus status = DeliveryStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "proof_image", columnDefinition = "LONGTEXT")
    private String proofImage;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private DeliveryPerson driver;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

