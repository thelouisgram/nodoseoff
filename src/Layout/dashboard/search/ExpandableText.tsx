import React, { useState } from "react";

interface ExpandableTextProps {
  text: string;
  limit: number;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, limit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const words = text.split(/\s+/);
  const truncatedText = words.slice(0, limit).join(" ");
  const showMore = words.length > limit;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <h1 className="text-18px capitalize">
        {isExpanded ? text : truncatedText}
        {showMore && (
          <span style={{ cursor: "pointer" }} onClick={handleToggle}>
            {isExpanded ? " \u25B2" : " ... \u25BC"}
          </span>
        )}
      </h1>
    </div>
  );
};

export default ExpandableText;
