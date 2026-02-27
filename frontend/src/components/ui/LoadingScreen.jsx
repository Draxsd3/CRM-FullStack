import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingScreen = ({ message = "Carregando...", fullScreen = false }) => {
  return (
    <Box
      sx={{
        minHeight: fullScreen ? "100vh" : 260,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        borderRadius: fullScreen ? 0 : 3,
        background:
          "radial-gradient(circle at 20% 20%, rgba(14,165,233,0.18), transparent 38%), radial-gradient(circle at 80% 70%, rgba(37,99,235,0.18), transparent 38%), #f8fbff"
      }}
     
    >
      <Box
        sx={{
          textAlign: "center",
          px: 3,
          py: 2
        }}
      >
        <CircularProgress size={38} thickness={4.2} />
        <Typography sx={{ mt: 2, fontWeight: 600, color: "text.secondary" }}>
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingScreen;
