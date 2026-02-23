package com.vstats.vstats.security;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

@Component
@Getter
@Setter
@Validated
@ConfigurationProperties("api.security")
public class AuthProperties {

    private Token token = new Token();
    private Refresh refresh = new Refresh();

    @Getter
    @Setter
    public static class Token {
        private String secret;
        private Expiration expiration = new Expiration();
    }

    @Getter
    @Setter
    public static class Refresh {
        private Expiration expiration = new Expiration();
    }

    @Getter
    @Setter
    public static class Expiration {
        private Long user;
        private Long staff;
        private Long admin;
    }
}
