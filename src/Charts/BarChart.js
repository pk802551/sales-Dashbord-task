import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const BarChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data.length) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 40, left: 60 },
      width = 600 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    const groupedData = d3.groups(data, d => d.closed_fiscal_quarter);
    const quarters = [...new Set(data.map(d => d.closed_fiscal_quarter))];
    const types = ["Existing Customer", "New Customer"];
    const color = d3.scaleOrdinal().domain(types).range(["#1976d2", "#fb8c00"]);

    const x0 = d3.scaleBand().domain(quarters).range([0, width]).padding(0.2);
    const x1 = d3.scaleBand().domain(types).range([0, x0.bandwidth()]);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.acv)]).nice().range([height, 0]);

    const svgEl = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svgEl.append("g")
      .selectAll("g")
      .data(groupedData)
      .join("g")
      .attr("transform", d => `translate(${x0(d[0])},0)`)
      .selectAll("rect")
      .data(d => d[1])
      .join("rect")
      .attr("x", d => x1(d.Cust_Type))
      .attr("y", d => y(d.acv))
      .attr("width", x1.bandwidth())
      .attr("height", d => height - y(d.acv))
      .attr("fill", d => color(d.Cust_Type));

    svgEl.append("g").call(d3.axisLeft(y));
    svgEl.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x0));
  }, [data]);

  return <svg ref={ref}></svg>;
};

export default BarChart;
