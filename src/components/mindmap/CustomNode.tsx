import React from 'react';
import { Handle, Position } from 'reactflow';
import { BookOpen, Hash, List, Link, FileText, Lightbulb, Plus, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { PointsDialog } from '@/components/mindmap/PointsDialog';
import { MindMapNodeData } from '@/lib/types';

interface CustomNodeProps {
  data: MindMapNodeData;
  id: string;
}

export const CustomNode: React.FC<CustomNodeProps> = ({ data, id }) => {
  const { isMobile } = useBreakpoint();

  const getNodeClasses = () => {
    const baseClasses = "px-3 py-2 md:px-4 md:py-3 rounded-lg border-2 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 relative min-w-32 md:min-w-40 lg:min-w-48";
    
    switch (data.type) {
      case 'root':
        return cn(baseClasses, "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-800 text-base md:text-lg font-bold min-w-48 md:min-w-64");
      case 'section':
        return cn(baseClasses, "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-300 dark:border-purple-600 text-purple-800 dark:text-purple-200 font-semibold text-sm md:text-base");
      case 'subsection':
        return cn(baseClasses, "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-300 dark:border-green-600 text-green-800 dark:text-green-200 min-w-28 md:min-w-40 text-sm md:text-base");
      case 'takeaway':
        return cn(baseClasses, "bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-300 dark:border-indigo-600 text-indigo-800 dark:text-indigo-200 min-w-28 md:min-w-40 text-sm md:text-base");
      default:
        return cn(baseClasses, "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-sm md:text-base");
    }
  };

  const getIcon = () => {
    const iconClasses = "w-4 h-4 md:w-5 md:h-5 mr-2";
    switch (data.type) {
      case 'root':
        return <BookOpen className={iconClasses} />;
      case 'section':
        return <Hash className="w-3 h-3 md:w-4 md:h-4 mr-2" />;
      case 'subsection':
        return <List className="w-3 h-3 md:w-4 md:h-4 mr-2" />;
      case 'takeaway':
        return <Link className="w-3 h-3 md:w-4 md:h-4 mr-2" />;
      default:
        return null;
    }
  };

  const hasPointsContent = (data.pointsCount || 0) + (data.definitionsCount || 0) + (data.examplesCount || 0) > 0;

  const handleNodeExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    const event = new CustomEvent('nodeExpand', {
      detail: { nodeKey: data.nodeKey, isExpanded: data.isExpanded }
    });
    window.dispatchEvent(event);
  };

  const renderNodeContent = () => {
    const nodeContent = (
      <div className={getNodeClasses()}>
        {/* Input handle - only show for non-root nodes */}
        {data.type !== 'root' && (
          <Handle
            type="target"
            position={Position.Top}
            id="input"
            className="w-2 h-2 bg-gray-600"
          />
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1 min-w-0">
            {getIcon()}
            <span className="font-medium truncate text-xs md:text-sm">
              {data.label}
            </span>
          </div>

          <div className="flex items-center ml-2 space-x-1 md:space-x-2">
            {/* Content badges - hidden on mobile, show dot instead */}
            {hasPointsContent && !isMobile && (
              <div className="flex space-x-1">
                {(data.pointsCount || 0) > 0 && (
                  <Badge variant="secondary" className="text-xs h-5">
                    <List className="w-3 h-3 mr-1" />
                    {data.pointsCount}
                  </Badge>
                )}
                {(data.definitionsCount || 0) > 0 && (
                  <Badge variant="destructive" className="text-xs h-5">
                    <FileText className="w-3 h-3 mr-1" />
                    {data.definitionsCount}
                  </Badge>
                )}
                {(data.examplesCount || 0) > 0 && (
                  <Badge className="text-xs h-5 bg-orange-500 hover:bg-orange-600">
                    <Lightbulb className="w-3 h-3 mr-1" />
                    {data.examplesCount}
                  </Badge>
                )}
              </div>
            )}

            {/* Mobile: Show dot indicator for content */}
            {hasPointsContent && isMobile && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}

            {/* Individual expand/collapse button */}
            {data.hasExpandableChildren && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleNodeExpand}
                className="h-6 w-6 p-0 bg-white/90 hover:bg-white border border-gray-200 rounded-full shadow-sm"
                title={data.isExpanded ? 'Collapse' : 'Expand'}
              >
                {data.isExpanded ? (
                  <Minus className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
                ) : (
                  <Plus className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Output handle - only show for nodes with children */}
        {data.hasExpandableChildren && (
          <Handle
            type="source"
            position={Position.Bottom}
            id="output"
            className="w-2 h-2 bg-gray-600"
          />
        )}
      </div>
    );

    // Wrap with dialog if there's content to show
    if (hasPointsContent) {
      return (
        <PointsDialog data={data.originalData} trigger={nodeContent} />
      );
    }

    return nodeContent;
  };

  return renderNodeContent();
};