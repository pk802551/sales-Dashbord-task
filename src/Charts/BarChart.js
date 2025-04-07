"use client"

import { useRef, useEffect } from "react"
import * as d3 from "d3"
import { formatCurrency } from "../Services/api"

const BarChartComponent = ({ data, keys, indexBy, colors, layout = "vertical", legends = [] }) => {
  const svgRef = useRef()

  useEffect(() => {
    if (!data || data.length === 0) return

    // Clear any existing SVG
    d3.select(svgRef.current).selectAll("*").remove()

    const margin = { top: 40, right: 30, bottom: 60, left: 80 }
    const width = svgRef.current.clientWidth - margin.left - margin.right
    const height = svgRef.current.clientHeight - margin.top - margin.bottom

    // Create SVG
    const svg = d3.select(svgRef.current).append("g").attr("transform", `translate(${margin.left},${margin.top})`)

    // Create scales
    let x, y

    if (layout === "vertical") {
      // For vertical bar chart
      x = d3
        .scaleBand()
        .domain(data.map((d) => d[indexBy]))
        .range([0, width])
        .padding(0.3)

      y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(data, (d) => {
            if (keys.length > 1) {
              return d3.sum(keys.map((key) => d[key]))
            }
            return d[keys[0]]
          }) * 1.1,
        ])
        .range([height, 0])
    } else {
      // For horizontal bar chart
      y = d3
        .scaleBand()
        .domain(data.map((d) => d[indexBy]))
        .range([0, height])
        .padding(0.3)

      x = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d[keys[0]]) * 1.1])
        .range([0, width])
    }

    // Add X axis
    if (layout === "vertical") {
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "middle")
    } else {
      svg.append("g").call(d3.axisBottom(x)).attr("transform", `translate(0,${height})`)
    }

    // Add Y axis
    if (layout === "vertical") {
      svg.append("g").call(d3.axisLeft(y).tickFormat((d) => formatCurrency(d)))
    } else {
      svg.append("g").call(d3.axisLeft(y))
    }

    // Create tooltip
    const tooltip = d3.select("body").append("div").attr("class", "chart-tooltip").style("opacity", 0)

    // Draw bars
    if (layout === "vertical") {
      if (keys.length > 1) {
        // Stacked bar chart
        const stackedData = d3.stack().keys(keys)(data)

        svg
          .selectAll("g.stack")
          .data(stackedData)
          .enter()
          .append("g")
          .attr("class", "stack")
          .attr("fill", (d, i) => colors[i])
          .selectAll("rect")
          .data((d) => d)
          .enter()
          .append("rect")
          .attr("x", (d) => x(d.data[indexBy]))
          .attr("y", (d) => y(d[1]))
          .attr("height", (d) => y(d[0]) - y(d[1]))
          .attr("width", x.bandwidth())
          .on("mouseover", function (event, d) {
            const key = d3.select(this.parentNode).datum().key
            const value = d.data[key]
            const percentage = key === "existingCustomer" ? d.data.existingPercentage : d.data.newPercentage

            tooltip.transition().duration(200).style("opacity", 0.9)
            tooltip
              .html(`
              <div>
                <strong>${key === "existingCustomer" ? "Existing Customer" : "New Customer"}</strong><br/>
                ${formatCurrency(value)} (${percentage}%)
              </div>
            `)
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY - 28 + "px")
          })
          .on("mouseout", () => {
            tooltip.transition().duration(500).style("opacity", 0)
          })

        // Add value labels on top of each bar segment
        stackedData.forEach((layer, i) => {
          svg
            .selectAll(".value-label-" + i)
            .data(layer)
            .enter()
            .append("text")
            .attr("class", "value-label-" + i)
            .attr("text-anchor", "middle")
            .attr("x", (d) => x(d.data[indexBy]) + x.bandwidth() / 2)
            .attr("y", (d) => {
              const height = y(d[0]) - y(d[1])
              return height > 25 ? y(d[1]) + 15 : y(d[1]) - 5
            })
            .attr("fill", (d) => {
              const height = y(d[0]) - y(d[1])
              return height > 25 ? "white" : "black"
            })
            .attr("font-size", "10px")
            .text((d) => {
              const key = layer.key
              const value = d.data[key]
              return formatCurrency(value)
            })
        })

        // Add total value on top of each stacked bar
        svg
          .selectAll(".total-label")
          .data(data)
          .enter()
          .append("text")
          .attr("class", "total-label")
          .attr("text-anchor", "middle")
          .attr("x", (d) => x(d[indexBy]) + x.bandwidth() / 2)
          .attr("y", (d) => y(d3.sum(keys, (key) => d[key])) - 10)
          .attr("fill", "black")
          .attr("font-size", "12px")
          .attr("font-weight", "bold")
          .text((d) => formatCurrency(d.totalACV))
      } else {
        // Simple bar chart
        svg
          .selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("x", (d) => x(d[indexBy]))
          .attr("y", (d) => y(d[keys[0]]))
          .attr("width", x.bandwidth())
          .attr("height", (d) => height - y(d[keys[0]]))
          .attr("fill", colors[0])
          .on("mouseover", (event, d) => {
            tooltip.transition().duration(200).style("opacity", 0.9)
            tooltip
              .html(`
              <div>
                <strong>${d[indexBy]}</strong><br/>
                ${formatCurrency(d[keys[0]])}
              </div>
            `)
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY - 28 + "px")
          })
          .on("mouseout", () => {
            tooltip.transition().duration(500).style("opacity", 0)
          })

        // Add value labels on top of each bar
        svg
          .selectAll(".value-label")
          .data(data)
          .enter()
          .append("text")
          .attr("class", "value-label")
          .attr("text-anchor", "middle")
          .attr("x", (d) => x(d[indexBy]) + x.bandwidth() / 2)
          .attr("y", (d) => y(d[keys[0]]) - 5)
          .attr("fill", "black")
          .attr("font-size", "10px")
          .text((d) => formatCurrency(d[keys[0]]))
      }
    } else {
      // Horizontal bar chart
      svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", (d) => y(d[indexBy]))
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("width", (d) => x(d[keys[0]]))
        .attr("fill", colors[0])
        .on("mouseover", (event, d) => {
          tooltip.transition().duration(200).style("opacity", 0.9)
          tooltip
            .html(`
            <div>
              <strong>${d[indexBy]}</strong><br/>
              ${formatCurrency(d[keys[0]])}
            </div>
          `)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 28 + "px")
        })
        .on("mouseout", () => {
          tooltip.transition().duration(500).style("opacity", 0)
        })

      // Add value labels inside each bar
      svg
        .selectAll(".value-label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "value-label")
        .attr("y", (d) => y(d[indexBy]) + y.bandwidth() / 2 + 4)
        .attr("x", (d) => x(d[keys[0]]) - 5)
        .attr("text-anchor", "end")
        .attr("fill", "white")
        .attr("font-size", "10px")
        .text((d) => formatCurrency(d[keys[0]]))
    }

    // Add legend if provided
    if (legends.length > 0) {
      const legend = svg
        .append("g")
        .attr("class", "legend")
        .attr("transform", `translate(0, ${-margin.top / 2})`)

      legends.forEach((item, i) => {
        const legendItem = legend.append("g").attr("transform", `translate(${i * 150}, 0)`)

        legendItem.append("rect").attr("width", 15).attr("height", 15).attr("fill", item.color)

        legendItem.append("text").attr("x", 20).attr("y", 12).text(item.title).style("font-size", "12px")
      })
    }

    // Clean up tooltip when component unmounts
    return () => {
      d3.select("body").selectAll(".chart-tooltip").remove()
    }
  }, [data, keys, indexBy, colors, layout, legends])

  return <svg ref={svgRef} width="100%" height="100%" className="bar-chart" />
}

export default BarChartComponent

