"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { FiPlusCircle } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RiStickyNoteAddLine } from "react-icons/ri";
import { useAppContext } from "../AppContext";
import { FiMenu } from "react-icons/fi";
import { SingleTemplate } from "../types/AppType";
import { GiRoundStar } from "react-icons/gi";

import { UserButton, useAuth, useUser } from "@clerk/nextjs";

const MainHeader = () => {
  const {
    isDarkModeObject: { isDarkMode },
    windowWidthObject: { windowWidth },
    stretchSideBarObject: { stretchSideBar, setStretchSideBar },
    mainMenuItemsObject: { mainMenuItems },
    openContentGeneratorFormObject: {
      openContentGeneratorForm,
      setOpenContentGeneratorForm,
    },
    fakeUser: { isPro, cumulativeWords },
    contentGeneratedObject: { contentGenerated },
  } = useAppContext();

  //Get the menu element the user clicked on
  const findSelectedMenuItems = mainMenuItems.find((item) => item.isSelected);

  function stretchSideBarFunction() {
    setStretchSideBar(!stretchSideBar);
  }

  //Return the icon based on tne menu Item selected
  function RenderMenuItemIcon() {
    if (findSelectedMenuItems !== undefined) {
      return (
        <>
          {React.createElement(findSelectedMenuItems?.icon, {
            className: `text-[20px] text-purple-700 `,
          })}
        </>
      );
    }
  }

  const [disableGenerateBtn, setDisableGenerateBtn] = useState(false);

  useEffect(() => {
    if (!isPro) {
      if (cumulativeWords >= 1000) {
        setDisableGenerateBtn(true);
      }
    } else {
      setDisableGenerateBtn(false);
    }
  }, [cumulativeWords, isPro]);

  console.log("disbaled button", disableGenerateBtn);
  return (
    <div
      className={`flex justify-between rounded-md items-center p-3 m-4 ${
        isDarkMode ? "bg-slate-800 text-white  " : "bg-white"
      }  border-slate-200 transition-all`}
    >
      {/* The name of the page */}
      <div className="flex gap-2   items-center  ">
        <RenderMenuItemIcon />
        {windowWidth >= 732 && (
          <h1 className="text-[17px] font-semibold    ">
            {findSelectedMenuItems?.label}
          </h1>
        )}
      </div>

      {/* Search Bar */}
      <SearchComponent />

      {/* Center Icons */}
      <div className="flex gap-3 items-center ">
        <button
          disabled={disableGenerateBtn}
          onClick={() => {
            setOpenContentGeneratorForm(!openContentGeneratorForm);
          }}
          className={` text-white text-[12px] 
        gap-1 py-[6px] px-3 mr-2 bg-gradient-to-tr from-purple-600
         to-purple-700 rounded-md flex items-center justify-center ${
           disableGenerateBtn && "opacity-40"
         }`}
        >
          {windowWidth >= 732 && <span>Generate</span>}
          <RiStickyNoteAddLine className="text-[18px]" />
        </button>

        {/* User Profile */}
        {/* <div className="flex items-center gap-1   border-l border-slate-200 ">
          <div className="w-6 h-6 rounded-full bg-slate-300 ml-2"></div>

          {windowWidth >= 732 && (
            <div>
              <p className="text-sm font-semibold">Ali Ounassi</p>
              <p className="text-xs text-slate-400">
                {isPro ? "Pro Plan" : "Free plan"}
              </p>
            </div>
          )}

          <MdKeyboardArrowDown className="text-slate-400 text-[18px]" />
        </div> */}

        {ProfileUser()}
        {windowWidth <= 995 && (
          <FiMenu
            onClick={stretchSideBarFunction}
            className="text-[19px] text-slate-500 cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default MainHeader;

function ProfileUser() {
  const { user } = useUser();
  const { fakeUser } = useAppContext();
  const imageUrl = user?.imageUrl || "";

  const loadingImage = (
    <div className="w-9 h-9 rounded-full mb-[5px] bg-slate-200 "></div>
  );

  const loadingUserName = (
    <span className="font-semibold bg-slate-100 h-4 w-[100px]"></span>
  );
  const loadingUserEmail = (
    <span className="text-slate-500 text-[11px] bg-slate-100 h-2 w-[130px]"></span>
  );

  return (
    <div className="flex gap-3 items-center  ">
      {!user ? (
        loadingImage
      ) : (
        <Image
          src={imageUrl}
          alt={`${user?.firstName} ${user?.lastName}`}
          width={70}
          height={70}
          className="w-9 h-9 rounded-full mb-[5px] "
        />
      )}

      <div
        className={`max-md:hidden  flex flex-col text-sm ${
          !user ? "gap-1" : ""
        }`}
      >
        {!user ? (
          loadingUserName
        ) : (
          <div>
            <span className="font-semibold  ">
              {user?.lastName} {user?.firstName}
            </span>
            <p className="text-xs text-slate-400">
              {fakeUser.isPro ? "Pro Plan" : "Free plan"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function SearchComponent() {
  const {
    isDarkModeObject: { isDarkMode },
    allTemplatesObject: { allTemplates },
    allHistoryDataObject: { allHistoryData },
  } = useAppContext();

  const [search, setSearch] = useState("");
  const [showLiveResults, setShowLiveResults] = useState(false);

  const filteredResults = allTemplates.filter((singleTemplate) =>
    singleTemplate.title.toLowerCase().includes(search.toLowerCase())
  );

  function updateTheSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    const currentValue = e.target.value;
    if (currentValue.trim().length === 0) {
      setShowLiveResults(false);
    } else {
      setShowLiveResults(true);
    }
    setSearch(e.target.value);
  }

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowLiveResults(false);
        setSearch("");
      }
    }

    if (showLiveResults) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLiveResults, setShowLiveResults]);

  return (
    <div ref={menuRef} className={` flex flex-col w-1/3 relative  `}>
      <div
        className={`flex  items-center   ${
          isDarkMode ? "bg-slate-600" : "bg-slate-50"
        } rounded-md px-3 py-[9px]`}
      >
        {/* icon */}
        <BiSearch className="text-slate-400 text-[18px]" />
        <input
          value={search}
          onChange={updateTheSearchInput}
          type="text"
          placeholder="Search a template..."
          className={` ${
            isDarkMode ? "bg-slate-600" : "bg-slate-50"
          }  font-light text-slate-400 placeholder:text-slate-400 focus:outline-none px-1 text-[12px]  
    w-full`}
        />
      </div>
      {showLiveResults && <LiveResults />}
    </div>
  );

  function LiveResults() {
    const dynamicHeight = filteredResults.length === 14 ? "h-[250px]" : "";

    if (filteredResults.length === 0) {
      return (
        <div
          className={`  w-[340px] z-[60] p-3 absolute top-14 rounded-md 
    shadow-md flex flex-col gap-5 text-slate-400 text-[12px] ${
      isDarkMode ? "bg-slate-600" : "bg-white"
    }`}
        >
          no template found...
        </div>
      );
    }

    return (
      <div
        className={`${
          isDarkMode ? "bg-slate-600" : "bg-white"
        } w-[340px] ${dynamicHeight} z-[60] p-3 absolute top-14 rounded-md 
      shadow-md flex flex-col gap-3`}
      >
        <div className="h-[97%] overflow-y-auto">
          {filteredResults.map((singleTemplate, index) => (
            <SingleTemplateItem key={index} singleTemplate={singleTemplate} />
          ))}
        </div>
      </div>
    );
  }

  function SingleTemplateItem({
    singleTemplate,
  }: {
    singleTemplate: SingleTemplate;
  }) {
    const {
      fakeUser,
      mainMenuItemsObject: { setMainMenuItems },
      selectedTemplatesObject: { setSelectedTemplate },
      openContentGeneratorFormObject: { setOpenContentGeneratorForm },
    } = useAppContext();

    const sumTotalWords = allHistoryData.reduce((sum, item) => {
      if (item.template.toLowerCase() === singleTemplate.title.toLowerCase()) {
        return sum + item.totalWords;
      }
      return sum;
    }, 0);

    function adjustOpacity() {
      if (!fakeUser.isPro) {
        if (singleTemplate.isForPro) {
          return "opacity-45";
        }
      }

      return "";
    }

    function showStar() {
      if (!fakeUser.isPro) {
        if (singleTemplate.isForPro) {
          return (
            <GiRoundStar
              className="text-purple-600   p-[2px] flex items-center justify-center rounded-full 
     absolute right-[-25px] top-[5px] text-[13px]  "
            />
          );
        }
      }

      return <></>;
    }

    function goToTheProPlanPage() {
      setMainMenuItems((prevItems) =>
        prevItems.map((singleItem) => ({
          ...singleItem,
          isSelected: singleItem.label === "Subscriptions" ? true : false,
        }))
      );
    }

    return (
      <div
        onClick={() => {
          //If the user is not pro, only selected the templates
          //that the isForPro property if false, otherwise, select all the templates
          if (!fakeUser.isPro) {
            //If the cumulative words exceeds 1000, take the user to the Pro Plan Page
            if (fakeUser.cumulativeWords >= 1000) {
              goToTheProPlanPage();
              setShowLiveResults(false);
              setSearch("");
              return;
            }
            //If the template is free to use, access to this template
            if (!singleTemplate.isForPro) {
              setSelectedTemplate(singleTemplate);
              setOpenContentGeneratorForm(true);
            } else {
              //If the user click on the template is not free to use,
              //dire ct him to the upgrade plan page
              goToTheProPlanPage();
            }
          } else {
            setSelectedTemplate(singleTemplate);
            setOpenContentGeneratorForm(true);
          }

          setShowLiveResults(false);
          setSearch("");
        }}
        className={`p-2 flex items-center justify-between gap-4 
      hover:border rounded-md hover:bg-purple-50 border-purple-500 ${adjustOpacity()} 
      select-auto cursor-pointer  `}
      >
        {/* Icon and name - take full space on the left */}
        <div className=" flex items-center w-full relative    ">
          <div className="bg-purple-200 p-[6px] rounded-lg text-[13px] text-slate-700">
            {singleTemplate.icon}
          </div>
          <div className="relative">
            {/* pro tag */}
            {showStar()}
            <span className="text-[14px] ml-2">{singleTemplate.title}</span>
          </div>
        </div>
        {/* Total words generated each template - align to the right */}
        <span className="text-[10px] text-right text-slate-400">
          {sumTotalWords} Words Generated
        </span>
      </div>
    );
  }
}
