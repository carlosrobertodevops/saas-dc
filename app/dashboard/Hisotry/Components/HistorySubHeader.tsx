import { useAppContext } from '@/app/AppContext';
import FilterByTemplates from '@/app/DropDowns/FilterByTemplatesDropDown';
import { useState } from 'react';

import { IoFilter } from 'react-icons/io5';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { RiArrowDropUpLine } from 'react-icons/ri';

export default function HistorySubHeader() {
  const {
    isDarkModeObject: { isDarkMode },
    windowWidthObject: { windowWidth },
    allHistoryDataObject: { allHistoryData },
  } = useAppContext();

  const [openDropDown, setOpenDropDown] = useState(false);
  console.log(openDropDown);

  const isMobileView = windowWidth <= 694;

  //Filter Button

  function FilterButton() {
    const containerClass = `flex  text-[14px]   gap-2 rounded-md px-2
      hover:cursor-pointer h-[38px] items-center relative ${
        isDarkMode ? 'bg-slate-800 ' : 'bg-white border border-slate-50 '
      } `;

    const buttonClass = `flex items-center gap-1 `;

    const filterByTemplateText = ` ${
      isDarkMode ? 'text-white' : 'text-slate-500'
    } ${isMobileView ? 'hidden' : 'block'} text-sm hover:text-purple-600`;

    function dropDownIconToggle() {
      if (openDropDown) {
        return <RiArrowDropUpLine className="text-purple-600 text-[20px]" />;
      }

      return <RiArrowDropDownLine className="text-purple-600 text-[20px]" />;
    }

    return (
      <button
        onClick={() => {
          setOpenDropDown(!openDropDown);
        }}
        className={containerClass}
      >
        {/* Icon */}
        <IoFilter className="text-purple-600 text-[16px]" />
        {/* Text and drop down icon */}
        <div className={buttonClass}>
          <span className={filterByTemplateText}>Filter By Templates</span>
          {dropDownIconToggle()}
        </div>
        {/* template filter drop down */}
      </button>
    );
  }

  //Subheader title
  function SubHeaderTitle() {
    const itemsGeneratedNumber = allHistoryData.length;
    return (
      <div className="flex flex-col">
        {/*  */}
        <span className="font-semibold text-[18px]">
          {itemsGeneratedNumber} Element Generated
        </span>
        {/*  */}
        <span className="text-slate-400 text-[10px]">
          History of all the content created
        </span>
      </div>
    );
  }

  return (
    <div className="mx-6 flex justify-between mt-12 relative ">
      <SubHeaderTitle />
      <FilterButton />
      {openDropDown && (
        <FilterByTemplates
          openDropDown={openDropDown}
          setOpenDropDown={setOpenDropDown}
        />
      )}
    </div>
  );
}
