import "@babel/polyfill";
import './index.css';
import AuthEntry from "@/auth-entry";
import { initializeFirebase } from '@/firebase/config';
import * as ReactDOM from "react-dom";

function main () {
    // initializeFirebase();
    const div = document.getElementById(`app`);
    ReactDOM.render(<AuthEntry />, div);
}

main();
