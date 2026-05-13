import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from './ui/alert-dialog';
import { Zap } from 'lucide-react';

type FreeLimitModalProps = {
  open: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
};

const FreeLimitModal = ({ open, onClose, onOpenSettings }: FreeLimitModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent className="neo-border shadow-neo sm:max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-2xl flex items-center gap-2">
            <Zap size={24} /> Free Limit Reached
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-muted-foreground font-medium">
            You've used all <strong className="text-foreground">10 free messages</strong>. Add your own free NVIDIA API key to keep chatting, it only takes 2 minutes.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="border-2 border-border rounded-lg bg-card p-3 text-sm font-medium text-muted-foreground">
          <ol className="list-decimal list-inside flex flex-col gap-1.5">
            <li>Go to <strong className="text-foreground">build.nvidia.com</strong></li>
            <li>Sign up for free and copy your API key</li>
            <li>Click <strong className="text-foreground">Add My Key</strong> below and paste it in</li>
          </ol>
        </div>

        <AlertDialogFooter className="mt-2 sm:justify-start gap-2">
          <button
            onClick={onClose}
            className="h-10 px-4 inline-flex items-center justify-center text-sm font-medium bg-background text-foreground rounded-md border-2 border-border neo-shadow-sm transition-all flex-1 sm:flex-none"
          >
            Maybe Later
          </button>
          <button
            onClick={() => { onClose(); onOpenSettings(); }}
            className="h-10 px-4 inline-flex items-center justify-center text-sm font-bold uppercase tracking-wider bg-foreground text-background rounded-md border-2 border-border neo-shadow-sm transition-all flex-1 sm:flex-none"
          >
            Add My Key
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FreeLimitModal;
