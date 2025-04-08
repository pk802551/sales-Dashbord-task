// import React, { useEffect, useRef } from "react";
// import * as d3 from "d3";

// const BarChart = ({ data }) => {
//   const ref = useRef();

//   useEffect(() => {
//     if (!data.length) return;

//     const svg = d3.select(ref.current);
//     svg.selectAll("*").remove();

//     const margin = { top: 50, right: 100, bottom: 60, left: 70 },
//       width = 800 - margin.left - margin.right,
//       height = 400 - margin.top - margin.bottom;

//     const svgEl = svg
//       .attr("width", width + margin.left + margin.right)
//       .attr("height", height + margin.top + margin.bottom)
//       .append("g")
//       .attr("transform", `translate(${margin.left},${margin.top})`);

//     const quarters = [...new Set(data.map((d) => d.closed_fiscal_quarter))];
//     const color = d3.scaleOrdinal()
//       .domain(["Existing Customer", "New Customer"])
//       .range(["#1976d2", "#fb8c00"]);

//     // Group data by quarter and stack the acv values
//     const grouped = d3.rollup(
//       data,
//       (v) => {
//         const total = d3.sum(v, (d) => d.acv);
//         return {
//           items: v.map((d) => ({ ...d, percent: ((d.acv / total) * 100).toFixed(0) })),
//           total,
//         };
//       },
//       (d) => d.closed_fiscal_quarter
//     );

//     const stackData = quarters.map((q) => {
//       const obj = { quarter: q };
//       grouped.get(q).items.forEach((item) => {
//         obj[item.Cust_Type] = item.acv;
//       });
//       return obj;
//     });

//     const stackKeys = ["Existing Customer", "New Customer"];
//     const stack = d3.stack().keys(stackKeys);
//     const series = stack(stackData);

//     const x = d3.scaleBand()
//       .domain(quarters)
//       .range([0, width])
//       .padding(0.4);

//     const y = d3.scaleLinear()
//       .domain([0, d3.max([...grouped.values()].map((d) => d.total)) * 1.1])
//       .nice()
//       .range([height, 0]);

//     // Axis
//     svgEl.append("g").call(d3.axisLeft(y).tickFormat(d3.format("$.2s")));
//     svgEl.append("g")
//       .attr("transform", `translate(0, ${height})`)
//       .call(d3.axisBottom(x));

//     // Bars
//     svgEl.selectAll("g.layer")
//       .data(series)
//       .join("g")
//       .attr("fill", (d) => color(d.key))
//       .selectAll("rect")
//       .data((d) => d)
//       .join("rect")
//       .attr("x", (d) => x(d.data.quarter))
//       .attr("y", (d) => y(d[1]))
//       .attr("height", (d) => y(d[0]) - y(d[1]))
//       .attr("width", x.bandwidth());

//     // Internal section labels
//     series.forEach((stackLayer, layerIdx) => {
//       svgEl.selectAll(`text.label-${layerIdx}`)
//         .data(stackLayer)
//         .join("text")
//         .attr("x", (d) => x(d.data.quarter) + x.bandwidth() / 2)
//         .attr("y", (d) => y(d[1]) + 15)
//         .attr("text-anchor", "middle")
//         .attr("fill", "#fff")
//         .attr("font-size", "12px")
//         .text((d) => {
//           const value = d[1] - d[0];
//           const percent = (
//             (value / (d[1] - d[0] + d[0])) *
//             100
//           ).toFixed(0);
//           return `${d3.format("$.2s")(value)}\n(${percent}%)`;
//         });
//     });

//     // Total value label on top of each bar
//     quarters.forEach((q) => {
//       const total = grouped.get(q).total;
//       svgEl.append("text")
//         .attr("x", x(q) + x.bandwidth() / 2)
//         .attr("y", y(total) - 10)
//         .attr("text-anchor", "middle")
//         .attr("font-size", "12px")
//         .attr("fill", "#000")
//         .attr("font-weight", "bold")
//         .text(d3.format("$.2s")(total));
//     });

//     // Chart Title
//     svgEl.append("text")
//       .attr("x", width / 2)
//       .attr("y", -15)
//       .attr("text-anchor", "middle")
//       .attr("font-size", "16px")
//       .attr("font-weight", "bold")
//       .text("Won ACV mix by Cust Type");
//   }, [data]);

//   return <svg ref={ref} />;
// };

// export default BarChart;
