import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GraphData, Node, Link, ColorMode } from '../types';

interface GraphCanvasProps {
  data: GraphData;
  onNodeClick: (node: Node) => void;
  highlightNodeId?: string | null;
  colorMode: ColorMode;
}

const GraphCanvas: React.FC<GraphCanvasProps> = ({ data, onNodeClick, highlightNodeId, colorMode }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.nodes.length === 0) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .call(d3.zoom().on("zoom", (event) => {
        g.attr("transform", event.transform);
      }) as any);

    const g = svg.append("g");

    // Simulation
    const simulation = d3.forceSimulation(data.nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(data.edges).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d: any) => (d.importance || 0.5) * 30 + 10));

    // Links
    const link = g.append("g")
      .selectAll("line")
      .data(data.edges)
      .join("line")
      .attr("stroke", "#52525b") // Zinc-600
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5);

    // Node Groups
    const node = g.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Node Circles (Art Deco Style)
    // Dynamic Fill based on ColorMode
    node.append("circle")
      .attr("r", (d: any) => 5 + (d.importance || 0.5) * 20)
      .attr("fill", (d: any) => {
        if (colorMode === 'type') {
          if (d.type === 'person') return "#1e40af"; // Blue
          if (d.type === 'organization') return "#b91c1c"; // Red
          if (d.type === 'event') return "#d97706"; // Amber
          return "#3f3f46"; // Zinc
        } else if (colorMode === 'community') {
          return d3.schemeTableau10[(d.group || 0) % 10];
        } else if (colorMode === 'kcore') {
          // Viridis scale for K-Core (resilience)
          // Interpolate domain 0-8 approx
          return d3.interpolatePlasma((d.kCore || 0) / 8); 
        } else if (colorMode === 'importance') {
          // Magma scale for PageRank (influence)
          return d3.interpolateMagma((d.centrality || 0) * 10); // Scale up small PR values
        }
        return "#3f3f46";
      })
      .attr("stroke", (d: any) => d.importance > 0.8 ? "#fbbf24" : "#27272a") // Amber-400 for leaders
      .attr("stroke-width", (d: any) => d.importance > 0.8 ? 3 : 1)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation();
        onNodeClick(d as Node);
      });

    // Node Labels
    node.append("text")
      .text((d: any) => d.label)
      .attr("x", 12)
      .attr("y", 4)
      .attr("fill", "#e4e4e7")
      .attr("font-size", "10px")
      .attr("font-family", "Inter, sans-serif")
      .style("pointer-events", "none")
      .style("text-shadow", "2px 2px 4px #000");

    // Simulation Tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Highlight Logic
    if (highlightNodeId) {
      const highlightedNode = data.nodes.find(n => n.id === highlightNodeId);
      if (highlightedNode) {
        // Simple zoom to node
         svg.transition().duration(750).call(
           // @ts-ignore
           d3.zoom().transform,
           d3.zoomIdentity.translate(width/2, height/2).scale(2).translate(-(highlightedNode.x || 0), -(highlightedNode.y || 0))
         );
      }
    }

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [data, highlightNodeId, colorMode]);

  return (
    <div ref={containerRef} className="w-full h-full bg-zinc-950 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 text-zinc-500 font-mono text-xs pointer-events-none flex flex-col gap-1">
        <span>GRAFIKA SIŁOWA v2.2 • SILNIK D3</span>
        <span>TRYB: {colorMode.toUpperCase()}</span>
      </div>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default GraphCanvas;