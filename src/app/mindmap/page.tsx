'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CustomNode } from '@/components/mindmap/CustomNode';
import { SummarySection } from '@/components/mindmap/SummarySection';
import { ControlPanel } from '@/components/mindmap/ControlPanel';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { transformToMindMap } from '@/lib/transformToMindmap';
import { StudyNotesStructure } from '@/lib/types';
import ml from '@/lib/mockdata/ml2.json';

const sampleStudyNotes: StudyNotesStructure = (ml as { data: { success: boolean, data: StudyNotesStructure } }).data.data;

const nodeTypes = {
  custom: CustomNode,
};

const InteractiveMindMap: React.FC<{ studyNotes?: StudyNotesStructure }> = ({
  studyNotes = sampleStudyNotes
}) => {
  const { breakpoint, isMobile } = useBreakpoint();
  
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [showPanel, setShowPanel] = useState(false);
  const [showSummary, setShowSummary] = useState(!isMobile);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => transformToMindMap(studyNotes, expandedNodes, breakpoint),
    [studyNotes, expandedNodes, breakpoint]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Handle individual node expansion
  useEffect(() => {
    const handleNodeExpand = (event: CustomEvent) => {
      const { nodeKey, isExpanded } = event.detail;
      setExpandedNodes(prev => {
        const newSet = new Set(prev);
        if (isExpanded) {
          newSet.delete(nodeKey);
        } else {
          newSet.add(nodeKey);
        }
        return newSet;
      });
    };

    window.addEventListener('nodeExpand', handleNodeExpand as EventListener);
    return () => {
      window.removeEventListener('nodeExpand', handleNodeExpand as EventListener);
    };
  }, []);

  const expandAll = useCallback(() => {
    const allExpandableNodes = new Set<string>();
    studyNotes.sections.forEach(section => {
      if (section.subsections && section.subsections.length > 0) {
        allExpandableNodes.add(`section-${section.heading}`);
      }
    });
    setExpandedNodes(allExpandableNodes);
  }, [studyNotes]);

  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set());
  }, []);

  // Update nodes and edges when expandedNodes or breakpoint changes
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = transformToMindMap(studyNotes, expandedNodes, breakpoint);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [expandedNodes, studyNotes, breakpoint, setNodes, setEdges]);

  // Hide summary on mobile when panel is open to avoid overlap
  useEffect(() => {
    if (isMobile && showPanel) {
      setShowSummary(false);
    }
  }, [showPanel, isMobile]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{
          padding: isMobile ? 0.1 : 0.2,
          maxZoom: isMobile ? 1 : 1.5
        }}
        minZoom={0.1}
        maxZoom={isMobile ? 1.5 : 2}
        defaultEdgeOptions={{
          animated: false,
          style: { strokeWidth: 2 },
        }}
        nodesDraggable={true} // Enable node dragging
        nodesConnectable={false} // Disable connecting nodes
        elementsSelectable={true} // Enable selecting nodes
      >
        <Background 
          color="#e5e7eb" 
          gap={20} 
          className="dark:opacity-20"
        />
        <Controls
          position={isMobile ? "bottom-left" : "bottom-right"}
          showZoom={!isMobile}
          showFitView={true}
          showInteractive={!isMobile}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
        />

        {/* Control Panel */}
        <ControlPanel
          isVisible={showPanel}
          onToggle={() => setShowPanel(!showPanel)}
          onExpandAll={expandAll}
          onCollapseAll={collapseAll}
          onToggleSummary={() => setShowSummary(!showSummary)}
          showSummary={showSummary}
          breakpoint={breakpoint}
        />

        {/* Summary and Key Takeaways Section */}
        <SummarySection
          studyNotes={studyNotes}
          isVisible={showSummary}
          onToggle={() => setShowSummary(!showSummary)}
          breakpoint={breakpoint}
        />
      </ReactFlow>
    </div>
  );
};

export default InteractiveMindMap;