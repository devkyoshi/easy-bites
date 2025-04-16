
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddVehicleForm } from "./AddVehicleForm";

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddVehicleModal({ isOpen, onClose }: AddVehicleModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sethsri-gray">Add New Vehicle</DialogTitle>
        </DialogHeader>
        <AddVehicleForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
