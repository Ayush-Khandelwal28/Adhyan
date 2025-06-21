import React from 'react';
import { Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Breakpoint } from '@/hooks/useBreakpoint';

interface ControlPanelProps {
  isVisible: boolean;
  onToggle: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onToggleSummary?: () => void;
  showSummary?: boolean;
  breakpoint: Breakpoint;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isVisible,
  onToggle,
  onExpandAll,
  onCollapseAll,
  onToggleSummary,
  showSummary,
  breakpoint
}) => {
  const isMobile = breakpoint === 'sm';

  return (
    <>
      {/* Floating Settings Button */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          onClick={onToggle}
          size={isMobile ? "default" : "lg"}
          className="rounded-full shadow-lg"
          title="Toggle Controls"
        >
          <Settings className="w-4 h-4 md:w-5 md:h-5" />
        </Button>
      </div>

      {/* Control Panel */}
      {isVisible && (
        <Card className={cn(
          "absolute top-16 left-4 z-20 shadow-xl",
          isMobile ? "right-4" : "max-w-xs"
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm md:text-base">
                Mind Map Controls
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={cn(
              "grid gap-2",
              isMobile ? "grid-cols-2" : "grid-cols-1"
            )}>
              <Button
                onClick={onExpandAll}
                className="text-sm"
              >
                Expand All
              </Button>
              <Button
                onClick={onCollapseAll}
                variant="secondary"
                className="text-sm"
              >
                Collapse All
              </Button>
              {isMobile && onToggleSummary && (
                <Button
                  onClick={() => {
                    onToggleSummary();
                    onToggle();
                  }}
                  variant="outline"
                  className="col-span-2 text-sm"
                >
                  {showSummary ? 'Hide Summary' : 'Show Summary'}
                </Button>
              )}
            </div>

            <div>
              <h4 className="font-medium text-sm md:text-base mb-2">
                Legend
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded mr-2"></div>
                  <span>Main Topic</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-300 rounded mr-2"></div>
                  <span>Sections</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-50 to-green-100 border border-green-300 rounded mr-2"></div>
                  <span>Subsections</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t text-xs text-muted-foreground space-y-1">
              <p>➕ Click + button on nodes to expand sections</p>
              <p>📋 Click nodes {isMobile ? 'with dots' : 'with badges'} to view content</p>
              {!isMobile && <p>🔢 Badges show count of points/definitions/examples</p>}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};