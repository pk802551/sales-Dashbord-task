import React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const DataTable = ({ data }) => {
  const grouped = data.reduce((acc, item) => {
    const quarter = item.closed_fiscal_quarter;
    acc[quarter] = acc[quarter] || [];
    acc[quarter].push(item);
    return acc;
  }, {});

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Quarter</TableCell>
          <TableCell>Cust Type</TableCell>
          <TableCell># of Opps</TableCell>
          <TableCell>ACV</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(grouped).map(([quarter, entries]) =>
          entries.map((entry, idx) => (
            <TableRow key={`${quarter}-${idx}`}>
              <TableCell>{quarter}</TableCell>
              <TableCell>{entry.Cust_Type}</TableCell>
              <TableCell>{entry.count}</TableCell>
              <TableCell>${(entry.acv / 1000).toFixed(1)}K</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default DataTable;
