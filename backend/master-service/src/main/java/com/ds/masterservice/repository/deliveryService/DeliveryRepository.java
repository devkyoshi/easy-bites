package com.ds.masterservice.repository.deliveryService;

import com.ds.commons.enums.DeliveryStatus;
import com.ds.masterservice.dao.deliveryService.Deliveries;
import com.ds.masterservice.dao.deliveryService.DeliveryPerson;
import com.ds.masterservice.dao.orderService.Order;
import com.ds.masterservice.dto.response.RatingDistributionResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DeliveryRepository extends JpaRepository<Deliveries, Long> {
    List<Deliveries> findByDriverAndStatus(DeliveryPerson driver, DeliveryStatus status);
    boolean existsByOrderAndStatusIn(Order order, List<DeliveryStatus> statuses);

    @Query(value = """
    SELECT\s
        DAYNAME(d.created_at) AS day,
        COUNT(d.id) AS deliveryCount,
        COALESCE(SUM(o.total_amount * 0.1), 0) AS totalEarnings
    FROM deliveries d
    JOIN t_order o ON d.order_id = o.id
    WHERE d.driver_id = :driverId
    AND d.created_at >= :startDate
    GROUP BY DAYNAME(d.created_at)
   \s""", nativeQuery = true)
    List<WeeklyStatsProjection> findWeeklyStatsByDriverNative(
            @Param("driverId") Long driverId,
            @Param("startDate") LocalDate startDate);

    interface WeeklyStatsProjection {
        String getDay();
        Long getDeliveryCount();
        Double getTotalEarnings();
    }

    @Query("SELECT new com.ds.masterservice.dto.response.RatingDistributionResponse(" +
            "d.rating, COUNT(d)) " +
            "FROM Deliveries d " +
            "WHERE d.driver.id = :driverId " +
            "AND d.rating IS NOT NULL " +
            "GROUP BY d.rating")
    List<RatingDistributionResponse> findRatingDistributionByDriver(
            @Param("driverId") Long driverId);

    @Query("SELECT COALESCE(AVG(d.rating), 0) FROM Deliveries d WHERE d.driver.id = :driverId")
    Double findAverageRatingByDriver(@Param("driverId") Long driverId);

    Deliveries findByOrder(Order order);
}
