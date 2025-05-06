import React from "react";
import { Box, Alert, AlertTitle, Button } from "@mui/material";
import { useNavigate } from "react-location";

export const AccessDenied: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="60vh"
      textAlign="center"
      p={2}
    >
      <Alert severity="warning" sx={{ mb: 2, maxWidth: 400 }}>
        <AlertTitle>Access Denied</AlertTitle>
        You don’t have permission to view this page.
      </Alert>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate({ to: "/" })}
      >
        Go to Home
      </Button>
    </Box>
  );
};
