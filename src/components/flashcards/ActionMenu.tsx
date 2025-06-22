import React from 'react';
import { Button } from '@/components/ui/button';
import { Shuffle, RotateCcw, Home } from 'lucide-react';

interface ActionMenuProps {
  onShuffle: () => void;
  onRestart: () => void;
  onReturnToPack: () => void;
  disabled?: boolean;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  onShuffle,
  onRestart,
  onReturnToPack,
  disabled = false
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-6">
      <Button
        onClick={onShuffle}
        variant="outline"
        size="sm"
        disabled={disabled}
        className="flex items-center space-x-2"
      >
        <Shuffle className="w-4 h-4" />
        <span>Shuffle Cards</span>
      </Button>
      
      <Button
        onClick={onRestart}
        variant="outline"
        size="sm"
        disabled={disabled}
        className="flex items-center space-x-2"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Restart Session</span>
      </Button>
      
      <Button
        onClick={onReturnToPack}
        variant="outline"
        size="sm"
        className="flex items-center space-x-2"
      >
        <Home className="w-4 h-4" />
        <span>Return to Pack</span>
      </Button>
    </div>
  );
};