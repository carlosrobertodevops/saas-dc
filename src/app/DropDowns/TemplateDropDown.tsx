"use client";

import { ReactNode, SetStateAction, useEffect, useRef, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useAppContext } from "../AppContext";
import { SingleTemplate } from "../types/AppType";
import useClickOutside from "../Hooks/useClickOutside";
import { GiRoundStar } from "react-icons/gi";

//Defining the type of each element in the drop down
type ExtendedSingleTemplate = SingleTemplate & {
  isSelected: boolean;
};

function TemplateDropDown({
  openDropDown,
  setOpenDropDown,
}: {
  openDropDown: boolean;
  setOpenDropDown: React.Dispatch<SetStateAction<boolean>>;
}) {
  const {
    allTemplatesObject: { allTemplates },
    selectedTemplatesObject: { selectedTemplate, setSelectedTemplate },
    openContentGeneratorFormObject: { openContentGeneratorForm },
  } = useAppContext();

  const [inputSearch, setInputSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [extendedAllTemplatesArray, setExtendedAllTemplatesArray] = useState(
    allTemplates.map((singleTemplate) => {
      return { ...singleTemplate, isSelected: false };
    })
  );

  useEffect(() => {
    //Set the focus
    if (inputRef.current) {
      inputRef.current.focus();
    }
    //
    if (selectedTemplate !== null) {
      //Get the index in the template array based on the selected template
      const getTheSelectedTemplateIndex = allTemplates.findIndex(
        (template) => template.id === selectedTemplate.id
      );

      //Update the isSelected property
      const copyExtendedTemplatesArray = extendedAllTemplatesArray.map(
        (template, index) => {
          if (getTheSelectedTemplateIndex === index) {
            return { ...template, isSelected: true };
          }

          return { ...template, isSelected: false };
        }
      );

      setExtendedAllTemplatesArray(copyExtendedTemplatesArray);
    }
  }, [openDropDown]);

  useEffect(() => {
    if (openContentGeneratorForm) {
      if (selectedTemplate === null) {
        setSelectedTemplate(extendedAllTemplatesArray[0]);
      }
    }
  }, [openContentGeneratorForm]);

  const filterBySearch = extendedAllTemplatesArray.filter((item) =>
    item.title.toLowerCase().includes(inputSearch.toLowerCase())
  );

  const dropDownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropDownRef, () => setOpenDropDown(false), openDropDown);
  //Jsx
  return (
    <div
      ref={dropDownRef}
      className={`bg-white     absolute p-3 top-20 
          z-[90] border w-[310px]     
      border-slate-50 select-none shadow-md rounded-lg flex 
      flex-col gap-2`}
    >
      {/* Search Bar */}
      <div className="flex  items-center bg-slate-50 rounded-md px-3 py-[9px] w-full">
        {/* icon */}
        <BiSearch className="text-slate-400 text-[18px]" />
        <input
          ref={inputRef}
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
          type="text"
          placeholder="Search here..."
          className="bg-slate-50 font-light text-slate-400
              placeholder:text-slate-400 focus:outline-none px-1 text-[12px]   w-full"
        />
      </div>
      <div className="flex flex-col gap-1 mt-3 h-[240px] pr-2 overflow-y-auto">
        {filterBySearch.map((item, index) => (
          <SingleItem key={index} dropDownItem={item} />
        ))}
      </div>
    </div>
  );

  function SingleItem({
    dropDownItem,
  }: {
    dropDownItem: ExtendedSingleTemplate;
  }) {
    const {
      selectedTemplatesObject: { selectedTemplate, setSelectedTemplate },
      fakeUser: { isPro },
      mainMenuItemsObject: { mainMenuItems, setMainMenuItems },
      openContentGeneratorFormObject: { setOpenContentGeneratorForm },
    } = useAppContext();

    function goToTheProPlanPage() {
      setMainMenuItems((prevItems) =>
        prevItems.map((singleItem) => ({
          ...singleItem,
          isSelected: singleItem.label === "Subscriptions" ? true : false,
        }))
      );
    }

    function updateTheSelection() {
      const copyExtendedTemplatesArray = extendedAllTemplatesArray.map(
        (template, _) => {
          if (dropDownItem.id === template.id) {
            return { ...template, isSelected: true };
          }

          return { ...template, isSelected: false };
        }
      );

      setExtendedAllTemplatesArray(copyExtendedTemplatesArray);
      setSelectedTemplate(dropDownItem);
      setOpenDropDown(false);
    }

    function decreaseOpacityDropDownItem() {
      if (dropDownItem.isForPro && !isPro) {
        return "opacity-55";
      }
      return "";
    }

    return (
      <div
        onClick={() => {
          if (!isPro) {
            if (!dropDownItem.isForPro) {
              updateTheSelection();
            } else {
              setOpenContentGeneratorForm(false);
              goToTheProPlanPage();
            }
          } else {
            updateTheSelection();
          }
        }}
        className={` ${
          dropDownItem.isSelected && "border border-purple-600 bg-purple-50"
        } flex items-center justify-between  
        gap-7 p-[6px] px-2 rounded-lg text-slate-600  cursor-pointer ${decreaseOpacityDropDownItem()}   `}
      >
        <div className={`flex gap-2 items-center   `}>
          {/* Icon */}

          <div
            className={`${
              dropDownItem.isSelected ? "bg-purple-200" : "bg-purple-100"
            } p-[6px] rounded-md`}
          >
            {dropDownItem.icon}
          </div>
          <div className="relative">
            <span className="text-[12px] text-slate-500 mt-1 hover:text-purple-600 cursor-pointer">
              {dropDownItem.title}
            </span>

            {!isPro && (
              <>
                {dropDownItem.isForPro && (
                  <GiRoundStar className="text-purple-600 text-[9px] absolute right-[-17px] top-[8px]" />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default TemplateDropDown;
