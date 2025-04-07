"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, Typography, Box, CircularProgress } from "@mui/material"
import DonutChartComponent from "../Charts/DountCharts"
import DataTable from "../Commons/DataTables"
import { getAccountIndustryData } from "../Redux/accountIndustrySlices"



const AccountIndustryCard = () => {
  const dispatch = useDispatch()
  const { data, summary, loading, error } = useSelector((state) => state.accountIndustry)

  useEffect(() => {
    dispatch(getAccountIndustryData())
  }, [dispatch])

  // Prepare data for donut chart
  const donutChartData = data.map((item) => ({
    name: item.industry,
    value: item.acv,
    percentage: item.percentage,
  }))

  // Prepare data for table
  const tableColumns = [
    { id: "industry", label: "Industry", align: "left" },
    { id: "opps", label: "# of Opps", align: "right" },
    { id: "acv", label: "ACV", align: "right" },
    { id: "percentage", label: "% of Total", align: "right" },
  ]

  const tableRows = data.map((item) => ({
    industry: item.industry,
    opps: item.opps,
    acv: item.acv,
    percentage: item.percentage,
  }))

  // Add summary row
  if (summary && summary.total) {
    tableRows.push({
      industry: "Total",
      opps: summary.total.opps,
      acv: summary.total.acv,
      percentage: summary.total.percentage,
      isTotal: true,
    })
  }

  // Colors for the chart
  const colors = ["#1976d2", "#42a5f5", "#90caf9", "#f57c00", "#ff9800", "#ffb74d"]

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
      <CardHeader title="Won ACV by Account Industry" titleTypographyProps={{ align: "center", variant: "h6" }} />
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
            <DonutChartComponent
              data={donutChartData}
              colors={colors}
              totalValue={summary?.total?.acv || 0}
              showLegend={true}
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

export default AccountIndustryCard

