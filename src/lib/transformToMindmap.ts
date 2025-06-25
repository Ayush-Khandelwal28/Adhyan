import { MarkerType } from 'reactflow';
import { MindMapStructure, MindMapBranch, MindMapNode, ReactFlowNode, ReactFlowEdge, MindMapNodeData } from '@/lib/types';

export const transformToMindMap = (
  mindMapData: MindMapStructure,
  expandedNodes: Set<string>
): { nodes: ReactFlowNode[]; edges: ReactFlowEdge[] } => {
  const nodes: ReactFlowNode[] = [];
  const edges: ReactFlowEdge[] = [];
  let nodeIdCounter = 0;

  // Define layout constants for different levels of nodes
  const layout = {
    BRANCH_RADIUS: 250,
    MAIN_NODE_RADIUS: 400,
    CHILD_NODE_RADIUS: 550,
    GRANDCHILD_NODE_RADIUS: 700,

    NODE_ARC_SPAN: Math.PI / 3,
    CHILD_ARC_SPAN: Math.PI / 5,
    GRANDCHILD_ARC_SPAN: Math.PI / 7,

    CENTER_OFFSET: 140,
  };

  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 512;
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;

  const getNodeTypeColor = (nodeType: 'concept' | 'detail' | 'example'): string => {
    switch (nodeType) {
      case 'concept':
        return '#3b82f6'; // Blue
      case 'detail':
        return '#ef4444'; // Red
      case 'example':
        return '#10b981'; // Green
      default:
        return '#6b7280'; // Gray (fallback)
    }
  };

  const createNode = (
    label: string,
    content: string,
    type: 'central' | 'branch' | 'main_node' | 'child_node' | 'grandchild_node',
    nodeType: 'concept' | 'detail' | 'example',
    x: number,
    y: number,
    nodeKey: string,
    parentId?: string,
    originalData?: MindMapNode | MindMapBranch,
    emphasisLevel?: 'high' | 'medium' | 'low',
    hasExpandableChildren = false,
    angle?: number,
    childrenAngles?: number[]
  ): string => {
    const id = `node-${nodeIdCounter++}`;
    const isExpanded = expandedNodes.has(nodeKey);

    nodes.push({
      id,
      type: 'custom',
      position: { x, y },
      draggable: true,
      data: {
        label,
        content,
        type,
        nodeType,
        emphasisLevel,
        isExpanded,
        childrenIds: [],
        parentId,
        originalData,
        nodeKey,
        hasExpandableChildren,
        angle,
        childrenAngles,
      } as MindMapNodeData,
    });
    return id;
  };

  const updateNodeChildren = (nodeId: string, childId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      node.data.childrenIds.push(childId);
    }
  };

  const createEdge = (sourceId: string, targetId: string, color: string, isDashed = false, sourceHandle?: string) => {
    edges.push({
      id: `edge-${sourceId}-${targetId}`,
      source: sourceId,
      sourceHandle: sourceHandle || 'output',
      target: targetId,
      targetHandle: 'input',
      type: 'straight',
      animated: isDashed,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 15,
        height: 15,
        color,
      },
      style: {
        strokeWidth: 2,
        stroke: color,
        strokeDasharray: isDashed ? '5,5' : undefined,
      },
    });
  };

  const renderNodesRecursive = (
    parentKey: string,
    parentId: string,
    children: MindMapNode[],
    parentAngle: number,
    parentX: number,
    parentY: number,
    currentRadius: number,
    arcSpan: number,
    level: number
  ) => {
    if (!children || children.length === 0 || !expandedNodes.has(parentKey)) {
      return;
    }

    const childCount = children.length;

    children.forEach((childNode: MindMapNode, childIndex) => {
      let childAngle: number;
      if (childCount === 1) {
        childAngle = parentAngle;
      } else {
        const arcStart = parentAngle - arcSpan / 2;
        const angleStep = arcSpan / (childCount - 1);
        childAngle = arcStart + (childIndex * angleStep);
      }

      // Calculate position for the child node
      const childX = centerX + Math.cos(childAngle) * currentRadius - layout.CENTER_OFFSET;
      const childY = centerY + Math.sin(childAngle) * currentRadius;

      // Generate a unique key for the child node for expansion tracking
      const childKey = `${parentKey}-${childIndex}`;

      // Calculate the input angle for the child node (angle from child to parent)
      const childInputAngle = Math.atan2(
        parentY - childY,
        parentX - childX
      );

      let nodeTypeForCreateNode: 'branch' | 'main_node' | 'child_node' | 'grandchild_node';
      let nextRadius: number;
      let nextArcSpan: number;

      switch (level) {
        case 0:
          nodeTypeForCreateNode = 'branch';
          nextRadius = layout.MAIN_NODE_RADIUS;
          nextArcSpan = layout.NODE_ARC_SPAN;
          break;
        case 1:
          nodeTypeForCreateNode = 'main_node';
          nextRadius = layout.CHILD_NODE_RADIUS;
          nextArcSpan = layout.CHILD_ARC_SPAN;
          break;
        case 2:
          nodeTypeForCreateNode = 'child_node';
          nextRadius = layout.GRANDCHILD_NODE_RADIUS;
          nextArcSpan = layout.GRANDCHILD_ARC_SPAN;
          break;
        default:
          nodeTypeForCreateNode = 'grandchild_node';
          nextRadius = currentRadius + 150; // Dynamically increase radius for visual separation
          nextArcSpan = arcSpan * 0.8;      // Gradually narrow the arc span
          break;
      }

      const childId = createNode(
        childNode.label,
        childNode.label,
        nodeTypeForCreateNode,
        childNode.node_type,
        childX,
        childY,
        childKey,
        parentId,
        childNode,
        childNode.emphasis_level,
        childNode.children && childNode.children.length > 0, // Check if THIS child has children
        childInputAngle
      );

      // Update parent node's children list and create an edge to the current child
      updateNodeChildren(parentId, childId);
      createEdge(parentId, childId, getNodeTypeColor(childNode.node_type));

      if (childNode.children && childNode.children.length > 0) {
        renderNodesRecursive(
          childKey,
          childId,
          childNode.children,
          childAngle,
          childX, childY,
          nextRadius,
          nextArcSpan,
          level + 1
        );
      }
    });
  };

  // Create the central concept node
  const branchCount = mindMapData.branches.length;
  const centralChildrenAngles: number[] = [];

  // Pre-calculate branch angles for central node handles (if using specific handles)
  mindMapData.branches.forEach((branch, branchIndex) => {
    const branchAngle = (branchIndex / branchCount) * 2 * Math.PI;
    centralChildrenAngles.push(branchAngle);
  });

  const centralId = createNode(
    mindMapData.central_concept,
    mindMapData.central_concept,
    'central',
    'concept',
    centerX - layout.CENTER_OFFSET,
    centerY,
    'central',
    undefined,
    undefined,
    'high',
    mindMapData.branches.length > 0,
    0,
    centralChildrenAngles
  );

  // Iterate through branches and start the recursive rendering for their main_nodes
  mindMapData.branches.forEach((branch: MindMapBranch, branchIndex) => {

    const branchAngle = (branchIndex / branchCount) * 2 * Math.PI;
    const branchX = centerX + Math.cos(branchAngle) * layout.BRANCH_RADIUS - layout.CENTER_OFFSET;
    const branchY = centerY + Math.sin(branchAngle) * layout.BRANCH_RADIUS;
    const branchKey = `branch-${branchIndex}`; // Unique key for the branch node

    const branchInputAngle = Math.atan2(
      centerY - branchY,
      (centerX - layout.CENTER_OFFSET) - branchX
    );

    const branchId = createNode(
      branch.branch_label,
      branch.branch_label,
      'branch',
      'concept',
      branchX,
      branchY,
      branchKey,
      centralId,
      branch,
      'high',
      branch.main_nodes.length > 0,
      branchInputAngle
    );

    updateNodeChildren(centralId, branchId);
    createEdge(centralId, branchId, '#6366f1', false, `output-${branchIndex}`);

    renderNodesRecursive(
      branchKey,
      branchId,
      branch.main_nodes,
      branchAngle,
      branchX, branchY,
      layout.MAIN_NODE_RADIUS,
      layout.NODE_ARC_SPAN,
      1
    );
  });

  return { nodes, edges };
};
