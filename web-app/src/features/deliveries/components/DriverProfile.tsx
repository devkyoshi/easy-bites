import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchDriverProfile, updateDriverProfile } from "@/services/delivery-service";

interface DriverProfileData {
    vehicleType: string;
    vehicleNumber: string;
    licenseNumber: string;
}

export function DriverProfile({ driverId }: { driverId: number }) {
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<DriverProfileData>({
        vehicleType: "",
        vehicleNumber: "",
        licenseNumber: ""
    });

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await fetchDriverProfile(driverId);
            // Adjust this to match your actual API response structure
            if (response) {
                const profileData = response;
                setProfile({
                    vehicleType: profileData.vehicleType || "",
                    vehicleNumber: profileData.vehicleNumber || "",
                    licenseNumber: profileData.licenseNumber || ""
                });
                setError(null);
            } else {
                throw new Error("Invalid profile data format");
            }
        } catch (err) {
            setError("Failed to load driver profile");
            console.error("Fetch profile error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            await updateDriverProfile(driverId, {
                vehicleType: profile.vehicleType,
                vehicleNumber: profile.vehicleNumber,
                licenseNumber: profile.licenseNumber
            });
            setEditMode(false);
            setError(null);
            // Refresh the profile after update
            await fetchProfile();
        } catch (err) {
            setError("Failed to update profile");
            console.error("Update profile error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [driverId]);

    if (loading && !editMode) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 flex items-center">
                {error}
                <Button
                    variant="outline"
                    onClick={fetchProfile}
                    className="ml-4"
                    size="sm"
                >
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="border rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Driver Profile</h3>
                {editMode ? (
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setEditMode(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        onClick={() => setEditMode(true)}
                    >
                        Edit
                    </Button>
                )}
            </div>

            {editMode ? (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                        <Select
                            value={profile.vehicleType}
                            onValueChange={(value) => setProfile({...profile, vehicleType: value})}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select vehicle type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BIKE">Bike</SelectItem>
                                <SelectItem value="CAR">Car</SelectItem>
                                <SelectItem value="VAN">VAN</SelectItem>
                                <SelectItem value="THREE_WHEELER">THREE WHEELER</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Vehicle Number</label>
                        <Input
                            value={profile.vehicleNumber}
                            onChange={(e) => setProfile({...profile, vehicleNumber: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">License Number</label>
                        <Input
                            value={profile.licenseNumber}
                            onChange={(e) => setProfile({...profile, licenseNumber: e.target.value})}
                        />
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <div>
                        <span className="text-sm text-gray-500">Vehicle Type:</span>
                        <p className="font-medium">{profile.vehicleType || "Not specified"}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-500">Vehicle Number:</span>
                        <p className="font-medium">{profile.vehicleNumber || "Not specified"}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-500">License Number:</span>
                        <p className="font-medium">{profile.licenseNumber || "Not specified"}</p>
                    </div>
                </div>
            )}
        </div>
    );
}