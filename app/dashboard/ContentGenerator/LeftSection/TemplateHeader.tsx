import { RiArrowDropDownLine } from "react-icons/ri";
import { FaCode } from "react-icons/fa";
import { useAppContext } from "@/app/AppContext";
import { IoClose } from "react-icons/io5";
import TemplateDropDown from "@/app/DropDowns/TemplateDropDown";
import { useState } from "react";
import { RiArrowDropUpLine } from "react-icons/ri";
export default function TemplatesHeader() {
  const {
    selectedTemplatesObject: { selectedTemplate, setSelectedTemplate },
    allTemplatesObject: { allTemplates },
    openContentGeneratorFormObject: { setOpenContentGeneratorForm },
  } = useAppContext();

  const defaultSelectedTemplate = allTemplates[0];
  const [openDropDown, setOpenDropDown] = useState(false);

  return (
    <div className="flex items-center gap-1 justify-between ">
      <div>
        <h2 className="  flex items-center gap-2">
          <div className="bg-purple-200 p-2 rounded-md ">
            {selectedTemplate !== null
              ? selectedTemplate.icon
              : defaultSelectedTemplate.icon}
          </div>

          <div className="flex flex-col">
            <button
              onClick={() => setOpenDropDown(!openDropDown)}
              className="text-[18px] text-slate-600 items-center flex gap-1 font-semibold"
            >
              <span className="hover:text-purple-600 cursor-pointer">
                {selectedTemplate !== null
                  ? selectedTemplate.title
                  : defaultSelectedTemplate.title}
              </span>
              {openDropDown ? <RiArrowDropUpLine /> : <RiArrowDropDownLine />}
            </button>
            <span className="text-[10px] text-slate-400">
              {selectedTemplate !== null
                ? selectedTemplate.shortSubTitle
                : defaultSelectedTemplate.shortSubTitle}
            </span>
          </div>
        </h2>
        {openDropDown && (
          <TemplateDropDown
            openDropDown={openDropDown}
            setOpenDropDown={setOpenDropDown}
          />
        )}
      </div>

      <IoClose
        onClick={() => setOpenContentGeneratorForm(false)}
        className=" mr-3 text-gray-500 cursor-pointer"
      />
    </div>
  );
}
