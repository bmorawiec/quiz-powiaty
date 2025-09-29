import { lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { PageLayout } from "src/ui";
import "./index.css";

const HomePage = lazy(() => import("src/pages/home"));
const GamePage = lazy(() => import("src/pages/game"));
const LearnPage = lazy(() => import("src/pages/learn"));

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<PageLayout/>}>
                <Route index element={<HomePage/>}/>
                <Route path="graj" element={<GamePage/>}/>
                <Route path="nauka" element={<LearnPage/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
);
