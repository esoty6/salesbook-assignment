import {
  Box,
  Button,
  Container,
  Divider,
  Grid2,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useEffect, useState } from "react";
import "./App.css";
import {
  getExchangeRates,
  getHistoricalRates,
} from "./services/exchange.service";

interface ExchangeResponse {
  [key: string]: number;
}

interface HistoricalExchangeResponse {
  [key: string]: {
    [key: string]: number;
  };
}

function App() {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [conversionRates, setConversionRates] = useState<ExchangeResponse>();
  const [historicalData, setHistoricalData] =
    useState<HistoricalExchangeResponse>();

  const handleChange = async (currency: string) => {
    setSelectedCurrency(currency);

    const { rates } = await getHistoricalRates(currency);
    if (rates) {
      setHistoricalData({ ...rates });
    }
  };

  const fetchData = async () => {
    const { rates } = await getExchangeRates();
    if (rates) {
      setConversionRates({ ...rates });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container maxWidth="md">
      <Grid2 container spacing={8}>
        <Grid2 item>
          <Grid2 item xs={6}>
            <h3>Latest rates</h3>
          </Grid2>
          <Box
            sx={{
              width: 360,
              maxHeight: 400,
              overflowY: "auto",
            }}
          >
            <List>
              {conversionRates &&
                Object.keys(conversionRates).map((currency) => (
                  <ListItemText>
                    <ListItemButton
                      key={currency}
                      selected={currency === selectedCurrency}
                      onClick={() => handleChange(currency)}
                    >
                      <div className="justify-space-between">
                        <span>{currency}/PLN</span>
                        <span className="flex-end">
                          {(1 / conversionRates[currency]).toPrecision(5)}
                        </span>
                      </div>
                    </ListItemButton>
                    <Divider
                      flexItem
                      sx={{ backgroundColor: "background.paper" }}
                    />
                  </ListItemText>
                ))}
            </List>
          </Box>
        </Grid2>
        <Grid2 item>
          <Grid2 item xs={6}>
            <h3>Historical rates since last monday</h3>
            {selectedCurrency && <h4>{selectedCurrency}/PLN</h4>}
          </Grid2>
          <Box
            sx={{
              width: 360,
              maxHeight: 400,
              overflowY: "auto",
            }}
          >
            <List>
              {!!selectedCurrency &&
                !!historicalData &&
                historicalData[Object.keys(historicalData)[0]][
                  selectedCurrency
                ] &&
                Object.keys(historicalData).map((day) => {
                  return (
                    <ListItemText sx={{ padding: "0 16px" }}>
                      <div key={day} className="justify-space-between">
                        <span>{day}</span>
                        <span>
                          {(
                            1 / historicalData[day][selectedCurrency]
                          ).toPrecision(5)}
                        </span>
                      </div>
                      <Divider
                        flexItem
                        sx={{ backgroundColor: "background.paper" }}
                      />
                    </ListItemText>
                  );
                })}
            </List>
          </Box>
        </Grid2>
      </Grid2>

      <Divider flexItem />

      <Button sx={{ margin: 8 }} variant="contained" onClick={fetchData}>
        Refresh data
      </Button>
    </Container>
  );
}

export default App;
