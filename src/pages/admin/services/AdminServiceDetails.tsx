import React from "react";
import { useServices } from "../utils/ServiceContext";
import { useMatch, useNavigate } from "react-location";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grow,
  Typography,
} from "@mui/material";

const AdminServiceDetails = () => {
  const navigate = useNavigate();
  const { params } = useMatch();
  const serviceId = Number(params.id);
  const services = useServices();

  const service = services.find((s) => s.id === serviceId);

  console.log(service);

  if (!service) {
    return (
      <div style={{ padding: "2rem" }}>
        <Typography variant="h5">Service not found</Typography>
        <Button
          variant="contained"
          onClick={() => navigate({ to: "/admin-services" })}
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <Grow in timeout={1000}>
        <Card>
          <CardContent>
            {service.image && (
              <Box
                component="img"
                src={service.image}
                alt={service.name}
                sx={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "cover",
                  borderRadius: "5px",
                  transition: "transform 0.5s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.02)",
                  },
                }}
              />
            )}
            <Typography variant="h4" gutterBottom style={{}}>
              {service.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {service.description}
            </Typography>
            <Typography variant="h6">Price: ₵{service.price}</Typography>
            <Typography variant="body2">
              Provider: {service.provider}
            </Typography>
            <Typography variant="body2">
              Category: {service.category}
            </Typography>
            <Typography variant="body2">
              Bookings: {service.bookings}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "1rem" }}
              onClick={() => history.back()}
            >
              Back
            </Button>
          </CardContent>
        </Card>
      </Grow>
    </div>
  );
};

export default AdminServiceDetails;
