import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const LinkedList = () => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const data = [1, 2, 3, 4, 5];

    const distance = 100;
    const radius = 20;
    const [x0, y0] = [50, 50];

    const nodes = svg
      .selectAll(".node")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "node")
      .attr("cx", (d, i) => x0 + i * distance)
      .attr("cy", y0)
      .attr("r", radius)
      .style("fill", "steelblue");

    nodes.each(function (d, i) {
      if (i < data.length - 1) {
        const x1 = x0 + radius + i * distance;
        const x2 = x1 + distance - 2 * radius - 10;
        svg
          .append("line")
          .attr("x1", x1)
          .attr("y1", y0)
          .attr("x2", x2)
          .attr("y2", y0)
          .attr("marker-end", "url(#arrowhead)")
          .style("stroke", "black");
      }
    });

    const x1 = x0 + radius;
    const x2 = x1 + 2 * distance - 2 * radius - 10;
    svg
      .append("line")
      .attr("x1", x1)
      .attr("y1", y0)
      .attr("x2", x2)
      .attr("y2", y0)
      .attr("marker-end", "url(#arrowhead)")
      .style("stroke", "black");
  }, []);

  return (
    <svg ref={svgRef} width={600} height={100}>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="0"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" />
        </marker>
      </defs>
    </svg>
  );
};

export default LinkedList;
