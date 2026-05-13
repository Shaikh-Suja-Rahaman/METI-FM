import React, { useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from './ui/alert-dialog';
import { Settings, Key } from 'lucide-react';

type settingsModalProps = {
    open : boolean;
    onClose : () => void;
}


const settingsModal = ({open, onClose}) => {
    const [apiKey, setApiKey] = useState<string>('');
    const [freeMessagesUsed, setFreeMessagesUsed] = useState<number>(0);

    useEffect(()=>{
        if(localStorage.getItem('customnvidiakey')){
            setApiKey(localStorage.getItem('customnvidiakey'));
        }
        if(localStorage.getItem('freemessagess')){
            setFreeMessagesUsed(parseInt(localStorage.getItem('freemessagess')));
        }

    }, [open])
   
    const handleSave = () => {
        localStorage.setItem('customnvidiakey', apiKey);
        localStorage.setItem('freemessagess', freeMessagesUsed.toString());
        onClose();
    }
    
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent className="neo-border shadow-neo sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-2xl flex items-center gap-2">
            <Settings size={24} /> Settings
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-muted-foreground font-medium">
            Configure your API access to keep chatting.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center justify-between p-3 rounded-lg border-2 border-border bg-card neo-shadow-sm">
            <span className="font-bold text-sm uppercase tracking-wide">Free Messages Used</span>
            <span className={`font-bold ${freeMessagesUsed >= 10 ? 'text-destructive' : 'text-foreground'}`}>
              {freeMessagesUsed} / 10
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
              <Key size={16} /> Custom NVIDIA API Key
            </label>
            <input
              type="password"
              placeholder="nvapi-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 py-3 px-4 rounded-md border-2 border-border bg-background text-foreground font-medium focus:outline-none focus:ring-0 focus:border-border neo-shadow-sm placeholder:text-muted-foreground"
            />
            <span className="text-xs text-muted-foreground font-medium">
              If provided, this key will be used instead of the free tier. Stored locally in your browser.
            </span>
          </div>
        </div>
        <AlertDialogFooter className="mt-4 sm:justify-start gap-2">
          <button 
            onClick={onClose} 
            className="h-10 px-4 inline-flex items-center justify-center text-sm font-medium bg-background text-foreground rounded-md border-2 border-border neo-shadow-sm transition-all duration-200 ease-in-out flex-1 sm:flex-none"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="h-10 px-4 inline-flex items-center justify-center text-sm font-bold uppercase tracking-wider bg-foreground text-background rounded-md border-2 border-border neo-shadow-sm transition-all duration-200 ease-in-out flex-1 sm:flex-none"
          >
            Save Key
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default settingsModal