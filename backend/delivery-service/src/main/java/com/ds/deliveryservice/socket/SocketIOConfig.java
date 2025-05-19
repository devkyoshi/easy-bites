package com.ds.deliveryservice.socket;

import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.annotation.SpringAnnotationScanner;
import com.corundumstudio.socketio.Transport;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SocketIOConfig {

    @Value("${socketio.host}")
    private String host;

    @Value("${socketio.port}")
    private Integer port;

    @Bean
    public SocketIOServer socketIOServer() {
        com.corundumstudio.socketio.Configuration config = new com.corundumstudio.socketio.Configuration();
        config.setHostname(host);
        config.setPort(port);
        config.setOrigin("http://localhost:5173"); // Temporarily allow all origins for testing
        config.setPingInterval(25000);
        config.setPingTimeout(60000);

        // Add these configurations
        config.setTransports(Transport.WEBSOCKET, Transport.POLLING);
        config.setAuthorizationListener(data -> true);
        config.setAllowCustomRequests(true);

        return new SocketIOServer(config);
    }

    @Bean
    public SpringAnnotationScanner springAnnotationScanner(SocketIOServer socketServer) {
        return new SpringAnnotationScanner(socketServer);
    }

    @Bean
    public DeliverySocketHandler deliverySocketHandler(SocketIOServer socketServer) {
        return new DeliverySocketHandler(socketServer);
    }
}