import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import "@tabler/core/dist/css/tabler.min.css";
import "@tabler/core/dist/js/tabler.min.js";

import "./styles.css";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);