import { Provider } from "react-redux"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import store from "./Redux/Store"
import ACVRangeCard from "./Componets/ACVRangeCards"
import AccountIndustryCard from "./Componets/AccountIndustryCards"
import TeamCard from "./Componets/TeamCards"
import CustomerTypeCard from "./Componets/CustomerTypeCards"


// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f57c00",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 500,
      fontSize: "1.5rem",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.08)",
          borderRadius: "8px",
        },
      },
    },
  },
})

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
          <Container maxWidth="xl">
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
              Sales Performance Dashboard
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <CustomerTypeCard />
              </Grid>
              <Grid item xs={12} lg={6}>
                <AccountIndustryCard />
              </Grid>
              <Grid item xs={12} lg={6}>
                <ACVRangeCard />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TeamCard />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </ThemeProvider>
    </Provider>
  )
}

export default App

