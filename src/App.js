import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";
import { omadaTheme, FilterProvider } from "omada-prototype-toolkit";
import OwnershipTable from "./components/OwnershipTable";

function App() {
  return (
    <ThemeProvider theme={omadaTheme}>
      <CssBaseline />
      <FilterProvider>
        <Box sx={{ bgcolor: "background.default", height: "100vh", display: "flex" }}>
          {/* Left Sidebar - Omada Menu */}
          <Box
            sx={{
              width: 220,
              flexShrink: 0,
              bgcolor: "#002838",
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <img
              src="/omada-menu.png"
              alt="Omada Menu"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </Box>

          {/* Main Content Area */}
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <AppBar
              position="sticky"
              elevation={0}
              sx={{ bgcolor: "background.default", color: "text.primary" }}
            >
              <Toolbar sx={{ minHeight: "64px !important", pl: { xs: 2, md: 6 }, pr: { xs: 2, md: 3 } }}>
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                  Assisted Ownership Transfer - Omada Identity Cloud
                </Typography>
              </Toolbar>
            </AppBar>

            <Box
              component="main"
              sx={{ flex: 1, minHeight: 0, bgcolor: "background.default", overflow: "hidden" }}
            >
              <OwnershipTable />
            </Box>
          </Box>
        </Box>
      </FilterProvider>
    </ThemeProvider>
  );
}

export default App;
