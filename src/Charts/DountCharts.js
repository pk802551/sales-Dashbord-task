import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const DonutChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data.length) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 300, height = 300, radius = Math.min(width, height) / 2;
    const svgEl = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3.pie().value(d => d.acv);
    const dataReady = pie(d3.groups(data, d => d.Cust_Type).map(([key, values]) => ({
      name: key,
      acv: d3.sum(values, d => d.acv)
    })));

    const arc = d3.arc().innerRadius(70).outerRadius(radius);
    const color = d3.scaleOrdinal().domain(["Existing Customer", "New Customer"]).range(["#1976d2", "#fb8c00"]);

    svgEl.selectAll("path")
      .data(dataReady)
      .join("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.name))
      .attr("stroke", "#fff")
      .style("stroke-width", "2px");

    svgEl.append("text")
      .attr("text-anchor", "middle")
      .text(`Total $${(d3.sum(data, d => d.acv) / 1000).toFixed(0)}K`)
      .style("font-size", "14px");
  }, [data]);

  return <svg ref={ref}></svg>;
};

export default DonutChart;
