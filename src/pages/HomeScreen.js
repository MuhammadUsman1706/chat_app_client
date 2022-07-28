import React, { Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import SideBar from "../components/SideBar";
import Welcome from "../components/Welcome";
import ChatScreen from "../components/ChatScreen";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/:id/:name" element={<ChatScreen />} />
    </Routes>
  );
};

const HomeScreen = ({ setIsLoggedIn }) => {
  return (
    <Box display="flex">
      <SideBar setIsLoggedIn={setIsLoggedIn} />
      <AllRoutes />
    </Box>
  );
};

export default HomeScreen;
