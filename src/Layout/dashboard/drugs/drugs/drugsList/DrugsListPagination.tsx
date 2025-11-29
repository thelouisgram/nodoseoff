import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  total: number;
  perPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function DrugsListPagination({
  page,
  total,
  perPage,
  setPage,
}: Props) {
  const maxPage = Math.max(Math.ceil(total / perPage), 1);
  if (total === 0) return null;

  return (
    <div className="flex justify-end items-center gap-3 px-6 py-4 text-sm">
      <button
        disabled={page === 1}
        onClick={() => setPage(p => Math.max(1, p - 1))}
        className="px-3 py-1.5 border rounded disabled:opacity-40"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <span className="font-semibold text-gray-600">
        {page} / {maxPage}
      </span>

      <button
        disabled={page === maxPage}
        onClick={() => setPage(p => Math.min(maxPage, p + 1))}
        className="px-3 py-1.5 border rounded disabled:opacity-40"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
