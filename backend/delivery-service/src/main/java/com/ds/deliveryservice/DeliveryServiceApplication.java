package com.ds.deliveryservice;

import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.ds.deliveryservice", "com.ds.commons",  "com.ds.masterservice"})
@EnableJpaRepositories(basePackages = "com.ds.masterservice.repository")
@EntityScan(basePackages = "com.ds.masterservice.dao")
public class DeliveryServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(DeliveryServiceApplication.class, args);
    }

    @Bean
    public ApplicationRunner runner(SocketIOServer server) {
        return args -> {
            server.start();
            System.out.println("Socket.IO server started on port: " + server.getConfiguration().getPort());
        };
    }
}
