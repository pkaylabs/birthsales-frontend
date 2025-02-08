import { Link, useMatch, useNavigate } from "react-location";
import { Product, useProducts } from "../utils/ProductContext";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grow,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";

const ProductAdminDetails = () => {
  const navigate = useNavigate();
  const { params } = useMatch();
  const productId = Number(params.id);
  const products = useProducts();

  // Finding the product
  const product: Product | undefined = products.find((p) => p.id === productId);

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
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
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
              <Grid2 size={{ xs: 12, md: 6 }} sx={{border: "", padding: "5px", borderRadius: "", backgroundColor: ""}}>
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
    </Box>
  );
};

export default ProductAdminDetails;
