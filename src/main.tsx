import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";

const HomePage = lazy(() => import("src/pages/home"));

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route index element={<HomePage/>}/>
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
