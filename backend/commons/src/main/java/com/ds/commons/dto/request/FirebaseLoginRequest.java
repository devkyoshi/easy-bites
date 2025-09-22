package com.ds.commons.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FirebaseLoginRequest {
    @NotBlank(message = "ID token cannot be blank")
    private String idToken;
}