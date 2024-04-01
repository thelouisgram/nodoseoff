import { toast } from "sonner";

interface ContentProps {
  content: string;
}

const CopyableContent: React.FC<ContentProps> = ({ content }) => {

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard")
  };

  return (
    <button
      onClick={handleCopyContent}
      className="w-full border border-gray-300 rounded-lg py-4 px-4 flex gap-3"
    >
      <div className="content">{content}</div>
    </button>
  );
};

export default CopyableContent;
