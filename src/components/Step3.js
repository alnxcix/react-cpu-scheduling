import React from "react";
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  Typography,
} from "@material-ui/core";
import { getAverage } from "../utils";
const Step3 = ({ results }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Process ID</TableCell>
            <TableCell align="center">Starting Time</TableCell>
            <TableCell align="center">Completion Time</TableCell>
            <TableCell align="center">Turn-around Time</TableCell>
            <TableCell align="center">Waiting Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((process, index) => (
            <TableRow key={index}>
              <TableCell align="center">{process.pid}</TableCell>
              <TableCell align="center">{process.startingTime}</TableCell>
              <TableCell align="center">{process.completionTime}</TableCell>
              <TableCell align="center">{process.turnAroundTime}</TableCell>
              <TableCell align="center">{process.waitingTime}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell align="right" colSpan={3}>
              <Typography variant="overline">Average:</Typography>
            </TableCell>
            <TableCell align="center">
              {!results.some(
                ({ turnAroundTime }) => turnAroundTime === undefined
              ) &&
                getAverage(results.map(({ turnAroundTime }) => turnAroundTime))}
            </TableCell>
            <TableCell align="center">
              {!results.some(({ waitingTime }) => waitingTime === undefined) &&
                getAverage(results.map(({ waitingTime }) => waitingTime))}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default Step3;
