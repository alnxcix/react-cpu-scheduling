import React from "react";
import { Grid, Slider, Typography } from "@material-ui/core";
const CustomSlider = ({ label, setter, value }) => (
  <Grid container spacing={3}>
    <Grid item xs={4}>
      <Typography align="center" gutterBottom>
        {label}
      </Typography>
    </Grid>
    <Grid item xs>
      <Slider
        marks
        max={9}
        min={2}
        onChange={(_, value) => setter(value)}
        step={1}
        value={value}
        valueLabelDisplay="auto"
      />
    </Grid>
  </Grid>
);
export default CustomSlider;
