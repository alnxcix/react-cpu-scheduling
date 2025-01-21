import React, { useState } from "react";
import { cloneDeep } from "lodash";
import {
  Button,
  IconButton,
  makeStyles,
  Paper,
  Snackbar,
  StepLabel,
  Stepper,
  Step,
  Typography,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import Header from "./components/Header";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Footer from "./components/Footer";
import { EDF, FCFS, SJF, SRTF, PPRIO, PRIO } from "./algorithms";
const useStyles = makeStyles((theme) => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 750,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: { padding: theme.spacing(3, 0, 5) },
  buttons: { display: "flex", justifyContent: "flex-end" },
  button: { marginTop: theme.spacing(3), marginLeft: theme.spacing(1) },
}));
const App = () => {
  const classes = useStyles();
  const defaultProcesses = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((element) => ({
    pid: `P${element + 1}`,
  }));
  const steps = ["Select algorithm", "Setup processes", "View results"];
  const [activeStep, setActiveStep] = useState(0);
  const [algorithm, setAlgorithm] = useState();
  const [open, setOpen] = useState(false);
  const [processes, setProcesses] = useState(defaultProcesses);
  const [processesQty, setProcessesQty] = useState(2);
  const [snackbarMessage, setSnackbarMessage] = useState();
  const [timeQuantum, setTimeQuantum] = useState();
  const handleBack = () => setActiveStep(activeStep - 1);
  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };
  const handleNext = () => {
    switch (activeStep) {
      case 0:
        if (
          algorithm === undefined ||
          // TODO: RR and RRO to be included in the options yet
          ((algorithm === "RR" || algorithm === "RRO") &&
            timeQuantum === undefined)
        ) {
          setSnackbarMessage("Select an algorithm first.");
          setOpen(true);
        } else setActiveStep(activeStep + 1);
        break;
      case 1:
        if (
          (algorithm === "EDF" &&
            processes
              .slice(0, processesQty)
              .filter(
                (element) =>
                  element.capacity === undefined ||
                  element.deadline === undefined ||
                  element.period === undefined
              ).length > 0) ||
          (["FCFS", "SJF", "SRTF"].includes(algorithm) &&
            processes
              .slice(0, processesQty)
              .filter(
                (element) =>
                  element.arrivalTime === undefined &&
                  element.burstTime === undefined
              ).length > 0) ||
          ((algorithm === "PRIO" || algorithm === "P-PRIO") &&
            processes
              .slice(0, processesQty)
              .filter((element) => element.priorityNumber === undefined)
              .length > 0)
        ) {
          setSnackbarMessage("Fill up all required fields.");
          setOpen(true);
        } else setActiveStep(activeStep + 1);
        break;
      default:
        setActiveStep(activeStep + 1);
        break;
    }
  };
  const handleRestart = (event) => {
    event.preventDefault();
    setActiveStep(0);
    setAlgorithm();
    setProcesses(defaultProcesses);
    setProcessesQty(2);
    setTimeQuantum();
  };
  return (
    <>
      <Header />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            CPU Scheduling
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <>
            {(() =>
              activeStep === 0 ? (
                <Step1
                  algorithm={algorithm}
                  setAlgorithm={setAlgorithm}
                  timeQuantum={timeQuantum}
                />
              ) : activeStep === 1 ? (
                <Step2
                  algorithm={algorithm}
                  processes={processes}
                  processesQty={processesQty}
                  setProcesses={setProcesses}
                  setProcessesQty={setProcessesQty}
                />
              ) : (
                <Step3
                  results={
                    algorithm === "EDF"
                      ? EDF(cloneDeep(processes.slice(0, processesQty)))
                      : algorithm === "FCFS"
                      ? FCFS(cloneDeep(processes.slice(0, processesQty)))
                      : algorithm === "P-PRIO"
                      ? PPRIO(cloneDeep(processes.slice(0, processesQty)))
                      : algorithm === "PRIO"
                      ? PRIO(cloneDeep(processes.slice(0, processesQty)))
                      : algorithm === "SJF"
                      ? SJF(cloneDeep(processes.slice(0, processesQty)))
                      : SRTF(cloneDeep(processes.slice(0, processesQty)))
                  }
                />
              ))()}
            <div className={classes.buttons}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} className={classes.button}>
                  Back
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={
                  activeStep === steps.length - 1 ? handleRestart : handleNext
                }
                className={classes.button}
              >
                {activeStep === 2 ? "Start over" : "Next"}
              </Button>
            </div>
          </>
        </Paper>
        <Footer />
      </main>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};
export default App;
