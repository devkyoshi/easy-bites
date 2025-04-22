package com.ds.orderservice.service;


import com.ds.orderservice.dao.Cart;
import com.ds.orderservice.dao.CartItem;
import com.ds.orderservice.dao.CartStatus;
import com.ds.orderservice.dto.*;
import com.ds.orderservice.repository.CartRepository;
import com.ds.orderservice.utils.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    @Transactional
    public CartResponse addOrCreateCart(AddOrCreateCartRequest request) {
        Optional<Cart> existingCart = cartRepository.findByUserIdAndRestaurantIdAndStatus(
                request.getUserId(),
                request.getRestaurantId(),
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
            cart.setRestaurantId(request.getRestaurantId());
            cart.setRestaurantName(request.getRestaurantName());
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
                    cartItem.setQuantity(item.getQuantity());
                    cartItem.setUnitPrice(item.getUnitPrice());
                    cartItem.setTotalPrice(item.getUnitPrice() * item.getQuantity());
                    return cartItem;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public CartResponse createCart(CreateCartRequest request) {
        // Check if user already has an active cart for this restaurant
        cartRepository.findByUserIdAndRestaurantIdAndStatus(request.getUserId(), request.getRestaurantId(), CartStatus.ACTIVE)
                .ifPresent(cart -> {
                    throw new IllegalStateException("User already has an active cart for this restaurant");
                });

        Cart cart = new Cart();
        cart.setUserId(request.getUserId());
        cart.setRestaurantId(request.getRestaurantId());
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

    public CartResponse getCart(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found with id: " + cartId));
        return mapToCartResponse(cart);
    }

    public CartResponse getUserActiveCart(Long userId) {
        Cart cart = cartRepository.findByUserIdAndStatus(userId, CartStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("No active cart found for user: " + userId));
        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse updateCart(Long cartId, UpdateCartRequest request) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found with id: " + cartId));

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
    public void deleteCart(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found with id: " + cartId));

        if (cart.getStatus() != CartStatus.ACTIVE) {
            throw new IllegalStateException("Cannot delete a cart that is not active");
        }

        cartRepository.delete(cart);
    }

    @Transactional
    public CartResponse checkoutCart(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found with id: " + cartId));

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
    public CartResponse addItemToCart(Long cartId, AddCartItemRequest request) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found with id: " + cartId));

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
            newItem.setUnitPrice(request.getUnitPrice());
            newItem.setTotalPrice(request.getQuantity() * request.getUnitPrice());
            cart.getItems().add(newItem);
        }

        updateTotalAmount(cart);
        return mapToCartResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse removeItemFromCart(Long cartId, RemoveCartItemRequest request) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found with id: " + cartId));

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
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found with id: " + cartId));

        if (cart.getStatus() != CartStatus.ACTIVE) {
            throw new IllegalStateException("Cannot update item in a non-active cart");
        }

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getItemId().equals(request.getItemId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Item not found in cart: " + request.getItemId()));

        item.setQuantity(request.getQuantity());
        item.setTotalPrice(item.getQuantity() * item.getUnitPrice());

        updateTotalAmount(cart);
        return mapToCartResponse(cartRepository.save(cart));
    }
    @Transactional
    public CartResponse removeOrDecrementItem(Long cartId, RemoveOrDecrementItemRequest request) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found with id: " + cartId));

        if (cart.getStatus() != CartStatus.ACTIVE) {
            throw new IllegalStateException("Cannot modify a non-active cart");
        }

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getItemId().equals(request.getItemId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Item not found in cart: " + request.getItemId()));

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
    public CartResponse clearCart(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found with id: " + cartId));

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
        response.setRestaurantId(cart.getRestaurantId());
        response.setRestaurantName(cart.getRestaurantName());
        response.setTotalAmount(cart.getTotalAmount());
        response.setStatus(cart.getStatus().toString());

        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(item -> {
                    CartItemResponse itemResponse = new CartItemResponse();
                    itemResponse.setItemId(item.getItemId());
                    itemResponse.setItemName(item.getItemName());
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