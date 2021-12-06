import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { Trove } from "./components/Trove"
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css"

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Trove />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
)