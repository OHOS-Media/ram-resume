import { useState, useRef } from "react";
import { IconCopy } from "@tabler/icons-react";

const CopyButton = ({ onCopy, isFirst }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState("Copy all bullet points");
  const timeoutRef = useRef(null);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await onCopy();
      setTooltipText("Copied!");

      // Reset tooltip text after 2 seconds
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setTooltipText("Copy all bullet points");
      }, 2000);
    } catch (err) {
      setTooltipText("Failed to copy");
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="relative">
      {/* Custom Tooltip */}
      {showTooltip && (
        <div
          className={`absolute ${
            isFirst ? "top-full mt-3" : "bottom-full mb-3"
          } left-1/2 -translate-x-1/2 p-4 bg-[#1B1B1B] text-white text-sm rounded whitespace-nowrap`}
        >
          {tooltipText}
          <div
            className={`absolute ${
              isFirst ? "-top-1" : "-bottom-1"
            } left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1B1B1B] transform rotate-45`}
          />
        </div>
      )}

      <button
        onClick={handleCopy}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="bg-fordham-white/5 rounded-[8px] hover:bg-fordham-white/20 p-3 transition-colors duration-200 cursor-pointer"
        aria-label="Copy content"
      >
        <IconCopy size={24} className="text-fordham-white" />
      </button>
    </div>
  );
};

export default CopyButton;
