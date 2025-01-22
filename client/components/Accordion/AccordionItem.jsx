import { IconMinus, IconPlus } from "@tabler/icons-react";
import CopyButton from "./CopyButton";

const AccordionItem = ({
  title,
  content,
  bulletPoints,
  isOpen,
  onToggle,
  variant,
  onCopy,
  isFirst,
}) => {
  const handleCopy = async () => {
    const textToCopy = bulletPoints ? bulletPoints.join("\n") : content;
    await navigator.clipboard.writeText(textToCopy);
    if (onCopy) onCopy(textToCopy);
  };

  const renderContent = () => {
    if (bulletPoints) {
      return (
        <ul className="list-disc pl-4 text-fordham-white font-light body-txt space-y-2">
          {bulletPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      );
    }
    return <p className="text-fordham-white font-light body-txt">{content}</p>;
  };

  return (
    <div className="bg-fordham-white/5 rounded-[16px] pr-4 pl-[32px] py-4">
      <div className="flex justify-between items-center">
        <h3 className="text-fordham-white body-txt-bold md:body-txt-md-bold mr-4 font-bold">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          {/* Copy button - only show in toolbox variant when section is open */}
          {variant === "toolbox" && isOpen && <CopyButton onCopy={handleCopy} isFirst={isFirst} />}

          {/* Toggle button - onClick moved here */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling
              onToggle();
            }}
            className="bg-fordham-white/5 rounded-[8px] hover:bg-fordham-white/20 p-3 transition-colors duration-200 cursor-pointer"
            aria-label={isOpen ? "Close section" : "Open section"}
          >
            {isOpen ? (
              <IconMinus
                size={24}
                className="text-fordham-white transition-transform duration-300"
              />
            ) : (
              <IconPlus
                size={24}
                className="text-fordham-white transition-transform duration-300"
              />
            )}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 py-4" : "max-h-0"
        }`}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default AccordionItem;
