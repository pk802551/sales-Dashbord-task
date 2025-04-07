"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, Typography, Box, CircularProgress } from "@mui/material"
import BarChartComponent from "../Charts/BarChart"
import DonutChartComponent from "../Charts/DountCharts"
import DataTable from "../Commons/DataTables"
import { getCustomerTypeData } from "../Redux/customerTypeSlices"


const CustomerTypeCard = () => {
  const dispatch = useDispatch()
  const { data, summary, loading, error } = useSelector((state) => state.customerType)

  useEffect(() => {
    dispatch(getCustomerTypeData())
  }, [dispatch])

  // Prepare data for bar chart
  const barChartData = data.map((item) => ({
    quarter: item.quarter,
    existingCustomer: item.existingCustomer.acv,
    newCustomer: item.newCustomer.acv,
    existingPercentage: item.existingCustomer.percentage,
    newPercentage: item.newCustomer.percentage,
    totalACV: item.total.acv,
  }))

  // Prepare data for donut chart
  const donutChartData = [
    {
      name: "Existing Customer",
      value: summary?.existingCustomer?.acv || 0,
      percentage: summary?.existingCustomer?.percentage || 0,
    },
    { name: "New Customer", value: summary?.newCustomer?.acv || 0, percentage: summary?.newCustomer?.percentage || 0 },
  ]

  // Prepare data for table
  const tableColumns = [
    { id: "quarter", label: "Closed Fiscal Quarter", align: "left" },
    { id: "custType", label: "Cust Type", align: "left" },
    { id: "opps", label: "# of Opps", align: "right" },
    { id: "acv", label: "ACV", align: "right" },
    { id: "percentage", label: "% of Total", align: "right" },
  ]

  const tableRows = []

  if (data.length > 0) {
    data.forEach((item) => {
      tableRows.push({
        quarter: item.quarter,
        custType: "Existing Customer",
        opps: item.existingCustomer.opps,
        acv: item.existingCustomer.acv,
        percentage: item.existingCustomer.percentage,
      })
      tableRows.push({
        quarter: item.quarter,
        custType: "New Customer",
        opps: item.newCustomer.opps,
        acv: item.newCustomer.acv,
        percentage: item.newCustomer.percentage,
      })
      tableRows.push({
        quarter: item.quarter,
        custType: "Total",
        opps: item.total.opps,
        acv: item.total.acv,
        percentage: item.total.percentage,
        isTotal: true,
      })
    })

    // Add summary row
    tableRows.push({
      quarter: "Total",
      custType: "Existing Customer",
      opps: summary.existingCustomer.opps,
      acv: summary.existingCustomer.acv,
      percentage: summary.existingCustomer.percentage,
      isSummary: true,
    })
    tableRows.push({
      quarter: "Total",
      custType: "New Customer",
      opps: summary.newCustomer.opps,
      acv: summary.newCustomer.acv,
      percentage: summary.newCustomer.percentage,
      isSummary: true,
    })
    tableRows.push({
      quarter: "Total",
      custType: "Total",
      opps: summary.total.opps,
      acv: summary.total.acv,
      percentage: summary.total.percentage,
      isTotal: true,
      isSummary: true,
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
      <CardHeader title="Won ACV mix by Cust Type" titleTypographyProps={{ align: "center", variant: "h6" }} />
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
          <Box sx={{ flex: 2, minHeight: "400px" }}>
            <BarChartComponent
              data={barChartData}
              keys={["existingCustomer", "newCustomer"]}
              indexBy="quarter"
              colors={["#1976d2", "#f57c00"]}
              legends={[
                { title: "Existing Customer", color: "#1976d2" },
                { title: "New Customer", color: "#f57c00" },
              ]}
            />
          </Box>
          <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <DonutChartComponent
              data={donutChartData}
              colors={["#1976d2", "#f57c00"]}
              totalValue={summary?.total?.acv || 0}
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

export default CustomerTypeCard

