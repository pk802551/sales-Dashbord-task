import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Typography,
} from "@mui/material";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const DataTable = ({ data }) => {
  const grouped = data.reduce((acc, item) => {
    const quarter = item.closed_fiscal_quarter;
    const type = item.Cust_Type;
    acc[quarter] = acc[quarter] || { Existing: {}, New: {}, Total: {} };
    acc[quarter][type] = item;
    acc[quarter].Total.count = (acc[quarter].Total.count || 0) + item.count;
    acc[quarter].Total.acv = (acc[quarter].Total.acv || 0) + item.acv;
    return acc;
  }, {});

  const quarters = Object.keys(grouped);
  const customerTypes = ["Existing", "New"];

  const totalSummary = {
    Existing: { count: 0, acv: 0 },
    New: { count: 0, acv: 0 },
    Total: { count: 0, acv: 0 },
  };

  quarters.forEach((q) => {
    customerTypes.forEach((type) => {
      const item = grouped[q][type] || {};
      totalSummary[type].count += item.count || 0;
      totalSummary[type].acv += item.acv || 0;
    });
    totalSummary.Total.count += grouped[q].Total.count || 0;
    totalSummary.Total.acv += grouped[q].Total.acv || 0;
  });

  return (
    <TableContainer component={Paper} elevation={3}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell
              rowSpan={2}
              sx={{ fontWeight: "bold", background: "#f5f5f5", minWidth: 160 }}
              align="center"
            >
              Cust Type
            </TableCell>
            {quarters.map((q) => (
              <TableCell
                key={q}
                colSpan={3}
                align="center"
                sx={{ fontWeight: "bold", background: "#1976d2", color: "#fff" }}
              >
                {q}
              </TableCell>
            ))}
            <TableCell
              colSpan={3}
              align="center"
              sx={{ fontWeight: "bold", background: "#1976d2", color: "#fff" }}
            >
              Total
            </TableCell>
          </TableRow>
          <TableRow>
            {quarters.map((q) =>
              ["# of Opps", "ACV", "% of Total"].map((label, i) => (
                <TableCell
                  key={`${q}-${label}`}
                  align={i === 1 ? "right" : "center"}
                  sx={{ background: "#eeeeee", fontWeight: "bold" }}
                >
                  {label}
                </TableCell>
              ))
            )}
            {["# of Opps", "ACV", "% of Total"].map((label, i) => (
              <TableCell
                key={`total-${label}`}
                align={i === 1 ? "right" : "center"}
                sx={{ background: "#eeeeee", fontWeight: "bold" }}
              >
                {label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {customerTypes.map((type) => (
            <TableRow key={type}>
              <TableCell sx={{ fontWeight: "bold" }}>{type} Customer</TableCell>
              {quarters.map((q) => {
                const item = grouped[q][type] || { count: 0, acv: 0 };
                const total = grouped[q].Total || { acv: 1 };
                const percent = ((item.acv / total.acv) * 100).toFixed(0);
                return (
                  <React.Fragment key={`${q}-${type}`}>
                    <TableCell align="center">{item.count || 0}</TableCell>
                    <TableCell align="right">{formatCurrency(item.acv || 0)}</TableCell>
                    <TableCell align="center">{percent}%</TableCell>
                  </React.Fragment>
                );
              })}
              <TableCell align="center">{totalSummary[type].count}</TableCell>
              <TableCell align="right">{formatCurrency(totalSummary[type].acv)}</TableCell>
              <TableCell align="center">
                {((totalSummary[type].acv / totalSummary.Total.acv) * 100).toFixed(0)}%
              </TableCell>
            </TableRow>
          ))}

          {/* Final Total Row */}
          <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
            <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
            {quarters.map((q) => {
              const total = grouped[q].Total;
              return (
                <React.Fragment key={`${q}-total`}>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {total.count}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    {formatCurrency(total.acv)}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    100%
                  </TableCell>
                </React.Fragment>
              );
            })}
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              {totalSummary.Total.count}
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              {formatCurrency(totalSummary.Total.acv)}
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              100%
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
