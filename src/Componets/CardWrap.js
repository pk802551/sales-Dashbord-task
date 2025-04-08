import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const CardWrapper = ({ title, children }) => (
  <Card sx={{ margin: "16px 0" }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      {children}
    </CardContent>
  </Card>
);

export default CardWrapper;
