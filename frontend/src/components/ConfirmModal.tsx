
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type ConfirmModalProps = {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  open: boolean
}

const ConfirmModal = ({
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
  open
}: ConfirmModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent className="neo-border shadow-neo">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-2xl flex items-center gap-2">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-muted-foreground font-medium">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 sm:justify-start gap-2">
          <button 
            onClick={onCancel} 
            className="h-10 px-4 inline-flex items-center justify-center text-sm font-medium bg-background text-foreground rounded-md border-2 border-border neo-shadow-sm transition-all duration-200 ease-in-out flex-1 sm:flex-none"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="h-10 px-4 inline-flex items-center justify-center text-sm font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md border-2 border-border neo-shadow-sm transition-all duration-200 ease-in-out flex-1 sm:flex-none"
          >
            {confirmLabel}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmModal
