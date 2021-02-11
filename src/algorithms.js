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

export const PPRIO = (processes) => {
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
      let process = queue.sort((a, b) =>
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

export const PRIO = (processes) => {
  let time = 0;
  while (processes.filter(({ isDone }) => isDone === undefined).length > 0) {
    let queue = processes.filter(
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

export const SRTF = (processes) => {
  processes.map(({ burstTime, remainingBurstTime }) => {
    remainingBurstTime = burstTime;
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
  return arr;
};

// this code still kinda sus
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
      }
    }
  }
  return processes;
};
