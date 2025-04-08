import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerTypeData } from "./Redux/customerTypeSlices";

import { Container, Grid } from "@mui/material";
import BarChart from "../src/Charts/BarChart";
import DonutChart from "../src/Charts/DountCharts";
import DataTable from "./Commons/DataTables";
import CardWrapper from "./Componets/CardWrap";

function App() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector(state => state.customerType);

  useEffect(() => {
    dispatch(getCustomerTypeData());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return (
    <Container maxWidth="lg">
      <h2>Won ACV mix by Cust Type</h2>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <CardWrapper title="Bar Chart">
            <BarChart data={data} />
          </CardWrapper>
        </Grid>
        <Grid item xs={12} md={4}>
          <CardWrapper title="Donut Chart">
            <DonutChart data={data} />
          </CardWrapper>
        </Grid>
        <Grid item xs={12}>
          <CardWrapper title="Detailed Data Table">
            <DataTable data={data} />
          </CardWrapper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
