import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import { IoClose } from "react-icons/io5";
import { useContentGeneratorForm } from "../LeftSectionContext";

function Keywords() {
  const {
    keywordsObject: { keywords, setKeywords },
    errorsObject: { errors, setErrors },
  } = useContentGeneratorForm();
  const [inputValue, setInputValue] = useState<string>("");

  const getIndexKeywordsError = errors.findIndex(
    (error) => error.label === "keywords"
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    //Update the error state
    setErrors((prevErrors) =>
      prevErrors.map((error) => ({
        ...error,
        show: error.label === "keywords" ? false : error.show,
      }))
    );
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      addKeyword(inputValue.trim());
    }
  };

  const addKeyword = (keyword: string) => {
    if (!keywords.includes(keyword)) {
      setKeywords([...keywords, keyword]);
      setInputValue("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove));
  };

  return (
    <div className="flex flex-col">
      <label className="text-[14px] font-medium text-slate-400 mb-[7px]">
        Keywords
      </label>
      <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md">
        {keywords.map((keyword, index) => (
          <div
            key={index}
            className="flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-md"
          >
            <span className="text-[13px]">{keyword}</span>
            <button
              type="button"
              onClick={() => removeKeyword(keyword)}
              className="ml-1 text-purple-600 hover:text-purple-800"
            >
              <IoClose />
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Add keywords here..."
          onKeyDown={handleInputKeyDown}
          className="flex-grow text-[13px] outline-none"
        />
      </div>
      {errors[getIndexKeywordsError].show && (
        <span className="text-red-500 text-[10px] mt-1">
          {errors[getIndexKeywordsError].message}
        </span>
      )}
    </div>
  );
}

export default Keywords;
