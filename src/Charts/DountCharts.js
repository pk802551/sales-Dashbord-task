"use client"

import { useRef, useEffect } from "react"
import * as d3 from "d3"
import { formatCurrency } from "../Services/api"

const DonutChartComponent = ({ data, colors, totalValue, showLegend = false }) => {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    // Clear any existing SVG
    d3.select(svgRef.current).selectAll("*").remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight
    const radius = (Math.min(width, height) / 2) * 0.8

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)

    // Create pie chart
    const pie = d3
      .pie()
      .value((d) => d.value)
      .sort(null)

    const arc = d3
      .arc()
      .innerRadius(radius * 0.6) // Donut hole size
      .outerRadius(radius)

    // Create tooltip
    const tooltip = d3.select("body").append("div").attr("class", "chart-tooltip").style("opacity", 0)

    // Draw arcs
    const arcs = svg.selectAll("arc").data(pie(data)).enter().append("g").attr("class", "arc")

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => colors[i % colors.length])
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9)
        tooltip
          .html(`
          <div>
            <strong>${d.data.name}</strong><br/>
            ${formatCurrency(d.data.value)} (${d.data.percentage}%)
          </div>
        `)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px")
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0)
      })

    // Add percentage labels
    arcs
      .filter((d) => d.endAngle - d.startAngle > 0.25) // Only add labels to larger segments
      .append("text")
      .attr("transform", (d) => {
        const pos = arc.centroid(d)
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2
        const x = Math.sin(midAngle) * (radius * 0.8)
        const y = -Math.cos(midAngle) * (radius * 0.8)
        return `translate(${x},${y})`
      })
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", "white")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text((d) => `${d.data.percentage}%`)

    // Add center text with total value
    svg.append("text").attr("text-anchor", "middle").attr("dy", "-0.5em").attr("font-size", "14px").text("Total")

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1em")
      .attr("font-size", "18px")
      .attr("font-weight", "bold")
      .text(formatCurrency(totalValue))

    // Add legend if showLegend is true
    if (showLegend) {
      const legendRectSize = 15
      const legendSpacing = 5
      const legendHeight = legendRectSize + legendSpacing

      const legend = svg
        .selectAll(".legend")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => {
          const height = legendHeight
          const offset = (height * data.length) / 2
          const x = radius + 30
          const y = i * height - offset
          return `translate(${x},${y})`
        })

      legend
        .append("rect")
        .attr("width", legendRectSize)
        .attr("height", legendRectSize)
        .style("fill", (d, i) => colors[i % colors.length])

      legend
        .append("text")
        .attr("x", legendRectSize + legendSpacing)
        .attr("y", legendRectSize - legendSpacing)
        .text((d) => `${d.name} (${d.percentage}%)`)
    }

    // Clean up tooltip when component unmounts
    return () => {
      d3.select("body").selectAll(".chart-tooltip").remove()
    }
  }, [data, colors, totalValue, showLegend])

  return <svg ref={svgRef} width="100%" height="100%" className="donut-chart" />
}

export default DonutChartComponent

