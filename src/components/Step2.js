import React from "react";
import { Grid, Slider, TextField, Typography } from "@material-ui/core";
const FormRow = ({ algorithm, index, process, processes, setProcesses }) => {
  let {
    arrivalTime,
    burstTime,
    capacity,
    deadline,
    period,
    pid,
    priorityNumber,
  } = process;
  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid alignItems="center" container justify="center" xs={1}>
          {`${pid}`}
        </Grid>
        <Grid item xs>
          <TextField
            fullWidth
            label={algorithm === "EDF" ? "Capacity" : "Arrival Time"}
            onChange={({ target }) => {
              if (algorithm === "EDF") process.capacity = +target.value;
              else process.arrivalTime = +target.value;
              setProcesses(
                processes.map((e, i) => (i === index ? process : e))
              );
            }}
            type="number"
            value={algorithm === "EDF" ? capacity : arrivalTime}
            variant="outlined"
          />
        </Grid>
        <Grid item xs>
          <TextField
            fullWidth
            label={algorithm === "EDF" ? "Deadline" : "Burst Time"}
            onChange={({ target }) => {
              if (algorithm === "EDF") process.deadline = +target.value;
              else process.burstTime = +target.value;
              setProcesses(
                processes.map((p, i) => (i === index ? process : p))
              );
            }}
            type="number"
            value={algorithm === "EDF" ? deadline : burstTime}
            variant="outlined"
          />
        </Grid>
        {(() => {
          if (algorithm === "EDF" || algorithm === "PRIO")
            return (
              <Grid item xs>
                <TextField
                  fullWidth
                  label={algorithm === "EDF" ? "Period" : "Priority Number"}
                  onChange={({ target }) => {
                    if (algorithm === "EDF") process.period = +target.value;
                    else process.priorityNumber = +target.value;
                    setProcesses(
                      processes.map((p, i) => (i === index ? process : p))
                    );
                  }}
                  type="number"
                  value={algorithm === "EDF" ? period : priorityNumber}
                  variant="outlined"
                />
              </Grid>
            );
        })()}
      </Grid>
    </Grid>
  );
};
const Step2 = ({
  algorithm,
  processes,
  processesQty,
  setProcesses,
  setProcessesQty,
}) => (
  <>
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <Typography align="center" gutterBottom>
          Number of processes
        </Typography>
      </Grid>
      <Grid item xs>
        <Slider
          marks
          max={9}
          min={2}
          onChange={(_, value) => setProcessesQty(value)}
          step={1}
          value={processesQty}
          valueLabelDisplay="auto"
        />
      </Grid>
    </Grid>
    <Grid container spacing={3}>
      {processes.slice(0, processesQty).map((element, index) => (
        <FormRow
          algorithm={algorithm}
          index={index}
          process={element}
          processes={processes}
          setProcesses={setProcesses}
        />
      ))}
    </Grid>
  </>
);
export default Step2;
