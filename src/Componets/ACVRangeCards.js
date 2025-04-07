"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, Typography, Box, CircularProgress } from "@mui/material"
import DataTable from "../Commons/DataTables"
import BarChartComponent from "../Charts/BarChart"
import { getACVRangeData } from "../Redux/acvRangeSlices"



const ACVRangeCard = () => {
  const dispatch = useDispatch()
  const { data, summary, loading, error } = useSelector((state) => state.acvRange)

  useEffect(() => {
    dispatch(getACVRangeData())
  }, [dispatch])

  // Prepare data for horizontal bar chart
  const barChartData = data.map((item) => ({
    range: item.range,
    value: item.acv,
  }))

  // Prepare data for table
  const tableColumns = [
    { id: "range", label: "ACV Range", align: "left" },
    { id: "opps", label: "# of Opps", align: "right" },
    { id: "acv", label: "ACV", align: "right" },
    { id: "percentage", label: "% of Total", align: "right" },
  ]

  const tableRows = data.map((item) => ({
    range: item.range,
    opps: item.opps,
    acv: item.acv,
    percentage: item.percentage,
  }))

  // Add summary row
  if (summary && summary.total) {
    tableRows.push({
      range: "Total",
      opps: summary.total.opps,
      acv: summary.total.acv,
      percentage: summary.total.percentage,
      isTotal: true,
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
          <CircularProgress />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error">Error loading data: {error}</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader title="Won ACV by Range" titleTypographyProps={{ align: "center", variant: "h6" }} />
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
          <Box sx={{ flex: 1, minHeight: "400px" }}>
            <BarChartComponent
              data={barChartData}
              keys={["value"]}
              indexBy="range"
              colors={["#1976d2"]}
              layout="horizontal"
            />
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <DataTable
            columns={tableColumns}
            rows={tableRows}
            formatCurrency={["acv"]}
            formatPercentage={["percentage"]}
          />
        </Box>
      </CardContent>
    </Card>
  )
}

export default ACVRangeCard

