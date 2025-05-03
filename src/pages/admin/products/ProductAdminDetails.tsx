import { Link, useMatch, useNavigate } from "react-location";
import { Product, useProducts } from "../utils/ProductContext";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grow,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useState } from "react";

// interface Product {
//   id: number;
//   name: string;
//   image?: string;
//   additionalImages?: string[];
//   category: string;
//   price: string | number;
//   dateAdded: string;
//   quantity: string | number;
//   stock?: number;
//   sales?: number;
//   revenue?: number;
//   status?: "pending" | "approved";
// }

const ProductAdminDetails = () => {
  const [role, setRole] = useState("admin");
  const [isApproving, setIsApproving] = useState(false) // Mock role, replace with actual role from Redux or context
  const navigate = useNavigate();
  const { params } = useMatch();
  const productId = Number(params.id);
  // const { data: products = [] } = useGetProductsQuery();
  const products = useProducts();

  // Finding the product
  const product: Product | undefined = products.find((p) => p.id === productId);

  // RTK Query mutation for approving
  // const [approveProduct, { isLoading: isApproving, isSuccess }] =
  // useApproveProductMutation();
  const approveProduct = async (productId: number) => {
    console.log("Approving product with ID:", productId);
    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // After the API call, you can update the product status in your state or refetch the products
    setIsApproving(false);
  }



  if (!product)
    return (
      <Box p={4}>
        <Typography variant="h5">Product not found</Typography>
        <Button component={Link} to="/admin" variant="contained" sx={{ mt: 2 }}>
          Back
        </Button>
      </Box>
    );

  return (
    <Box p={4} sx={{ paddingTop: "2px" }}>
      <Button
        onClick={() => navigate({ to: "/products" })}
        variant="contained"
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      <Grow in timeout={1000}>
        <Card sx={{ paddingLeft: "10px" }}>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>
              {/* Approval Button */}
              {role === "admin" && product.status === "pending" && (
                <Button
                  variant="contained"
                  color="primary"
                  // onClick={() => approveProduct({ id: product.id })}
                  onClick={() => approveProduct(123)}
                  disabled={isApproving}
                >
                  {isApproving ? <CircularProgress size={20} /> : "Approve"}
                </Button>
              )}
              {role === "admin" && product.status === "approved" && (
                <Button variant="outlined" disabled>
                  Approved
                </Button>
              )}
            </Stack>
            <Grid2 container spacing={4} sx={{ width: "100%" }}>
              {/* Left Column: Main Image */}
              <Grid2 size={{ xs: 12, md: 6 }} sx={{ backgroundColor: "" }}>
                <Box
                  component="img"
                  src={product.image}
                  alt={product.name}
                  sx={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "5px",
                    transition: "transform 0.5s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </Grid2>

              {/* Right Column: Product Details */}
              <Grid2
                size={{ xs: 12, md: 6 }}
                sx={{
                  border: "",
                  padding: "5px",
                  borderRadius: "",
                  backgroundColor: "",
                }}
              >
                <Typography variant="body1" gutterBottom>
                  <strong className="text-xl">Category:</strong>{" "}
                  <span className="text-base">{product.category}</span>
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong className="text-xl">Price:</strong>{" "}
                  <span className="text-base">${product.price}</span>
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong className="text-xl">Date Added:</strong>{" "}
                  <span className="text-base">{product.dateAdded}</span>
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong className="text-xl">Quantity:</strong>{" "}
                  <span className="text-base">{product.quantity}</span>
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong className="text-xl">Stock:</strong>{" "}
                  <span className="text-base">{product.stock}</span>
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong className="text-xl">Sales:</strong>{" "}
                  <span className="text-base">{product.sales}</span>
                </Typography>
                {/* <Typography variant="body1" gutterBottom>
                  <strong className="text-xl">Revenue:</strong> $
                  <span className="text-base">{product.revenue}</span>
                </Typography> */}
              </Grid2>

              {/* Additional Images Section */}
              {product.additionalImages &&
                product.additionalImages.length > 0 && (
                  <Grid2 size={{ xs: 12 }}>
                    <Typography variant="h6" gutterBottom>
                      Additional Images
                    </Typography>
                    <Grid2 container spacing={2}>
                      {product.additionalImages.map((imgUrl, index) => (
                        <Grid2 size={{ xs: 6, sm: 3 }} key={index}>
                          <Box
                            component={"img"}
                            src={imgUrl}
                            alt={`Additional ${index + 1}`}
                            sx={{
                              width: "100%",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "5px",
                              transition: "transform 0.5s ease-in-out",
                              "&:hover": {
                                transform: "scale(1.05)",
                              },
                            }}
                          />
                        </Grid2>
                      ))}
                    </Grid2>
                  </Grid2>
                )}
            </Grid2>
          </CardContent>
        </Card>
      </Grow>
        {/* Toast */}
            {/* <Snackbar
              open={toastOpen}
              autoHideDuration={3000}
              onClose={() => setToastOpen(false)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                onClose={() => setToastOpen(false)}
                severity={toastSeverity}
                sx={{ width: "100%" }}
              >
                {toastMessage}
              </Alert>
            </Snackbar> */}
    </Box>
  );
};

export default ProductAdminDetails;
