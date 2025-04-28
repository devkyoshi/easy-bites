import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const PhotoVerification = ({
                                      image,
                                      onConfirm,
                                      onRetake,
                                      open,
                                      onOpenChange
                                  }: {
    image: string;
    onConfirm: () => void;
    onRetake: () => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>Verify Your Photo</DialogHeader>
                <div className="space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                        <img
                            src={image}
                            alt="Verification preview"
                            className="w-full h-64 object-contain"
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={onRetake}>
                            Retake Photo
                        </Button>
                        <Button onClick={onConfirm}>
                            Confirm Photo
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};