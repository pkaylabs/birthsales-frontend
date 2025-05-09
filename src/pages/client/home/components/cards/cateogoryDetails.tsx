
// import React from "react";
// import { useMatch, Link } from "react-location";
// import { Box, CircularProgress, Typography, Button } from "@mui/material";

// export default function CategoryDetails() {
//   const {
//     params: { id },
//   } = useMatch();
//   const catId = Number(id);
//   const { data: category, isLoading, isError } = useGetCategoryQuery(catId);

//   if (isLoading) {
//     return (
//       <Box className="p-8 flex justify-center">
//         <CircularProgress />
//       </Box>
//     );
//   }
//   if (isError || !category) {
//     return (
//       <Box className="p-8 text-red-500 text-center">
//         Unable to load category #{catId}.
//       </Box>
//     );
//   }

//   return (
//     <main className="max-w-4xl mx-auto px-4 py-8">
//       {/* Breadcrumb */}
//       <nav className="text-gray-500 text-sm mb-6" aria-label="Breadcrumb">
//         <ol className="flex space-x-2">
//           <li>
//             <Link to="/">Home</Link>
//           </li>
//           <li>/</li>
//           <li>
//             <Link to="/categories">Categories</Link>
//           </li>
//           <li>/</li>
//           <li className="font-semibold text-gray-900">{category.name}</li>
//         </ol>
//       </nav>

//       {/* Category Info */}
//       <header className="mb-8">
//         <Typography variant="h4" component="h1" className="font-bold">
//           {category.name}
//         </Typography>
//         <Typography variant="body1" color="textSecondary" className="mt-2">
//           {category.description}
//         </Typography>
//       </header>

//       {/* You can list products in this category */}
//       <section>
//         <Typography variant="h6" gutterBottom>
//           Products in “{category.name}”
//         </Typography>
//         {/* TODO: map over category.products and render ProductCard */}
//       </section>

//       <Box className="mt-6">
//         <Button variant="outlined" component={Link} to="/categories">
//           Back to all categories
//         </Button>
//       </Box>
//     </main>
//   );
// }
