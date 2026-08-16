import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Match from "../pages/Match";
import MatchUpdate from "../pages/MatchUpdate";
import AddPlayers from "../pages/AddPlayers";
import MatchDetails from "../pages/MatchDetails";
import StartMatch from "../pages/StartMatch";
import LiveScore from "../pages/LiveScore";
import Notfound from "../pages/Notfound";
import MainLayout from "../layouts/MainLayout";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/match" element={<Match />} />
          <Route path="/matchupdate/:id" element={<MatchUpdate />} />
          <Route path="/addplayers/:id" element={<AddPlayers />} />
          <Route path="/startmatch/:id" element={<StartMatch />} />
          <Route path="/matchDetails/:id" element={<MatchDetails />} />
          <Route path="/livescore/:id" element={<LiveScore />} />
          <Route path="*" element={<Notfound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
