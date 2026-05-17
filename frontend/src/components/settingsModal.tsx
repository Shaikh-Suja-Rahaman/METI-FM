import React, { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from './ui/alert-dialog';
import { Settings, Key, Radio } from 'lucide-react';

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
};

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [freeMessagesUsed, setFreeMessagesUsed] = useState<number>(0);

  useEffect(() => {
    if (open) {
      const key = localStorage.getItem('customnvidiakey');
      if (key) setApiKey(key);
      const used = parseInt(localStorage.getItem('freemessagess') || '0', 10);
      setFreeMessagesUsed(used);
    }
  }, [open]);

  const handleSave = () => {
    localStorage.setItem('customnvidiakey', apiKey);
    onClose();
  };


  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent className="border-2 border-border sm:max-w-md" style={{ borderRadius: '4px', boxShadow: '5px 5px 0 #0f0f0f' }}>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-xl flex items-center gap-2 uppercase tracking-wider">
            <Radio size={20} />
            METI FM — Settings
          </AlertDialogTitle>
          <AlertDialogDescription className="font-mono text-xs text-muted-foreground">
            Configure transmission access. Free tier: 10 messages using the default signal relay.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4 py-3">
          {/* Free tier status */}
          <div className="flex items-center justify-between p-3 border-2 border-border bg-card" style={{ borderRadius: '2px' }}>
            <span className="font-mono text-xs uppercase tracking-wider">Free transmissions used</span>
            <div className="flex items-center gap-2">
              <span className={`font-bold font-mono text-sm ${freeMessagesUsed >= 10 ? 'text-red-500' : 'text-foreground'}`}>
                {freeMessagesUsed} / 10
              </span>
            </div>
          </div>

          {/* API key input */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase tracking-wider flex items-center gap-2">
              <Key size={12} />
              Custom NVIDIA API Key
            </label>
            <input
              type="password"
              placeholder="nvapi-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="py-2.5 px-3 border-2 border-border bg-background text-foreground font-mono text-sm focus:outline-none placeholder:text-muted-foreground"
              style={{ borderRadius: '2px' }}
            />
            <span className="text-[10px] font-mono text-muted-foreground leading-relaxed">
              Your key bypasses the free tier and is stored only in your browser. Get a free key at{' '}
              <span className="text-foreground">build.nvidia.com</span>
            </span>
          </div>
        </div>

        <AlertDialogFooter className="mt-2 sm:justify-start gap-2">
          <button
            onClick={onClose}
            className="h-9 px-4 inline-flex items-center justify-center font-mono text-xs font-medium bg-background text-foreground border-2 border-border transition-all flex-1 sm:flex-none neo-shadow-sm"
            style={{ borderRadius: '2px' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="h-9 px-4 inline-flex items-center justify-center font-mono text-xs font-bold uppercase tracking-wider bg-foreground text-background border-2 border-border transition-all flex-1 sm:flex-none neo-shadow-sm"
            style={{ borderRadius: '2px' }}
          >
            Save Key
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SettingsModal;