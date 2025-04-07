import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material"
import { formatCurrency, formatPercentage } from "../Services/api"

const DataTable = ({
  columns,
  rows,
  formatCurrency: currencyColumns = [],
  formatPercentage: percentageColumns = [],
}) => {
  const formatValue = (value, column) => {
    if (currencyColumns.includes(column)) {
      return formatCurrency(value)
    }
    if (percentageColumns.includes(column)) {
      return formatPercentage(value)
    }
    return value
  }

  return (
    <TableContainer component={Paper} className="table-container">
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || "left"}
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5",
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={index}
              sx={{
                backgroundColor: row.isTotal ? "#f5f5f5" : "inherit",
                fontWeight: row.isTotal ? "bold" : "normal",
                borderTop: row.isTotal ? "2px solid #ddd" : "none",
                "&:last-child td, &:last-child th": {
                  borderBottom: 0,
                },
                ...(row.isSummary && {
                  borderTop: "2px solid #ddd",
                }),
              }}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  sx={{
                    fontWeight: row.isTotal ? "bold" : "normal",
                    ...(row.isSummary && {
                      backgroundColor: "#f5f5f5",
                    }),
                  }}
                >
                  {formatValue(row[column.id], column.id)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DataTable

