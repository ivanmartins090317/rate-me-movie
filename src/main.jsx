import { createRoot } from "react-dom/client"
import { App } from "./App.jsx"
import "./index.css"

const rootElement = document.querySelector("[data-js='root']")
const root = createRoot(rootElement)

root.render(<App />)
