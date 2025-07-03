import React from 'react';
import { Handle, Position } from 'reactflow';
import { BookOpen, FileText, Lightbulb, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MindMapNodeData } from '@/lib/types';

interface CustomNodeProps {
  data: MindMapNodeData;
  id: string;
}

export const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {

  const getNodeClasses = () => {
    const baseClasses = "px-3 py-2 md:px-4 md:py-3 rounded-lg border-2 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 relative min-w-32 md:min-w-40 lg:min-w-48";

    switch (data.type) {
      case 'central':
        return cn(baseClasses, "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-800 text-lg md:text-xl font-bold min-w-56 md:min-w-72 rounded-full");
      case 'branch':
        return cn(baseClasses, "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-300 dark:border-purple-600 text-purple-800 dark:text-purple-200 font-semibold text-sm md:text-base");
      case 'main_node':
        return cn(baseClasses, getMainNodeStyle());
      case 'child_node':
        return cn(baseClasses, getChildNodeStyle());
      default:
        return cn(baseClasses, "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-sm md:text-base");
    }
  };

  const getMainNodeStyle = () => {
    const emphasisStyle = getEmphasisStyle();
    const typeStyle = getNodeTypeStyle();
    return cn(emphasisStyle, typeStyle, "min-w-28 md:min-w-40 text-sm md:text-base");
  };

  const getChildNodeStyle = () => {
    const typeStyle = getNodeTypeStyle();
    const emphasisStyle = getEmphasisStyle();
    return cn(typeStyle, emphasisStyle, "min-w-24 md:min-w-32 text-xs md:text-sm opacity-90");
  };

  const getEmphasisStyle = () => {
    switch (data.emphasisLevel) {
      case 'high':
        return "ring-2 ring-yellow-400 ring-opacity-60 shadow-lg";
      case 'medium':
        return "ring-1 ring-blue-300 ring-opacity-40";
      case 'low':
        return "opacity-75";
      default:
        return "";
    }
  };

  const getNodeTypeStyle = () => {
    switch (data.nodeType) {
      case 'concept':
        return "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-300 dark:border-blue-600 text-blue-800 dark:text-blue-200";
      case 'detail':
        return "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-300 dark:border-red-600 text-red-800 dark:text-red-200";
      case 'example':
        return "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-300 dark:border-green-600 text-green-800 dark:text-green-200";
      default:
        return "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600";
    }
  };

  const getIcon = () => {
    const iconClasses = data.type === 'central' ? "w-5 h-5 md:w-6 md:h-6 mr-2" : "w-3 h-3 md:w-4 md:h-4 mr-2";

    if (data.type === 'central') {
      return <BookOpen className={iconClasses} />;
    }

    switch (data.nodeType) {
      case 'concept':
        return <BookOpen className={iconClasses} />;
      case 'detail':
        return <FileText className={iconClasses} />;
      case 'example':
        return <Lightbulb className={iconClasses} />;
      default:
        return null;
    }
  };

  // Calculate handle positions based on node's radial position
  const getHandlePositions = () => {
    // Get the angle from the node's position data if available
    const angle = data.angle || 0;

    // For input handle (connection from parent)
    let inputPosition = Position.Top;
    let outputPosition = Position.Bottom;

    // Convert angle to degrees for easier calculation
    const degrees = (angle * 180) / Math.PI;
    const normalizedDegrees = ((degrees % 360) + 360) % 360;

    // The angle represents the direction TO the parent, so input handle should be on that side
    if (normalizedDegrees >= 315 || normalizedDegrees < 45) {
      inputPosition = Position.Right; // Parent is to the right
    } else if (normalizedDegrees >= 45 && normalizedDegrees < 135) {
      inputPosition = Position.Bottom; // Parent is below
    } else if (normalizedDegrees >= 135 && normalizedDegrees < 225) {
      inputPosition = Position.Left; // Parent is to the left
    } else {
      inputPosition = Position.Top; // Parent is above
    }

    // Output handle should be opposite to input for better flow
    switch (inputPosition) {
      case Position.Left:
        outputPosition = Position.Right;
        break;
      case Position.Right:
        outputPosition = Position.Left;
        break;
      case Position.Top:
        outputPosition = Position.Bottom;
        break;
      case Position.Bottom:
        outputPosition = Position.Top;
        break;
    }

    return { inputPosition, outputPosition };
  };

  // For central node, create multiple output handles based on children positions
  const renderCentralOutputHandles = () => {
    if (data.type !== 'central' || !data.childrenAngles) return null;

    return data.childrenAngles.map((childAngle: number, index: number) => {
      const degrees = (childAngle * 180) / Math.PI;
      const normalizedDegrees = ((degrees % 360) + 360) % 360;

      let position = Position.Right;
      let style = {};

      if (normalizedDegrees >= 315 || normalizedDegrees < 45) {
        position = Position.Right;
        style = { top: '50%', right: '-4px' };
      } else if (normalizedDegrees >= 45 && normalizedDegrees < 135) {
        position = Position.Bottom;
        style = { bottom: '-4px', left: '50%' };
      } else if (normalizedDegrees >= 135 && normalizedDegrees < 225) {
        position = Position.Left;
        style = { top: '50%', left: '-4px' };
      } else {
        position = Position.Top;
        style = { top: '-4px', left: '50%' };
      }

      return (
        <Handle
          key={`output-${index}`}
          type="source"
          position={position}
          id={`output-${index}`}
          className="w-2 h-2 bg-gray-600"
          style={style}
        />
      );
    });
  };

  const handleNodeExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    const event = new CustomEvent('nodeExpand', {
      detail: { nodeKey: data.nodeKey, isExpanded: data.isExpanded }
    });
    window.dispatchEvent(event);
  };

  const { inputPosition, outputPosition } = getHandlePositions();

  return (
    <div className={getNodeClasses()}>
      {/* Input handle - only show for non-central nodes */}
      {data.type !== 'central' && (
        <Handle
          type="target"
          position={inputPosition}
          id="input"
          className="w-2 h-2 bg-gray-600"
        />
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 min-w-0">
          {getIcon()}
          <span className={cn(
            "font-medium truncate",
            data.type === 'central' ? "text-sm md:text-base" : "text-xs md:text-sm"
          )}>
            {data.label}
          </span>
        </div>

        <div className="flex items-center ml-2 space-x-1 md:space-x-2">
          {/* Individual expand/collapse button */}
          {data.hasExpandableChildren && data.type !== 'central' && (
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

      {/* Output handle - show multiple handles for central node, single for others */}
      {data.type === 'central' ? (
        renderCentralOutputHandles()
      ) : (
        data.hasExpandableChildren && (
          <Handle
            type="source"
            position={outputPosition}
            id="output"
            className="w-2 h-2 bg-gray-600"
          />
        )
      )}
    </div>
  );
};