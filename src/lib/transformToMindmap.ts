import { MarkerType } from 'reactflow';
import { StudyNotesStructure, StudyNotesSection, StudyNotesSubsection, MindMapNode, MindMapEdge } from '@/lib/types';
import { Breakpoint } from '../hooks/useBreakpoint';

export const transformToMindMap = (
  studyNotes: StudyNotesStructure,
  expandedNodes: Set<string>,
  breakpoint: Breakpoint
): { nodes: MindMapNode[]; edges: MindMapEdge[] } => {
  const nodes: MindMapNode[] = [];
  const edges: MindMapEdge[] = [];
  let nodeIdCounter = 0;

  // Responsive layout configuration using Tailwind breakpoints
  const getLayoutConfig = () => {
    switch (breakpoint) {
      case 'sm': // < 640px
        return {
          ROOT_Y: 30,
          SECTION_Y: 180,
          SUBSECTION_Y: 320,
          NODE_SPACING: 200,
          SUBSECTION_SPACING: 150,
          CENTER_OFFSET: 100,
        };
      case 'md': // 640px - 768px
        return {
          ROOT_Y: 40,
          SECTION_Y: 220,
          SUBSECTION_Y: 400,
          NODE_SPACING: 250,
          SUBSECTION_SPACING: 180,
          CENTER_OFFSET: 120,
        };
      case 'lg': // 768px - 1024px
        return {
          ROOT_Y: 50,
          SECTION_Y: 250,
          SUBSECTION_Y: 450,
          NODE_SPACING: 300,
          SUBSECTION_SPACING: 200,
          CENTER_OFFSET: 140,
        };
      default: // xl and above
        return {
          ROOT_Y: 60,
          SECTION_Y: 280,
          SUBSECTION_Y: 500,
          NODE_SPACING: 350,
          SUBSECTION_SPACING: 220,
          CENTER_OFFSET: 160,
        };
    }
  };

  const layout = getLayoutConfig();
  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 512;

  const createNode = (
    label: string,
    content: string,
    type: 'root' | 'section' | 'subsection' | 'takeaway',
    x: number,
    y: number,
    nodeKey: string,
    parentId?: string,
    originalData?: any,
    pointsCount = 0,
    definitionsCount = 0,
    examplesCount = 0,
    hasExpandableChildren = false
  ): string => {
    const id = `node-${nodeIdCounter++}`;
    const isExpanded = expandedNodes.has(nodeKey);

    nodes.push({
      id,
      type: 'custom',
      position: { x, y },
      draggable: true, // Enable dragging for all nodes
      data: {
        label,
        content,
        type,
        isExpanded,
        childrenIds: [],
        parentId,
        originalData,
        pointsCount,
        definitionsCount,
        examplesCount,
        nodeKey,
        hasExpandableChildren,
      },
    });
    return id;
  };

  const updateNodeChildren = (nodeId: string, childId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      node.data.childrenIds.push(childId);
    }
  };

  const createEdge = (sourceId: string, targetId: string, color: string, isDashed = false) => {
    edges.push({
      id: `edge-${sourceId}-${targetId}`,
      source: sourceId,
      sourceHandle: 'output',
      target: targetId,
      targetHandle: 'input',
      type: 'smoothstep',
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

  const getSectionContentCount = (section: StudyNotesSection) => {
    const pointsCount = section.points?.length || 0;
    const definitionsCount = section.definitions?.length || 0;
    const examplesCount = section.examples?.length || 0;
    return { pointsCount, definitionsCount, examplesCount };
  };

  const getSubsectionContentCount = (subsection: StudyNotesSubsection) => {
    const pointsCount = subsection.points?.length || 0;
    const definitionsCount = subsection.definitions?.length || 0;
    const examplesCount = subsection.examples?.length || 0;
    return { pointsCount, definitionsCount, examplesCount };
  };

  // Create root node at the top center
  const rootId = createNode(
    studyNotes.title,
    studyNotes.title,
    'root',
    centerX - layout.CENTER_OFFSET,
    layout.ROOT_Y,
    'root',
    undefined,
    undefined,
    0,
    0,
    0,
    studyNotes.sections.length > 0
  );

  // Calculate section positions - spread horizontally
  const sectionCount = studyNotes.sections.length;
  const totalSectionWidth = (sectionCount - 1) * layout.NODE_SPACING;
  const sectionStartX = centerX - totalSectionWidth / 2;

  studyNotes.sections.forEach((section, sectionIndex) => {
    const sectionX = sectionStartX + (sectionIndex * layout.NODE_SPACING) - layout.CENTER_OFFSET;
    const sectionKey = `section-${section.heading}`;

    const contentCount = getSectionContentCount(section);
    const hasSubsections = section.subsections && section.subsections.length > 0;

    const sectionId = createNode(
      section.heading,
      section.heading,
      'section',
      sectionX,
      layout.SECTION_Y,
      sectionKey,
      rootId,
      section,
      contentCount.pointsCount,
      contentCount.definitionsCount,
      contentCount.examplesCount,
      hasSubsections
    );

    updateNodeChildren(rootId, sectionId);
    createEdge(rootId, sectionId, '#6366f1');

    const sectionExpanded = expandedNodes.has(sectionKey);

    // Add subsections if expanded
    if (sectionExpanded && hasSubsections) {
      const subsectionCount = section.subsections!.length;
      const totalSubsectionWidth = (subsectionCount - 1) * layout.SUBSECTION_SPACING;
      const subsectionStartX = sectionX - totalSubsectionWidth / 2;

      section.subsections!.forEach((subsection, subsectionIndex) => {
        const subsectionX = subsectionStartX + (subsectionIndex * layout.SUBSECTION_SPACING);
        const subsectionKey = `subsection-${section.heading}-${subsection.subheading}`;

        const subsectionContentCount = getSubsectionContentCount(subsection);
        const subsectionId = createNode(
          subsection.subheading,
          subsection.subheading,
          'subsection',
          subsectionX,
          layout.SUBSECTION_Y,
          subsectionKey,
          sectionId,
          subsection,
          subsectionContentCount.pointsCount,
          subsectionContentCount.definitionsCount,
          subsectionContentCount.examplesCount,
          false
        );

        updateNodeChildren(sectionId, subsectionId);
        createEdge(sectionId, subsectionId, '#22c55e');
      });
    }
  });

  return { nodes, edges };
};