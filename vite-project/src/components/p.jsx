import React from "react";
import Navbar from "./Nav";
import Product from "./product";
import { product } from "../config";

import { Box, Typography, Grid } from "@mui/material";

function Productlist() {
  return (
    <>
      <Navbar />

      <Box sx={{ padding: { xs: 2, sm: 3, md: 4 } }}>
       
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          Product List
        </Typography>

    
        <Grid container spacing={3} justifyContent="center">
          {product.map((item) => (
            <Grid
              item
              key={item.id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              display="flex"
              justifyContent="center"
            >
              <Product item={item} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default Productlist;
