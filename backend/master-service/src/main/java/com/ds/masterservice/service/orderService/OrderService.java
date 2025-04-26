package com.ds.masterservice.service.orderService;


import com.ds.commons.exception.CustomException;
import com.ds.masterservice.dao.orderService.PaymentStatus;
import com.ds.masterservice.dto.request.orderService.CreateOrderRequest;
import com.ds.masterservice.dto.request.orderService.UpdateOrderStatusRequest;
import com.ds.masterservice.dto.response.orderService.BillResponse;
import com.ds.masterservice.dto.response.orderService.OrderResponse;

import java.util.List;

public interface OrderService {

    OrderResponse createOrder(CreateOrderRequest request) throws CustomException;

    OrderResponse getOrder(Long orderId) throws CustomException;

    List<OrderResponse> getUserOrders(Long userId);

    List<OrderResponse> getUserDeliveredOrders(Long userId);

    OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) throws CustomException;

    void deleteOrder(Long orderId) throws CustomException;

    List<BillResponse> getUserPaidBills(Long userId);

    OrderResponse updatePaymentStatus(Long orderId, PaymentStatus paymentStatus) throws CustomException;

    OrderResponse cancelOrderIfPending(Long orderId) throws CustomException;

    void removeOldCancelledOrders(); // For scheduled cleanup
}
