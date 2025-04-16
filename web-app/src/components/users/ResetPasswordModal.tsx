
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  userName: string;
  userEmail: string;
}

export function ResetPasswordModal({
  isOpen,
  onClose,
  onReset,
  userName,
  userEmail,
}: ResetPasswordModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>
            Send a password reset link to {userName}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm">
            A password reset link will be sent to:
          </p>
          <p className="font-medium mt-1">{userEmail}</p>
          <p className="text-sm text-muted-foreground mt-4">
            The link will expire after 24 hours.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onReset}>
            Send Reset Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
