package com.ds.masterservice.dao;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "t_food_item")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class FoodItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private Double price;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "stock_quantity_per_day")
    private Integer stockQuantityPerDay;

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    @ManyToOne
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @ManyToOne
    @JoinColumn(name = "menu_category_id", nullable = false)
    private MenuCategory category;

    @Column(name = "is_disabled")
    private Boolean isDisabled = false;

}
