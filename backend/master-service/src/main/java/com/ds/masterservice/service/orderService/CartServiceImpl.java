package com.ds.masterservice.service.orderService;


import com.ds.commons.exception.CustomException;
import com.ds.commons.exception.ExceptionCode;
import com.ds.masterservice.dao.orderService.Cart;
import com.ds.masterservice.dao.orderService.CartItem;
import com.ds.masterservice.dao.orderService.CartStatus;
import com.ds.masterservice.dto.request.orderService.*;
import com.ds.masterservice.dto.response.orderService.CartItemResponse;
import com.ds.masterservice.dto.response.orderService.CartResponse;
import com.ds.masterservice.repository.orderService.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    @Transactional
    public CartResponse addOrCreateCart(AddOrCreateCartRequest request) {
        Optional<Cart> existingCart = cartRepository.findByUserIdAndStatus(
                request.getUserId(),
                CartStatus.ACTIVE
        );

        if (existingCart.isPresent()) {
            Cart cart = existingCart.get();
            addItemsToCart(cart, request.getItems());
            updateTotalAmount(cart);
            return mapToCartResponse(cartRepository.save(cart));
        } else {
            Cart cart = new Cart();
            cart.setUserId(request.getUserId());
            cart.setStatus(CartStatus.ACTIVE);

            List<CartItem> items = createCartItems(request.getItems());
            cart.setItems(items);

            updateTotalAmount(cart);
            Cart savedCart = cartRepository.save(cart);
            return mapToCartResponse(savedCart);
        }
    }

    // Add these helper methods
    private void addItemsToCart(Cart cart, List<CartItemRequest> items) {
        for (CartItemRequest itemRequest : items) {
            // Check if item already exists
            Optional<CartItem> existingItem = cart.getItems().stream()
                    .filter(i -> i.getItemId().equals(itemRequest.getItemId()))
                    .filter(i -> i.getRestaurantId().equals(itemRequest.getRestaurantId()))
                    .findFirst();

            if (existingItem.isPresent()) {
                // Update existing item
                CartItem item = existingItem.get();
                item.setQuantity(item.getQuantity() + itemRequest.getQuantity());
                item.setTotalPrice(item.getQuantity() * item.getUnitPrice());
            } else {
                // Add new item
                CartItem newItem = new CartItem();
                newItem.setItemId(itemRequest.getItemId());
                newItem.setItemName(itemRequest.getItemName());
                newItem.setItemImage(itemRequest.getItemImage());
                newItem.setRestaurantName( itemRequest.getRestaurantName());
                newItem.setRestaurantId( itemRequest.getRestaurantId());
                newItem.setQuantity(itemRequest.getQuantity());
                newItem.setUnitPrice(itemRequest.getUnitPrice());
                newItem.setTotalPrice(itemRequest.getQuantity() * itemRequest.getUnitPrice());
                cart.getItems().add(newItem);
            }
        }
    }

    private List<CartItem> createCartItems(List<CartItemRequest> itemRequests) {
        return itemRequests.stream()
                .map(item -> {
                    CartItem cartItem = new CartItem();
                    cartItem.setItemId(item.getItemId());
                    cartItem.setItemName(item.getItemName());
                    cartItem.setItemImage(item.getItemImage());
                    cartItem.setRestaurantName( item.getRestaurantName());
                    cartItem.setRestaurantId( item.getRestaurantId());
                    cartItem.setQuantity(item.getQuantity());
                    cartItem.setUnitPrice(item.getUnitPrice());
                    cartItem.setTotalPrice(item.getUnitPrice() * item.getQuantity());
                    return cartItem;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public CartResponse createCart(CreateCartRequest request) {

        Cart cart = new Cart();
        cart.setUserId(request.getUserId());
        cart.setStatus(CartStatus.ACTIVE);

        // Convert request items to cart items
        List<CartItem> items = request.getItems().stream()
                .map(item -> {
                    CartItem cartItem = new CartItem();
                    cartItem.setItemId(item.getItemId());
                    cartItem.setQuantity(item.getQuantity());
                    cartItem.setUnitPrice(item.getUnitPrice());
                    cartItem.setTotalPrice(item.getUnitPrice() * item.getQuantity());
                    return cartItem;
                })
                .collect(Collectors.toList());

        cart.setItems(items);

        // Calculate total amount
        double totalAmount = items.stream()
                .mapToDouble(CartItem::getTotalPrice)
                .sum();
        cart.setTotalAmount(totalAmount);

        Cart savedCart = cartRepository.save(cart);
        return mapToCartResponse(savedCart);
    }

    public CartResponse getCart(Long cartId) throws CustomException {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CustomException(ExceptionCode.CART_NOT_FOUND));
        return mapToCartResponse(cart);
    }

    public CartResponse getUserActiveCart(Long userId) throws CustomException {
        Cart cart = cartRepository.findByUserIdAndStatus(userId, CartStatus.ACTIVE)
                .orElseThrow(() -> new CustomException(ExceptionCode.USER_NOT_FOUND));
        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse updateCart(Long cartId, UpdateCartRequest request) throws CustomException {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CustomException(ExceptionCode.CART_NOT_FOUND));

        if (cart.getStatus() != CartStatus.ACTIVE) {
            throw new IllegalStateException("Cannot update a cart that is not active");
        }

        // Clear existing items
        cart.getItems().clear();

        // Add new items
        List<CartItem> items = request.getItems().stream()
                .map(item -> {
                    CartItem cartItem = new CartItem();
                    cartItem.setItemId(item.getItemId());
                    cartItem.setQuantity(item.getQuantity());
                    cartItem.setUnitPrice(item.getUnitPrice());
                    cartItem.setTotalPrice(item.getUnitPrice() * item.getQuantity());
                    return cartItem;
                })
                .collect(Collectors.toList());

        cart.setItems(items);

        // Recalculate total amount
        double totalAmount = items.stream()
                .mapToDouble(CartItem::getTotalPrice)
                .sum();
        cart.setTotalAmount(totalAmount);

        Cart updatedCart = cartRepository.save(cart);
        return mapToCartResponse(updatedCart);
    }

    @Transactional
    public void deleteCart(Long cartId) throws CustomException {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CustomException(ExceptionCode.CART_NOT_FOUND));

        if (cart.getStatus() != CartStatus.ACTIVE) {
            throw new IllegalStateException("Cannot delete a cart that is not active");
        }

        cartRepository.delete(cart);
    }

    @Transactional
    public CartResponse checkoutCart(Long cartId) throws CustomException {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CustomException(ExceptionCode.CART_NOT_FOUND));

        if (cart.getStatus() != CartStatus.ACTIVE) {
            throw new IllegalStateException("Cannot checkout a cart that is not active");
        }

        cart.setStatus(CartStatus.CHECKED_OUT);
        Cart savedCart = cartRepository.save(cart);
        return mapToCartResponse(savedCart);
    }

    private void updateTotalAmount(Cart cart) {
        double totalAmount = cart.getItems().stream()
                .mapToDouble(CartItem::getTotalPrice)
                .sum();
        cart.setTotalAmount(totalAmount);
    }

    @Transactional
    public CartResponse addItemToCart(Long cartId, AddCartItemRequest request) throws CustomException {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CustomException(ExceptionCode.CART_NOT_FOUND));

        if (cart.getStatus() != CartStatus.ACTIVE) {
            throw new IllegalStateException("Cannot add item to a non-active cart");
        }

        // Check if item already exists
        CartItem existingItem = cart.getItems().stream()
                .filter(i -> i.getItemId().equals(request.getItemId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            existingItem.setTotalPrice(existingItem.getQuantity() * existingItem.getUnitPrice());
        } else {
            CartItem newItem = new CartItem();
            newItem.setItemId(request.getItemId());
            newItem.setQuantity(request.getQuantity());
            newItem.setItemName(request.getItemName());
            newItem.setItemImage(request.getItemImage());
            newItem.setRestaurantName( request.getRestaurantName());
            newItem.setRestaurantId( request.getRestaurantId());
            newItem.setUnitPrice(request.getUnitPrice());
            newItem.setTotalPrice(request.getQuantity() * request.getUnitPrice());
            cart.getItems().add(newItem);
        }

        updateTotalAmount(cart);
        return mapToCartResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse removeItemFromCart(Long cartId, RemoveCartItemRequest request) throws CustomException {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CustomException(ExceptionCode.CART_NOT_FOUND));

        if (cart.getStatus() != CartStatus.ACTIVE) {
            throw new IllegalStateException("Cannot remove item from a non-active cart");
        }

        cart.getItems().removeIf(item -> item.getItemId().equals(request.getItemId()));
        updateTotalAmount(cart);
        return mapToCartResponse(cartRepository.save(cart));
    }
    @Transactional
    public CartResponse updateItemQuantity(Long cartId, UpdateCartItemRequest request) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found for ID: " + cartId));

        if (cart.getStatus() != CartStatus.ACTIVE) {
            throw new IllegalStateException("Cannot update item in a non-active cart");
        }

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getItemId().equals(request.getItemId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item with ID " + request.getItemId() + " not found in cart"));

        item.setQuantity(request.getQuantity());
        item.setTotalPrice(item.getQuantity() * item.getUnitPrice());

        updateTotalAmount(cart);
        return mapToCartResponse(cartRepository.save(cart));
    }
    @Transactional
    public CartResponse removeOrDecrementItem(Long cartId, RemoveOrDecrementItemRequest request) throws CustomException {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CustomException(ExceptionCode.CART_NOT_FOUND));

        if (cart.getStatus() != CartStatus.ACTIVE) {
            throw new IllegalStateException("Cannot modify a non-active cart");
        }

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getItemId().equals(request.getItemId()))
                .findFirst()
                .orElseThrow(() -> new CustomException(ExceptionCode.ITEM_NOT_FOUND_IN_CART));

        if (item.getQuantity() > 1) {
            item.setQuantity(item.getQuantity() - 1);
            item.setTotalPrice(item.getQuantity() * item.getUnitPrice());
        } else {
            cart.getItems().remove(item);
        }

        updateTotalAmount(cart);
        return mapToCartResponse(cartRepository.save(cart));
    }
    @Transactional
    public CartResponse clearCart(Long cartId) throws CustomException {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CustomException(ExceptionCode.CART_NOT_FOUND));

        if (cart.getStatus() != CartStatus.ACTIVE) {
            throw new IllegalStateException("Cannot clear a non-active cart");
        }

        cart.getItems().clear();
        cart.setTotalAmount(0.0);
        return mapToCartResponse(cartRepository.save(cart));
    }

    private CartResponse mapToCartResponse(Cart cart) {
        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setUserId(cart.getUserId());
        response.setTotalAmount(cart.getTotalAmount());
        response.setStatus(cart.getStatus().toString());

        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(item -> {
                    CartItemResponse itemResponse = new CartItemResponse();
                    itemResponse.setItemId(item.getItemId());
                    itemResponse.setItemName(item.getItemName());
                    itemResponse.setItemImage(item.getItemImage());
                    itemResponse.setRestaurantName( item.getRestaurantName());
                    itemResponse.setRestaurantId( item.getRestaurantId());
                    itemResponse.setQuantity(item.getQuantity());
                    itemResponse.setUnitPrice(item.getUnitPrice());
                    itemResponse.setTotalPrice(item.getTotalPrice());
                    return itemResponse;
                })
                .collect(Collectors.toList());

        response.setItems(itemResponses);
        return response;
    }
}