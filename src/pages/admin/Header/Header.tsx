import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import NavMenu from "./NavBar";

// @ts-ignore
const useStyles = makeStyles(() => ({
  header: {
    padding: "0px",
  },
}));

export default function Header() {
  const classes = useStyles();

  return (
    <header className={classes.header}>
      <NavMenu />
    </header>
  );
}
