import { getLCM } from "./utils";

export const EDF = (processes) => {
  let lcm = getLCM(processes.map(({ period }) => period));
  processes.map((element) => {
    element.remainingCapacity = element.capacity;
    element.currentDeadline = element.deadline;
    element.currentPeriod = 0;
    return element;
  });
  for (let time = 0; time < lcm; time++) {
    let queue = processes.filter(
      ({ currentDeadline, currentPeriod, remainingCapacity }) =>
        currentDeadline >= time &&
        currentPeriod <= time &&
        remainingCapacity > 0
    );
    if (queue.length > 0) {
      let currentProcess = queue.sort((a, b) =>
        a.currentDeadline < b.currentDeadline
          ? -1
          : a.currentDeadline > b.currentDeadline
          ? 1
          : a.pid < b.pid
          ? -1
          : a.pid > b.pid
          ? 1
          : 0
      )[0];
      if (currentProcess.startingTime === undefined)
        currentProcess.startingTime = time;
      currentProcess.remainingCapacity--;
      if (currentProcess.remainingCapacity === 0) {
        currentProcess.currentPeriod += currentProcess.period;
        currentProcess.currentDeadline += currentProcess.period;
        currentProcess.remainingCapacity = currentProcess.capacity;
        if (currentProcess.currentDeadline >= lcm)
          currentProcess.completionTime = time + 1;
      }
    }
  }
  return processes;
};

export const FCFS = (processes) =>
  processes
    .sort((a, b) =>
      a.arrivalTime < b.arrivalTime ? -1 : a.arrivalTime > b.arrivalTime ? 1 : 0
    )
    .map((element, index, array) => {
      element.startingTime = index =
        index > 0 && element.arrivalTime < array[index - 1].completionTime
          ? array[index - 1].completionTime
          : element.arrivalTime;
      element.completionTime = element.startingTime + element.burstTime;
      element.turnAroundTime = element.completionTime - element.arrivalTime;
      element.waitingTime = element.turnAroundTime - element.burstTime;
      return element;
    })
    .sort((a, b) => (a.pid < b.pid ? -1 : a.pid > b.pid ? 1 : 0));

export const PRIO = (processes) => {
  let time = 0;
  while (processes.filter(({ isDone }) => isDone === undefined).length > 0) {
    let queue = processes.filter(
      // eslint-disable-next-line
      ({ arrivalTime, isDone }) => arrivalTime <= time && isDone === undefined
    );
    if (queue.length > 0) {
      let currentProcess = queue.sort((a, b) =>
        a.priorityNumber < b.priorityNumber
          ? -1
          : a.priorityNumber > b.priorityNumber
          ? 1
          : a.arrivalTime < b.arrivalTime
          ? -1
          : a.arrivalTime > b.arrivalTime
          ? 1
          : 0
      )[0];
      currentProcess.startingTime = time;
      currentProcess.completionTime =
        currentProcess.startingTime + currentProcess.burstTime;
      currentProcess.turnAroundTime =
        currentProcess.completionTime - currentProcess.arrivalTime;
      currentProcess.waitingTime =
        currentProcess.turnAroundTime - currentProcess.burstTime;
      currentProcess.isDone = true;
      time = currentProcess.completionTime;
    } else time++;
  }
  return processes;
};

export const SJF = (processes) => {
  let time = 0;
  while (processes.filter(({ isDone }) => isDone === undefined).length > 0) {
    let queue = processes.filter(
      // eslint-disable-next-line
      ({ arrivalTime, isDone }) => arrivalTime <= time && isDone === undefined
    );
    if (queue.length > 0) {
      let currentProcess = queue.sort((a, b) =>
        a.burstTime < b.burstTime
          ? -1
          : a.burstTime > b.burstTime
          ? 1
          : a.arrivalTime < b.arrivalTime
          ? -1
          : a.arrivalTime > b.arrivalTime
          ? 1
          : 0
      )[0];
      currentProcess.startingTime = time;
      currentProcess.completionTime =
        currentProcess.startingTime + currentProcess.burstTime;
      currentProcess.turnAroundTime =
        currentProcess.completionTime - currentProcess.arrivalTime;
      currentProcess.waitingTime =
        currentProcess.turnAroundTime - currentProcess.burstTime;
      currentProcess.isDone = true;
      time = currentProcess.completionTime;
    } else time++;
  }
  return processes;
};

