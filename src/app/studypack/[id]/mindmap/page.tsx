'use client';

import React, { useState, use, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { CustomNode } from '@/components/mindmap/CustomNode';
import { transformToMindMap } from '@/lib/transformToMindmap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';

import { MindMapStructure } from '@/lib/types';

const nodeTypes = {
  custom: CustomNode,
};

export default function Mindmap({ params }: { params: Promise<{ id: string }> }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [propMindMapData, setPropMindMapData] = useState<MindMapStructure | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { id } = use(params);

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

  const generateMindMap = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/mindmap/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log('MindMap Data:', data);
        // After generation, fetch the mindmap
        await getMindMapData(id);
      } else {
        setError('Failed to generate mindmap');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while generating the mindmap');
    } finally {
      setIsLoading(false);
    }
  }

  const getMindMapData = async (id: string) => {
    try {
      const response = await fetch(`/api/mindmap?studyPackId=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      if (response.status === 404) {
        setError(data.error);
        return;
      }
      console.log('MindMap Data:', data);
      setPropMindMapData(data.data);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while fetching the mindmap');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getMindMapData(id);
  }, [id]);


  useEffect(() => {
    if (propMindMapData) {
      const { nodes: newNodes, edges: newEdges } = transformToMindMap(propMindMapData, expandedNodes);
      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [expandedNodes, propMindMapData, setNodes, setEdges]);


  if (error === 'Mindmap not found for this study pack') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              Generate Mind Map
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              No mind map found for this study pack. Generate one to visualize the content.
            </p>
            <Button
              onClick={() => generateMindMap(id)}
              className="w-full cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Mind Map'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="w-96 animate-pulse">
          <CardContent className="p-8">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button
              onClick={() => getMindMapData(id)}
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          padding: 0.2,
          maxZoom: 1.5
        }}
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          animated: false,
          style: { strokeWidth: 2 },
        }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        proOptions={{ hideAttribution: true }}
        elevateEdgesOnSelect={true}
        elevateNodesOnSelect={true}
      >
        <Background
          color="#e5e7eb"
          gap={20}
          className="dark:opacity-20"
        />
        <Controls
          position={"bottom-right"}
          showZoom={true}
          showFitView={true}
          showInteractive={true}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
        />
      </ReactFlow>
    </div>
  );
};