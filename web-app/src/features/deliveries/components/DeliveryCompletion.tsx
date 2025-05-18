import { useEffect, useState, useRef, useCallback } from "react";
import { useDelivery } from "../context/delivery-context";
import { toast } from "sonner";
import { PhotoVerification } from "@/features/deliveries/components/PhotoVerification";
import { RealTimeMap } from "./RealTimeMap";
import { api } from "@/config/axios";
import { IDeliveryResponse } from "@/services/types/delivery.type";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IconCamera, IconCheck, IconMapPin, IconX } from "@tabler/icons-react";

export const DeliveryCompletion = ({ deliveryId }: { deliveryId: number }) => {
    const { currentLocation } = useDelivery();

    const [delivery, setDelivery] = useState<IDeliveryResponse | null>(null);
    const [notes, setNotes] = useState("");
    const [proofImage, setProofImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [verifyOpen, setVerifyOpen] = useState(false);
    const [completionStatus, setCompletionStatus] = useState<"completed" | "failed" | null>(null);

    useEffect(() => {
        const fetchDeliveryData = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(`/api/delivery/delivery/${deliveryId}`);
                setDelivery(response.data.result);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch delivery details", err);
                setError("Could not load delivery information");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeliveryData();
    }, [deliveryId]);

    const handleImageCapture = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setProofImage(event.target.result as string);
                    setVerifyOpen(true);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const submitDeliveryCompletion = useCallback(async (isCompleted: boolean) => {
        if (isCompleted && !proofImage) {
            toast.error("Please provide delivery proof photo");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await api.post(
                `/api/delivery/delivery/complete`,
                {
                    completed: isCompleted,
                    notes: notes || '',
                    proofImage: isCompleted ? (proofImage ?? undefined) : undefined,
                },
                { params: { deliveryId } }
            );

            setCompletionStatus(isCompleted ? "completed" : "failed");

            toast.success(
                isCompleted
                    ? "Delivery completed successfully!"
                    : "Delivery marked as failed"
            );
        } catch (error) {
            console.error("Completion error:", error);
            toast.error("Failed to update delivery status");
        } finally {
            setIsSubmitting(false);
        }
    }, [deliveryId, notes, proofImage]);

    if (isLoading) {
        return (
            <Card className="mt-6">
                <CardHeader>
                    <h3 className="text-lg font-semibold">Delivery Completion</h3>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-gray-500">
                        Loading delivery information...
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error || !delivery) {
        return (
            <Card className="mt-6">
                <CardHeader>
                    <h3 className="text-lg font-semibold">Delivery Completion</h3>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-red-500">
                        {error || "Delivery information not available"}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (completionStatus) {
        return (
            <Card className="mt-6">
                <CardHeader>
                    <h3 className="text-lg font-semibold">
                        {completionStatus === "completed"
                            ? "Delivery Completed"
                            : "Delivery Failed"}
                    </h3>
                </CardHeader>
                <CardContent>
                    <div className={`text-center py-8 ${
                        completionStatus === "completed"
                            ? "text-green-600"
                            : "text-orange-600"
                    }`}>
                        {completionStatus === "completed"
                            ? "Delivery has been successfully completed!"
                            : "Delivery has been marked as failed."}
                        {notes && (
                            <div className="mt-4 text-sm text-gray-600">
                                <p>Notes:</p>
                                <p className="italic">{notes}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mt-6">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Delivery Completion</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowMap(!showMap)}
                        className="z-10"
                    >
                        <IconMapPin className="mr-2 h-4 w-4" />
                        {showMap ? 'Hide Map' : 'Show Map'}
                    </Button>
                </div>
            </CardHeader>

            {showMap && currentLocation && (
                <div className="h-[400px] w-full relative mb-4 rounded-lg overflow-hidden border">
                    <RealTimeMap
                        driverLocation={currentLocation}
                        orders={[]}
                        activeDelivery={delivery}
                    />
                </div>
            )}

            <CardContent>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            {delivery.status === "FAILED"
                                ? "Reason for failure"
                                : "Delivery Notes"}
                        </label>
                        <textarea
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            placeholder={
                                delivery.status === "FAILED"
                                    ? "Explain why delivery couldn't be completed..."
                                    : "Enter any delivery notes..."
                            }
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    {delivery.status !== "FAILED" && (
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Delivery Proof Photo
                            </label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                capture="environment"
                                className="hidden"
                            />
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={handleImageCapture}
                                >
                                    {proofImage ? (
                                        <img
                                            src={proofImage}
                                            alt="Delivery proof"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <IconCamera className="h-8 w-8 text-muted-foreground" />
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {proofImage
                                        ? "Photo captured"
                                        : "Take a photo of delivered items"}
                                </p>
                            </div>
                        </div>
                    )}

                    <PhotoVerification
                        image={proofImage || ''}
                        open={verifyOpen}
                        onOpenChange={setVerifyOpen}
                        onConfirm={() => setVerifyOpen(false)}
                        onRetake={() => {
                            setProofImage(null);
                            setVerifyOpen(false);
                            fileInputRef.current?.click();
                        }}
                    />

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => submitDeliveryCompletion(false)}
                            disabled={isSubmitting}
                            className="bg-red-50 hover:bg-red-100 text-red-600"
                        >
                            <IconX className="mr-2 h-4 w-4" />
                            {delivery.status === "FAILED" ? "Confirm Failed" : "Cannot Complete"}
                        </Button>
                        {delivery.status !== "FAILED" && (
                            <Button
                                onClick={() => submitDeliveryCompletion(true)}
                                disabled={isSubmitting || !proofImage}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <IconCheck className="mr-2 h-4 w-4" />
                                {isSubmitting ? "Completing..." : "Complete Delivery"}
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};