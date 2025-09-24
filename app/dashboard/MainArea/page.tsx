"use client";
import React from "react";
import MainHeader from "../MainHeader";
import { useAppContext } from "@/app/AppContext";
import DashStats from "./Components/DashStats";
import Chart from "./Components/Chart";
import ChartContainer from "./Components/Chart";
import AllHistoryList from "./Components/AllHistoryList";

function MainArea() {
  const {
    isDarkModeObject: { isDarkMode },
    stretchSideBarObject: { stretchSideBar },
  } = useAppContext();
  return (
    <div
      className={`w-full    ${!isDarkMode ? "bg-slate-50" : "bg-slate-700"}`}
    >
      {/* SoftLayer to open when the side bar is stretched in mobile view screen */}
      {stretchSideBar && (
        <div className="fixed w-full h-full bg-black opacity-25 z-50"></div>
      )}
      <MainHeader />
      <DashStats />
      <ChartContainer />
      <AllHistoryList />
    </div>
  );
}

export default MainArea;
