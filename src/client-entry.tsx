import "@babel/polyfill";
import "node-source-han-sans-sc/SourceHanSansSC-Regular-all.css";
import "typeface-nanum-square-round";
import "inter-ui";
import AuthEntry from "@/auth-entry";
import LogRocket from "logrocket";
import React from "react";
import * as ReactDOM from "react-dom";

LogRocket.init(`8qowji/badanamu-learning-pass`);

function main () {
    const div = document.getElementById(`app`);
    ReactDOM.render(<AuthEntry />, div);
}

main();