// ** Preemptive - Do not use **
export const SRTF = (processes) => {
  processes.map((element) => {
    element.remainingBurstTime = element.burstTime;
    return element;
  });
  for (
    let time = 0;
    processes.filter(({ remainingBurstTime }) => remainingBurstTime > 0)
      .length > 0;
    time++
  ) {
    let queue = processes.filter(
      ({ arrivalTime, remainingBurstTime }) =>
        arrivalTime <= time && remainingBurstTime > 0
    );
    if (queue.length > 0) {
      let process = processes
        .filter(
          ({ arrivalTime, remainingBurstTime }) =>
            arrivalTime <= time && remainingBurstTime > 0
        )
        .sort((a, b) =>
          a.remainingBurstTime < b.remainingBurstTime
            ? -1
            : a.remainingBurstTime > b.remainingBurstTime
            ? 1
            : a.arrivalTime < b.arrivalTime
            ? -1
            : a.arrivalTime > b.arrivalTime
            ? 1
            : 0
        )[0];
      if (process.startingTime === undefined) process.startingTime = time;
      process.completionTime = time + 1;
      process.turnAroundTime = process.completionTime - process.arrivalTime;
      process.waitingTime = process.turnAroundTime - process.burstTime;
      process.responseTime = process.startingTime - process.arrivalTime;
      process.remainingBurstTime -= 1;
    }
  }
  return processes;
};

// ** Preemptive - Do not use **
export const PPRIO = (processes) => {
  let time = 0;
  let completed = 0;
  const n = processes.length;

  // Initialize results
  processes.forEach((process) => {
    process.remainingTime = process.burstTime; // Initialize remaining time
    process.startingTime = -1; // Initialize start time
  });

  while (completed < n) {
    // Select the process with the highest priority at the current time
    let currentProcess = null;
    // eslint-disable-next-line
    processes.forEach((process) => {
      if (
        process.arrivalTime <= time &&
        process.remainingTime > 0 &&
        (currentProcess === null || process.priority < currentProcess.priority)
      ) {
        currentProcess = process;
      }
    });

    if (currentProcess) {
      // Update the start time
      if (currentProcess.startingTime === -1) {
        currentProcess.startingTime = time;
      }

      // Process the task for one unit of time
      currentProcess.remainingTime -= 1;
      time++;

      // Check if the process is completed
      if (currentProcess.remainingTime === 0) {
        currentProcess.completionTime = time;
        currentProcess.turnAroundTime =
          currentProcess.completionTime - currentProcess.arrivalTime;
        currentProcess.waitingTime =
          currentProcess.turnAroundTime - currentProcess.burstTime;

        completed++;
      }
    } else {
      // If no process is available, move forward in time
      time++;
    }
  }

  // Return the updated processes array
  return processes.map((process) => ({
    pid: process.pid,
    arrivalTime: process.arrivalTime,
    burstTime: process.burstTime,
    priority: process.priority,
    startingTime: process.startingTime,
    completionTime: process.completionTime,
    turnAroundTime: process.turnAroundTime,
    waitingTime: process.waitingTime,
  }));
};

