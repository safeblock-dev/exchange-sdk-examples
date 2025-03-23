import "./main.css"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "~/app"
import React from "react"

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
