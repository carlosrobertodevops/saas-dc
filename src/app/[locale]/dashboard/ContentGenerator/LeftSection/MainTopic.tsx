import { useAppContext } from "@/src/app/AppContext";

import { useEffect, useRef } from "react";
import { useContentGeneratorForm } from "./LeftSectionContext";

export default function MainTopic({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  function dynamicTextAreaHeight(): string {
    if (
      label === "Product Name" ||
      label === "Blog Post Topic" ||
      label === "Blog Post Content" ||
      label === "Video Topic" ||
      label === "Programming Task" ||
      label === "Text to Summarize" ||
      label === "Section Topic" ||
      label === "Page Content" ||
      label === "Your Profession" ||
      label === "Post Topic " ||
      label === "Content to Rewrite"
    ) {
      return "h-[30vh]";
    }

    return "h-[20vh]";
  }

  const {
    openContentGeneratorFormObject: { openContentGeneratorForm },
    isDarkModeObject: { isDarkMode },
  } = useAppContext();

  const {
    mainTopicInputObject: { mainTopicInput, setMainTopicInput },
    errorsObject: { errors, setErrors },
  } = useContentGeneratorForm();

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const getIndexMainTopicError = errors.findIndex(
    (error) => error.label === "mainTopic"
  );
  useEffect(() => {
    textAreaRef.current?.focus();
  }, [openContentGeneratorForm]);

  return (
    <div className="flex flex-col">
      <label
        htmlFor="contentType"
        className="text-[14px] font-medium text-slate-400 mb-[7px]"
      >
        {label}
      </label>
      <textarea
        ref={textAreaRef}
        id="contentType"
        className={`${dynamicTextAreaHeight()} w-full resize-none p-2 outline-none text-[13px] 
        mt-[3px] ${
          isDarkMode ? "bg-slate-700 text-white" : "bg-white"
        } border border-gray-300 rounded-md`}
        placeholder={placeholder}
        value={mainTopicInput}
        onChange={(e) => {
          setMainTopicInput(e.target.value);
          //Update the error state
          setErrors((prevErrors) =>
            prevErrors.map((error) => ({
              ...error,
              show: error.label === "mainTopic" ? false : error.show,
            }))
          );
        }}
      />
      {errors[getIndexMainTopicError].show && (
        <span className="text-red-500 text-[10px] mt-1">
          {errors[getIndexMainTopicError].message}
        </span>
      )}
    </div>
  );
}
