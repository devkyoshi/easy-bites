package com.ds.masterservice.dao;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@DiscriminatorValue("SYSTEM_ADMIN")
public class SystemAdmin extends User {
    private String adminNotes;
}