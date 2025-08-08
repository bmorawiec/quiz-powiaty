import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";

const HomePage = lazy(() => import("src/pages/home"));
const GamePage = lazy(() => import("src/pages/game"));

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route index element={<HomePage/>}/>
                <Route path="graj" element={<GamePage/>}/>
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
