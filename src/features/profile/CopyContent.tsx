import { toast } from "sonner";

interface ContentProps {
  content: string;
}

const CopyableContent: React.FC<ContentProps> = ({ content }) => {
  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  return (
    <button
      onClick={handleCopyContent}
      className="w-full border border-gray-300 dark:border-gray-700 rounded-lg py-4 px-4 flex gap-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors bg-white dark:bg-slate-900"
    >
      <div className="content text-gray-900 dark:text-slate-100">{content}</div>
    </button>
  );
};

export default CopyableContent;
