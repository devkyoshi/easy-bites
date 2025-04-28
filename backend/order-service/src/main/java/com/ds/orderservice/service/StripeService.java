package com.ds.orderservice.service;

import com.ds.commons.exception.CustomException;
import com.ds.commons.exception.ExceptionCode;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StripeService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    /**
     * Creates a Stripe checkout session for the given order
     * @param orderId The ID of the order
     * @param amount The amount to charge in dollars
     * @param description The description of the order
     * @param successUrl The URL to redirect to on successful payment
     * @param cancelUrl The URL to redirect to on cancelled payment
     * @return The Stripe checkout session URL
     * @throws CustomException if there's an error creating the session
     */
    public String createCheckoutSession(
            Long orderId,
            Double amount,
            String description,
            String successUrl,
            String cancelUrl
    ) throws CustomException {
        try {
            // Convert amount to cents (Stripe uses cents)
            long amountInCents = Math.round(amount * 100);

            // Create the checkout session parameters
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(successUrl)
                    .setCancelUrl(cancelUrl)
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("usd")
                                                    .setUnitAmount(amountInCents)
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName("Order #" + orderId)
                                                                    .setDescription(description)
                                                                    .build()
                                                    )
                                                    .build()
                                    )
                                    .setQuantity(1L)
                                    .build()
                    )
                    .setClientReferenceId(orderId.toString())
                    .build();

            // Create the checkout session
            Session session = Session.create(params);

            // Return the checkout URL
            return session.getUrl();
        } catch (StripeException e) {
            throw new CustomException(ExceptionCode.INTERNAL_SERVER_ERROR);
        }
    }
}
