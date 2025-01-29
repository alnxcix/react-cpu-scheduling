import React from "react";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
const Step1 = ({ algorithm, setAlgorithm }) => (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <FormControl fullWidth variant="outlined">
        <InputLabel>Algorithm</InputLabel>
        <Select
          value={algorithm}
          onChange={({ target }) => setAlgorithm(target.value)}
          label="Algorithm"
        >
          <MenuItem value="EDF">Earliest Deadline First</MenuItem>
          <MenuItem value="FCFS">First-Come First-Serve</MenuItem>
          <MenuItem value="PRIO">Priority</MenuItem>
          <MenuItem value="SJF">Shortest Job First</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  </Grid>
);
export default Step1;
