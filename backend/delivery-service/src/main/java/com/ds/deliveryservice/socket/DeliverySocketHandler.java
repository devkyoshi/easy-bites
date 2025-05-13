package com.ds.deliveryservice.socket;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.annotation.OnConnect;
import com.corundumstudio.socketio.annotation.OnDisconnect;
import com.corundumstudio.socketio.annotation.OnEvent;
import com.ds.masterservice.dto.response.orderService.OrderResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class DeliverySocketHandler {

    private final SocketIOServer server;
    private final Map<String, SocketIOClient> driverClients = new ConcurrentHashMap<>();

    public DeliverySocketHandler(SocketIOServer server) {
        this.server = server;
    }

    @OnEvent("*")
    public void onAnyEvent(SocketIOClient client, String eventName, Object... data) {
        log.debug("Received event {} with data {}", eventName, Arrays.toString(data));
    }

    @OnConnect
    public void onConnect(SocketIOClient client) {
        String driverId = client.getHandshakeData().getSingleUrlParam("driverId");
        driverClients.put(driverId, client);
        log.info("Driver {} connected", driverId);

        // Join area room based on driver's location
        client.joinRoom("driver:" + driverId);
    }

    @OnDisconnect
    public void onDisconnect(SocketIOClient client) {
        String driverId = client.getHandshakeData().getSingleUrlParam("driverId");
        driverClients.remove(driverId);
        log.info("Driver {} disconnected", driverId);
    }

    @OnEvent("joinDriverRoom")
    public void onJoinDriverRoom(SocketIOClient client, String driverId) {
        client.joinRoom("driver:" + driverId);
    }

    @OnEvent("updateLocation")
    public void onLocationUpdate(SocketIOClient client, LocationUpdate update) {
        String driverId = client.getHandshakeData().getSingleUrlParam("driverId");
        log.info("Driver {} location update: {},{}", driverId, update.getLat(), update.getLng());

        // Broadcast to dispatchers or customers
        server.getRoomOperations("dispatchers")
                .sendEvent("driverLocation", new DriverLocationEvent(driverId, update));
    }

    @OnEvent("acceptOrder")
    public void onOrderAccept(SocketIOClient client, OrderAcceptRequest request) {
        String driverId = client.getHandshakeData().getSingleUrlParam("driverId");
        log.info("Driver {} accepting order {}", driverId, request.getOrderId());

        // Notify restaurant and customer
        server.getRoomOperations("order:" + request.getOrderId())
                .sendEvent("driverAssigned", new DriverAssignedEvent(driverId));
    }

    @OnEvent("newOrderAvailable")
    public void onNewOrderAvailable(SocketIOClient client, OrderResponse order) {
        String driverId = client.getHandshakeData().getSingleUrlParam("driverId");
        log.info("New order available for driver {}", driverId);
        client.sendEvent("newOrderAvailable", order);
    }

    // Event classes
    @Data
    @AllArgsConstructor
    public static class OrderAcceptEvent {
        private Long driverId;
        private Long orderId;
    }

    @Data
    @AllArgsConstructor
    public static class LocationUpdate {
        private BigDecimal lat;
        private BigDecimal lng;
    }

    @Data
    @AllArgsConstructor
    public static class DriverLocationEvent {
        private String driverId;
        private LocationUpdate location;
    }

    @Data
    @AllArgsConstructor
    public static class OrderAcceptRequest {
        private Long orderId;
    }

    @Data
    @AllArgsConstructor
    public static class DriverAssignedEvent {
        private String driverId;
    }
}