// this code still kinda sus - Do not use
export const MLQ = (processes, mlqs) => {
  let runningProcess;
  processes.map((element) => {
    element.timeOfNextEnqueue = element.arrivalTime;
    element.burstLeft = element.burstTime;
    return element;
  });
  for (
    let time = 0;
    processes.filter((element) => element.isDone === undefined).length > 0;
    time++
  ) {
    let queue = processes.filter(
      (element) =>
        element.isDone === undefined && element.timeOfNextEnqueue <= time
    );
    queue = queue.filter(
      (element) =>
        element.assignedQueueNumber ===
        Math.min.apply(
          Math,
          queue.map((element) => element.assignedQueueNumber)
        )
    );
    if (queue.length > 0) {
      let activeAlgorithm = mlqs[queue[0].assignedQueueNumber];

      if (activeAlgorithm.mode === "FCFS") {
        let electedProcess = queue.sort((a, b) =>
          a.timeOfNextEnqueue < b.timeOfNextEnqueue
            ? -1
            : a.timeOfNextEnqueue > b.timeOfNextEnqueue
            ? 1
            : 0
        )[0];
        if (runningProcess === undefined) runningProcess = electedProcess;
        if (runningProcess.pid !== electedProcess.pid) {
          runningProcess.timeOfNextEnqueue = time + 1;
          runningProcess = electedProcess;
        }
        if (runningProcess.startingTime === undefined)
          runningProcess.startingTime = time;
        runningProcess.burstLeft -= 1;
        if (runningProcess.burstLeft === 0) {
          runningProcess.completionTime = time + 1;
          runningProcess.turnAroundTime =
            runningProcess.completionTime - runningProcess.arrivalTime;
          runningProcess.waitingTime =
            runningProcess.turnAroundTime - runningProcess.burstTime;
          runningProcess.isDone = true;
          runningProcess = () => {
            return;
          };
        } else runningProcess.timeOfNextEnqueue = time + 1;
      } else if (activeAlgorithm.mode === "SJF") {
        let q = queue.sort((a, b) =>
          a.burstTime < b.burstTime
            ? -1
            : a.burstTime > b.burstTime
            ? 1
            : a.timeOfNextEnqueue < b.timeOfNextEnqueue
            ? -1
            : a.timeOfNextEnqueue > b.timeOfNextEnqueue
            ? 1
            : 0
        );
        let electedProcess =
          q.find((element) => element.isRunning === true) === undefined
            ? q[0]
            : q.find((element) => element.isRunning === true);
        if (runningProcess === undefined) runningProcess = electedProcess;
        if (runningProcess.pid !== electedProcess.pid) {
          runningProcess.timeOfNextEnqueue = time + 1;
          runningProcess = electedProcess;
        }
        if (runningProcess.startingTime === undefined)
          runningProcess.startingTime = time;
        if (runningProcess.isRunning === undefined)
          runningProcess.isRunning = true;
        runningProcess.burstLeft -= 1;
        if (runningProcess.burstLeft === 0) {
          runningProcess.completionTime = time + 1;
          runningProcess.turnAroundTime =
            runningProcess.completionTime - runningProcess.arrivalTime;
          runningProcess.waitingTime =
            runningProcess.turnAroundTime - runningProcess.burstTime;
          runningProcess.isDone = true;
          runningProcess = () => {
            return;
          };
        } else runningProcess.timeOfNextEnqueue = time + 1;
      } else if (activeAlgorithm.mode === "SRTF") {
        let q = queue.sort((a, b) =>
          a.burstLeft < b.burstLeft
            ? -1
            : a.burstLeft > b.burstLeft
            ? 1
            : a.timeOfNextEnqueue < b.timeOfNextEnqueue
            ? -1
            : a.timeOfNextEnqueue > b.timeOfNextEnqueue
            ? 1
            : 0
        );
        if (runningProcess === undefined) runningProcess = q[0];
        if (runningProcess.pid !== q[0].pid) {
          runningProcess.timeOfNextEnqueue = time + 1;
          runningProcess = q[0];
        }
        if (runningProcess.startingTime === undefined)
          runningProcess.startingTime = time;
        runningProcess.burstLeft -= 1;
        if (runningProcess.burstLeft === 0) {
          runningProcess.completionTime = time + 1;
          runningProcess.turnAroundTime =
            runningProcess.completionTime - runningProcess.arrivalTime;
          runningProcess.waitingTime =
            runningProcess.turnAroundTime - runningProcess.burstTime;
          runningProcess.isDone = true;
          runningProcess = () => {
            return;
          };
        } else runningProcess.timeOfNextEnqueue = time + 1;
      } else if (activeAlgorithm.mode === "PRIO") {
        let q = queue.sort((a, b) =>
          a.priorityNumber < b.priorityNumber
            ? -1
            : a.priorityNumber > b.priorityNumber
            ? 1
            : a.timeOfNextEnqueue < b.timeOfNextEnqueue
            ? -1
            : a.timeOfNextEnqueue > b.timeOfNextEnqueue
            ? 1
            : 0
        );
        let electedProcess =
          q.find((element) => element.isRunning === true) === undefined
            ? q[0]
            : q.find((element) => element.isRunning === true);
        if (runningProcess === undefined) runningProcess = electedProcess;
        if (runningProcess.pid !== electedProcess.pid) {
          runningProcess.timeOfNextEnqueue = time + 1;
          runningProcess = electedProcess;
        }
        if (runningProcess.startingTime === undefined)
          runningProcess.startingTime = time;
        if (runningProcess.isRunning === undefined)
          runningProcess.isRunning = true;
        runningProcess.burstLeft -= 1;
        if (runningProcess.burstLeft === 0) {
          runningProcess.completionTime = time + 1;
          runningProcess.turnAroundTime =
            runningProcess.completionTime - runningProcess.arrivalTime;
          runningProcess.waitingTime =
            runningProcess.turnAroundTime - runningProcess.burstTime;
          runningProcess.isDone = true;
          runningProcess = () => {
            return;
          };
        } else runningProcess.timeOfNextEnqueue = time + 1;
      } else if (activeAlgorithm.mode === "P-PRIO") {
        let q = queue.sort((a, b) =>
          a.priorityNumber < b.priorityNumber
            ? -1
            : a.priorityNumber > b.priorityNumber
            ? 1
            : a.timeOfNextEnqueue < b.timeOfNextEnqueue
            ? -1
            : a.timeOfNextEnqueue > b.timeOfNextEnqueue
            ? 1
            : 0
        );
        if (runningProcess === undefined) runningProcess = q[0];
        if (runningProcess.pid !== q[0].pid) {
          runningProcess.timeOfNextEnqueue = time + 1;
          runningProcess = q[0];
        }
        if (runningProcess.startingTime === undefined)
          runningProcess.startingTime = time;
        runningProcess.burstLeft -= 1;
        if (runningProcess.burstLeft === 0) {
          runningProcess.completionTime = time + 1;
          runningProcess.isDone = true;
          runningProcess = () => {
            return;
          };
        } else runningProcess.timeOfNextEnqueue = time + 1;
      } else if (activeAlgorithm.mode === "RR") {
        // TODO: RR to be included in the options
        let electedProcess = queue.sort((a, b) =>
          a.timeOfNextEnqueue < b.timeOfNextEnqueue
            ? -1
            : a.timeOfNextEnqueue > b.timeOfNextEnqueue
            ? 1
            : 0
        )[0];
        if (runningProcess === undefined) runningProcess = electedProcess;
        if (runningProcess.pid !== electedProcess.pid) {
          runningProcess.timeOfNextEnqueue = time + 1;
          runningProcess.quantumTimeLeft = activeAlgorithm.timeQuantum - 1;
          runningProcess = electedProcess;
        }
        if (runningProcess.startingTime === undefined)
          runningProcess.startingTime = time;
        if (runningProcess.quantumTimeLeft === undefined)
          runningProcess.quantumTimeLeft = activeAlgorithm.timeQuantum;
        runningProcess.burstLeft -= 1;
        runningProcess.quantumTimeLeft -= 1;
        if (runningProcess.burstLeft === 0) {
          runningProcess.completionTime = time + 1;
          runningProcess.turnAroundTime =
            runningProcess.completionTime - runningProcess.arrivalTime;
          runningProcess.waitingTime =
            runningProcess.turnAroundTime - runningProcess.burstTime;
          runningProcess.isDone = true;
          runningProcess = () => {
            return;
          };
        } else if (runningProcess.quantumTimeLeft === 0) {
          runningProcess.quantumTimeLeft = activeAlgorithm.timeQuantum;
          runningProcess.timeOfNextEnqueue = time + 1;
        }
      } else if (activeAlgorithm.mode === "RRO") {
        // TODO: RRO to be included in the options
      }
    }
  }
  return processes;
};
