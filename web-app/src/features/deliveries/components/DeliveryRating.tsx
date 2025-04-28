import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { submitDeliveryRating } from "@/services/delivery-service.ts";

interface DeliveryRatingProps {
    deliveryId: number;
    onRatingSubmitted?: () => void;
}

export const DeliveryRating = ({ deliveryId, onRatingSubmitted }: DeliveryRatingProps) => {
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating < 1 || rating > 5) return;

        setIsSubmitting(true);
        try {
            await submitDeliveryRating(deliveryId, { rating, comment });
            onRatingSubmitted?.();
        } catch (error) {
            console.error("Failed to submit rating", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="p-6 mt-6">
            <h3 className="text-xl font-bold mb-4">Rate Your Delivery Experience</h3>
            <div className="space-y-4">
                <div>
                    <p className="mb-2">Rating</p>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`text-3xl ${star <= rating ? 'text-amber-400' : 'text-gray-300'}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label htmlFor="comment" className="block mb-2">
                        Comments (Optional)
                    </label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows={3}
                    />
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={rating < 1 || isSubmitting}
                >
                    {isSubmitting ? "Submitting..." : "Submit Rating"}
                </Button>
            </div>
        </Card>
    );
};