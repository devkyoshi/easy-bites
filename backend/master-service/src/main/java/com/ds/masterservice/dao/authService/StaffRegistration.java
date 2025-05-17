package com.ds.masterservice.dao.authService;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "t_staff_registration")
public class StaffRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "id", nullable = false)
    @OneToOne(cascade = CascadeType.ALL)
    private User user;

    @Column(name = "is_approved")
    private Boolean isApproved = false;

    private LocalDateTime createdAt;

}
