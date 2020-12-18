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
import { FCFS, SJF, PRIO, EDF, MLQ } from "./algorithms";
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
const steps = ["Select algorithm", "Setup processes", "View results"];
const App = () => {
  const defaultAlgorithm = "FCFS";
  const defaultMlqAlgorithms = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(() => ({
    mode: defaultAlgorithm,
  }));
  const defaultProcesses = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((element) => ({
    pid: `P${element + 1}`,
    assignedQueueNumber: 0,
  }));
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [algorithm, setAlgorithm] = useState(defaultAlgorithm);
  const [mlqAlgorithms, setMlqAlgorithms] = useState(defaultMlqAlgorithms);
  const [mlqAlgorithmsQty, setMlqAlgorithmsQty] = useState(2);
  const [open, setOpen] = useState(false);
  const [processesQty, setProcessesQty] = useState(2);
  const [processes, setProcesses] = useState(defaultProcesses);
  const handleNext = () => {
    switch (activeStep) {
      case 0:
        if (
          algorithm === "MLQ" &&
          mlqAlgorithms.filter(
            (element) =>
              element.mode === "RR" && element.timeQuantum === undefined
          ).length > 0
        )
          setOpen(true);
        else setActiveStep(activeStep + 1);
        break;
      case 1:
        if (
          (algorithm === "FCFS" || algorithm === "SJF") &&
          processes
            .slice(0, processesQty)
            .filter(
              (element) =>
                element.arrivalTime === undefined ||
                element.burstTime === undefined
            ).length > 0
        )
          setOpen(true);
        else if (
          algorithm === "PRIO" &&
          processes
            .slice(0, processesQty)
            .filter(
              (element) =>
                element.arrivalTime === undefined ||
                element.burstTime === undefined ||
                element.priorityNumber === undefined
            ).length > 0
        )
          setOpen(true);
        else if (
          algorithm === "EDF" &&
          processes
            .slice(0, processesQty)
            .filter(
              (element) =>
                element.capacity === undefined ||
                element.deadline === undefined ||
                element.period === undefined
            ).length > 0
        )
          setOpen(true);
        else if (algorithm === "MLQ") {
          if (
            processes
              .slice(0, processesQty)
              .filter(
                (element) =>
                  (mlqAlgorithms[element.assignedQueueNumber].mode === "FCFS" ||
                    mlqAlgorithms[element.assignedQueueNumber].mode === "SJF" ||
                    mlqAlgorithms[element.assignedQueueNumber].mode ===
                      "SRTF" ||
                    mlqAlgorithms[element.assignedQueueNumber].mode === "RR") &&
                  (element.arrivalTime === undefined ||
                    element.burstTime === undefined ||
                    element.assignedQueueNumber >= mlqAlgorithmsQty)
              ).length > 0
          )
            setOpen(true);
          else if (
            processes
              .slice(0, processesQty)
              .filter(
                (element) =>
                  (mlqAlgorithms[element.assignedQueueNumber].mode === "PRIO" ||
                    mlqAlgorithms[element.assignedQueueNumber].mode ===
                      "P-PRIO") &&
                  (element.arrivalTime === undefined ||
                    element.burstTime === undefined ||
                    element.priorityNumber === undefined ||
                    element.assignedQueueNumber >= mlqAlgorithmsQty)
              ).length > 0
          )
            setOpen(true);
          else setActiveStep(activeStep + 1);
        } else setActiveStep(activeStep + 1);
        break;
      default:
        setActiveStep(activeStep + 1);
        break;
    }
  };
  const handleBack = () => setActiveStep(activeStep - 1);
  const handleRestart = (event) => {
    event.preventDefault();
    setActiveStep(0);
    setAlgorithm(defaultAlgorithm);
    setMlqAlgorithms(defaultMlqAlgorithms);
    setMlqAlgorithmsQty(2);
    setProcesses(defaultProcesses);
    setProcessesQty(2);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Step1
            algorithm={algorithm}
            mlqAlgorithms={mlqAlgorithms}
            mlqAlgorithmsQty={mlqAlgorithmsQty}
            setAlgorithm={setAlgorithm}
            setMlqAlgorithms={setMlqAlgorithms}
            setMlqAlgorithmsQty={setMlqAlgorithmsQty}
          />
        );
      case 1:
        return (
          <Step2
            algorithm={algorithm}
            mlqAlgorithms={mlqAlgorithms}
            mlqAlgorithmsQty={mlqAlgorithmsQty}
            processes={processes}
            processesQty={processesQty}
            setProcesses={setProcesses}
            setProcessesQty={setProcessesQty}
          />
        );
      default:
        return (
          <Step3
            results={
              algorithm === "FCFS"
                ? FCFS(cloneDeep(processes.slice(0, processesQty)))
                : algorithm === "SJF"
                ? SJF(cloneDeep(processes.slice(0, processesQty)))
                : algorithm === "PRIO"
                ? PRIO(cloneDeep(processes.slice(0, processesQty)))
                : algorithm === "EDF"
                ? EDF(cloneDeep(processes.slice(0, processesQty)))
                : MLQ(
                    cloneDeep(processes.slice(0, processesQty)),
                    cloneDeep(mlqAlgorithms).slice(0, mlqAlgorithmsQty)
                  )
            }
          />
        );
    }
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
            {getStepContent(activeStep)}
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
        message="Fill up all required fields."
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
