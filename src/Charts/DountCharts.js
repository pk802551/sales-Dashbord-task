import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

 const BarChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const margin = { top: 50, right: 20, bottom: 60, left: 70 },
      width = 600 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    const svgEl = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const quarters = [...new Set(data.map((d) => d.closed_fiscal_quarter))];
    const color = d3.scaleOrdinal()
      .domain(["Existing Customer", "New Customer"])
      .range(["#1976d2", "#fb8c00"]);

    const grouped = d3.rollup(
      data,
      (v) => {
        const total = d3.sum(v, (d) => d.acv);
        return {
          items: v.map((d) => ({ ...d, percent: ((d.acv / total) * 100).toFixed(0) })),
          total,
        };
      },
      (d) => d.closed_fiscal_quarter
    );

    const stackData = quarters.map((q) => {
      const obj = { quarter: q };
      grouped.get(q).items.forEach((item) => {
        obj[item.Cust_Type] = item.acv;
      });
      return obj;
    });

    const stackKeys = ["Existing Customer", "New Customer"];
    const stack = d3.stack().keys(stackKeys);
    const series = stack(stackData);

    const x = d3.scaleBand().domain(quarters).range([0, width]).padding(0.4);
    const y = d3.scaleLinear().domain([0, d3.max([...grouped.values()].map(d => d.total)) * 1.2]).nice().range([height, 0]);

    svgEl.append("g").call(d3.axisLeft(y).tickFormat(d3.format("$.2s")));
    svgEl.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    svgEl.selectAll("g.layer")
      .data(series)
      .join("g")
      .attr("fill", (d) => color(d.key))
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (d) => x(d.data.quarter))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth());

    // Value and percent inside bars
    series.forEach((stackLayer, idx) => {
      svgEl.selectAll(`text.label-${idx}`)
        .data(stackLayer)
        .join("text")
        .attr("x", d => x(d.data.quarter) + x.bandwidth() / 2)
        .attr("y", d => y(d[1]) + 15)
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .attr("font-size", "12px")
        .text(d => {
          const value = d[1] - d[0];
          return `${d3.format("$.3s")(value)}\n(${Math.round((value / grouped.get(d.data.quarter).total) * 100)}%)`;
        });
    });

    quarters.forEach((q) => {
      const total = grouped.get(q).total;
      svgEl.append("text")
        .attr("x", x(q) + x.bandwidth() / 2)
        .attr("y", y(total) - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "13px")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .text(d3.format("$.3s")(total));
    });

    svgEl.append("text")
      .attr("x", width / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .text("Won ACV mix by Cust Type");
  }, [data]);

  return <svg ref={ref} />;
};

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
    const pieData = pie(d3.groups(data, d => d.Cust_Type).map(([name, values]) => ({
      name,
      acv: d3.sum(values, d => d.acv)
    })));

    const arc = d3.arc().innerRadius(70).outerRadius(radius);
    const color = d3.scaleOrdinal().domain(["Existing Customer", "New Customer"]).range(["#1976d2", "#fb8c00"]);

    svgEl.selectAll("path")
      .data(pieData)
      .join("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.name))
      .attr("stroke", "#fff")
      .style("stroke-width", "2px");

    svgEl.append("text")
      .attr("text-anchor", "middle")
      .attr("y", 5)
      .style("font-size", "14px")
      .attr("font-weight", "bold")
      .text(`Total $${(d3.sum(data, d => d.acv) / 1000).toFixed(0)}K`);

    svgEl.selectAll(".label")
      .data(pieData)
      .enter()
      .append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#000")
      .text(d => `$${(d.data.acv / 1000).toFixed(0)}K (${Math.round((d.data.acv / d3.sum(data, d => d.acv)) * 100)}%)`);
  }, [data]);

  return <svg ref={ref}></svg>;
};


export {
  DonutChart,
  BarChart
}