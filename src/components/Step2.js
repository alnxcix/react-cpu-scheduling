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
const FormRow = ({
  algorithm,
  index,
  mlqAlgorithms,
  mlqAlgorithmsQty,
  process,
  processes,
  setProcesses,
}) => {
  let {
    arrivalTime,
    burstTime,
    capacity,
    deadline,
    period,
    pid,
    priorityNumber,
    assignedQueueNumber,
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
          if (
            algorithm === "PRIO" ||
            algorithm === "EDF" ||
            (algorithm === "MLQ" &&
              mlqAlgorithms[assignedQueueNumber].mode === "PRIO")
          )
            return (
              <Grid item xs>
                <TextField
                  fullWidth
                  label={
                    algorithm === "PRIO" ||
                    (algorithm === "MLQ" &&
                      mlqAlgorithms[assignedQueueNumber].mode === "PRIO")
                      ? "Priority"
                      : "Period"
                  }
                  onChange={({ target }) => {
                    if (
                      algorithm === "PRIO" ||
                      (algorithm === "MLQ" &&
                        mlqAlgorithms[assignedQueueNumber].mode === "PRIO")
                    )
                      process.priorityNumber = +target.value;
                    else process.period = +target.value;
                    setProcesses(
                      processes.map((p, i) => (i === index ? process : p))
                    );
                  }}
                  type="number"
                  value={
                    algorithm === "PRIO" ||
                    (algorithm === "MLQ" &&
                      mlqAlgorithms[assignedQueueNumber].mode === "PRIO")
                      ? priorityNumber
                      : period
                  }
                  variant="outlined"
                />
              </Grid>
            );
        })()}
        {(() => {
          if (algorithm === "MLQ") {
            return (
              <Grid item xs>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Assigned Queue Number</InputLabel>
                  <Select
                    value={
                      assignedQueueNumber >= mlqAlgorithmsQty
                        ? null
                        : assignedQueueNumber
                    }
                    onChange={({ target }) => {
                      process.assignedQueueNumber = +target.value;
                      setProcesses(
                        processes.map((e, i) => (i === index ? process : e))
                      );
                    }}
                    label="Assigned Queue Number"
                  >
                    {mlqAlgorithms.slice(0, mlqAlgorithmsQty).map((_, i) => (
                      <MenuItem value={i}>{`Queue #0${i + 1}`}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            );
          }
        })()}
      </Grid>
    </Grid>
  );
};
const Step2 = ({
  algorithm,
  mlqAlgorithms,
  mlqAlgorithmsQty,
  processes,
  processesQty,
  setProcesses,
  setProcessesQty,
}) => (
  <>
    <CustomSlider
      label="Number of processes"
      setter={setProcessesQty}
      value={processesQty}
    />
    <Grid container spacing={3}>
      {processes.slice(0, processesQty).map((element, index) => (
        <FormRow
          algorithm={algorithm}
          index={index}
          mlqAlgorithms={mlqAlgorithms}
          mlqAlgorithmsQty={mlqAlgorithmsQty}
          process={element}
          processes={processes}
          setProcesses={setProcesses}
        />
      ))}
    </Grid>
  </>
);
export default Step2;
