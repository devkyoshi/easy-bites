import { RealTimeMap } from "./RealTimeMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IconCamera, IconCheck, IconMapPin, IconX } from "@tabler/icons-react";
import { useState, useRef } from "react";
import { useDelivery } from "../context/delivery-context";
import { toast } from "sonner";
import { PhotoVerification } from "@/features/deliveries/components/PhotoVerification";

export const DeliveryCompletion = ({ deliveryId }: { deliveryId: number }) => {
    const {
        activeDelivery,
        currentLocation,
        completeDelivery
    } = useDelivery();
    const [notes, setNotes] = useState("");
    const [proofImage, setProofImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [verifyOpen, setVerifyOpen] = useState(false);

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

    const handleSubmit = async (isCompleted: boolean) => {
        if (isCompleted && !proofImage) {
            toast.error("Please provide delivery proof photo");
            return;
        }

        setIsSubmitting(true);
        try {
            await completeDelivery(deliveryId, {
                isCompleted,
                notes,
                proofImage: isCompleted ? (proofImage ?? undefined) : undefined,
            });
            toast.success(
                isCompleted
                    ? "Delivery completed successfully!"
                    : "Delivery status updated"
            );
        } catch (error) {
            toast.error("Failed to update delivery status");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!activeDelivery || !currentLocation) {
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

    return (
        <Card className="mt-6">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Delivery Completion</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowMap(!showMap)}
                    >
                        <IconMapPin className="mr-2 h-4 w-4" />
                        {showMap ? 'Hide Map' : 'Show Map'}
                    </Button>
                </div>
            </CardHeader>

            {showMap && (
                <div className="h-64 w-full">
                    <RealTimeMap
                        driverLocation={currentLocation}
                        orders={[]}
                        activeDelivery={activeDelivery}
                    />
                </div>
            )}

            <CardContent>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Delivery Notes</label>
                        <textarea
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            placeholder="Enter any delivery notes..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

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
                            onClick={() => handleSubmit(false)}
                            disabled={isSubmitting}
                            className="bg-red-50 hover:bg-red-100 text-red-600"
                        >
                            <IconX className="mr-2 h-4 w-4" />
                            Cannot Complete
                        </Button>
                        <Button
                            onClick={() => handleSubmit(true)}
                            disabled={isSubmitting || !proofImage}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <IconCheck className="mr-2 h-4 w-4" />
                            {isSubmitting ? "Completing..." : "Complete Delivery"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};