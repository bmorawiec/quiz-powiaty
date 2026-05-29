import { lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { PageLayout } from "src/ui";
import "./index.css";

const HomePage = lazy(() => import("src/pages/home"));
const GamePage2 = lazy(() => import("src/pages/game2"));

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<PageLayout/>}>
                <Route index element={<HomePage/>}/>
                <Route path="graj2" element={<GamePage2/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
);
