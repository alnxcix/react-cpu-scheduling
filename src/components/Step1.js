import React from "react";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import CustomSlider from "./CustomSlider";

const FormRow = ({ algorithm, index, mlqAlgorithms, setMlqAlgorithms }) => {
  let { mode, timeQuantum } = algorithm;
  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item xs>
          <FormControl fullWidth variant="outlined">
            <InputLabel>{`Queue #0${index + 1}`}</InputLabel>
            <Select
              value={mode}
              onChange={({ target }) => {
                algorithm.mode = target.value;
                setMlqAlgorithms(
                  mlqAlgorithms.map((e, i) => (i === index ? algorithm : e))
                );
              }}
              label={`Queue #0${index + 1}`}
            >
              <MenuItem value="FCFS">First-Come First-Serve</MenuItem>
              <MenuItem value="SJF">Shortest Job First</MenuItem>
              <MenuItem value="SRTF">Shortest Remaining Time First</MenuItem>
              <MenuItem value="PRIO">Priority</MenuItem>
              <MenuItem value="P-PRIO">Preemptive Priority</MenuItem>
              <MenuItem value="RR">Round Robin</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {(() => {
          if (mode === "RR")
            return (
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Time Quantum"
                  onChange={({ target }) => {
                    algorithm.timeQuantum = +target.value;
                    setMlqAlgorithms(
                      mlqAlgorithms.map((e, i) => (i === index ? algorithm : e))
                    );
                  }}
                  type="number"
                  value={timeQuantum}
                  variant="outlined"
                />
              </Grid>
            );
        })()}
      </Grid>
    </Grid>
  );
};

const Step1 = ({
  algorithm,
  mlqAlgorithms,
  mlqAlgorithmsQty,
  setAlgorithm,
  setMlqAlgorithms,
  setMlqAlgorithmsQty,
}) => (
  <>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Algorithm</InputLabel>
          <Select
            value={algorithm}
            onChange={({ target }) => setAlgorithm(target.value)}
            label="Algorithm"
          >
            <MenuItem value="FCFS">First-Come First-Serve</MenuItem>
            <MenuItem value="SJF">Shortest Job First</MenuItem>
            <MenuItem value="PRIO">Priority</MenuItem>
            <MenuItem value="EDF">Earliest Deadline First</MenuItem>
            <MenuItem value="MLQ">Multi-level Queue</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
    {(() => {
      if (algorithm === "MLQ")
        return (
          <>
            <CustomSlider
              label="Number of multi-level queues"
              setter={setMlqAlgorithmsQty}
              value={mlqAlgorithmsQty}
            />
            <Grid container spacing={3}>
              {mlqAlgorithms
                .slice(0, mlqAlgorithmsQty)
                .map((element, index) => (
                  <FormRow
                    algorithm={element}
                    index={index}
                    mlqAlgorithms={mlqAlgorithms}
                    setMlqAlgorithms={setMlqAlgorithms}
                  />
                ))}
            </Grid>
          </>
        );
    })()}
  </>
);
export default Step1;
