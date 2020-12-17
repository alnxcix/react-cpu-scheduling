import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
const Header = () => (
  <AppBar color="transparent" position="relative">
    <Toolbar>
      <Typography color="inherit" noWrap variant="h6">
        Non-Preemptive CPU Scheduling
      </Typography>
    </Toolbar>
  </AppBar>
);
export default Header;
