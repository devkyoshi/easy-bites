
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddDriverForm } from "./AddDriverForm";

interface AddDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDriverAdded?: (driver: any) => void;
}

export function AddDriverModal({ isOpen, onClose, onDriverAdded }: AddDriverModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Driver</DialogTitle>
        </DialogHeader>
        <AddDriverForm onClose={onClose} onDriverAdded={onDriverAdded} />
      </DialogContent>
    </Dialog>
  );
}
