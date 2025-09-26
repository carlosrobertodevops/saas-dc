import { useAppContext } from "@/src/app/AppContext";
import { useContentGeneratorForm } from "./LeftSectionContext";
useContentGeneratorForm;

export default function Audience() {
  const {
    audienceInputObject: { audienceInput, setAudienceInput },
    errorsObject: { errors, setErrors },
  } = useContentGeneratorForm();

  const getIndexMainTopicError = errors.findIndex(
    (error) => error.label === "mainTopic"
  );

  const {
    isDarkModeObject: { isDarkMode },
  } = useAppContext();
  return (
    <div className="  flex flex-col">
      <label
        htmlFor="audience"
        className="mt-2 text-[14px] font-medium text-slate-400 mb-[7px]"
      >
        Audience (Optional)
      </label>
      <input
        value={audienceInput}
        id="audience"
        className={` ${
          isDarkMode ? "bg-slate-700 text-white" : "bg-white"
        } w-full p-2 text-[13px] mt-[3px] border border-gray-300 rounded-md`}
        placeholder="Enter your audience"
        onChange={(e) => {
          setAudienceInput(e.target.value);
        }}
      />
    </div>
  );
}
