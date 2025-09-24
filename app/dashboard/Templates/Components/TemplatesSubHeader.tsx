import { useAppContext } from "@/app/AppContext";

type SingleFilteringItem = {
  id: number;
  name: string;
  icon: React.ReactNode;
  isSelected: boolean;
};
export default function TemplateSubHeader() {
  const {
    templateFilteringItemsObject: {
      templatesFilteringItems,
      setTemplatesFilteringItems,
    },
    isDarkModeObject: { isDarkMode, setIsDarkMode },
    windowWidthObject: { windowWidth },
  } = useAppContext();

  return (
    <div
      className={` rounded-t-lg mx-4  ${
        windowWidth <= 534 ? "h-[180px] p-3" : "h-[130px] p-1"
      }   flex 
    items-center justify-center ${
      isDarkMode
        ? "bg-slate-800 rounded-lg"
        : "bg-slate-100 border rounded-t-lg"
    } `}
    >
      <div className="flex gap-2 justify-center flex-wrap">
        {templatesFilteringItems.map((singleItem, index) => (
          <SingleOption key={index} singleItem={singleItem} />
        ))}
      </div>
    </div>
  );

  function SingleOption({ singleItem }: { singleItem: SingleFilteringItem }) {
    function updateSingleItem() {
      const updateTemplatesFilteringItems = templatesFilteringItems.map(
        (element) => {
          if (element.id === singleItem.id) {
            return { ...element, isSelected: true };
          }

          return { ...element, isSelected: false };
        }
      );

      setTemplatesFilteringItems(updateTemplatesFilteringItems);
    }

    return (
      <div
        onClick={updateSingleItem}
        className={`flex gap-1 i items-center  
        p-1 px-3 text-sm rounded-3xl text-slate-400 cursor-pointer 
        select-none ${singleItem.isSelected && "bg-slate-300 text-slate-600"}`}
      >
        {singleItem.icon}
        <p>{singleItem.name}</p>
      </div>
    );
  }
}
