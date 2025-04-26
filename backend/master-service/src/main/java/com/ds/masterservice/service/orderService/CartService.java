package com.ds.masterservice.service.orderService;


import com.ds.commons.exception.CustomException;
import com.ds.masterservice.dto.request.orderService.*;
import com.ds.masterservice.dto.response.orderService.CartResponse;

public interface CartService {

    CartResponse addOrCreateCart(AddOrCreateCartRequest request);

    CartResponse createCart(CreateCartRequest request);

    CartResponse getCart(Long cartId) throws CustomException;

    CartResponse getUserActiveCart(Long userId) throws CustomException;

    CartResponse updateCart(Long cartId, UpdateCartRequest request) throws CustomException;

    void deleteCart(Long cartId) throws CustomException;

    CartResponse checkoutCart(Long cartId) throws CustomException;

    CartResponse addItemToCart(Long cartId, AddCartItemRequest request) throws CustomException;

    CartResponse removeItemFromCart(Long cartId, RemoveCartItemRequest request) throws CustomException;

    CartResponse updateItemQuantity(Long cartId, UpdateCartItemRequest request);

    CartResponse removeOrDecrementItem(Long cartId, RemoveOrDecrementItemRequest request) throws CustomException;

    CartResponse clearCart(Long cartId) throws CustomException;
}
