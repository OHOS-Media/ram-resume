import { useState } from "react";
import AccordionItem from "./AccordionItem";

const Accordion = ({ data, variant = "faq", onCopy }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full flex flex-col gap-4 pb-10">
      {data.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title || item.question}
          content={item.content || item.answer}
          bulletPoints={item.bulletPoints}
          isOpen={openIndex === index}
          onToggle={() => handleToggle(index)}
          variant={variant}
          onCopy={onCopy}
          isFirst={index === 0}
        />
      ))}
    </div>
  );
};

export default Accordion;
