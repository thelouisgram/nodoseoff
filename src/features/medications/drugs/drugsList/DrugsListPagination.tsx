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
    <div className="flex justify-between ss:justify-end items-center gap-3 px-6 py-4 text-sm border-t border-gray-100 dark:border-slate-800">
      <button
        disabled={page === 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        className="
              px-4 py-2 rounded-[8px]
              text-sm font-medium
              border border-gray-100 dark:border-slate-700
              text-grey dark:text-slate-400
              disabled:opacity-40
              disabled:cursor-not-allowed
              hover:bg-gray-50 dark:hover:bg-slate-800
            "
      >
        Prev
      </button>

      <span className="font-semibold text-gray-600 dark:text-gray-300">
        Page {page} of {maxPage}
      </span>

      <button
        disabled={page === maxPage}
        onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
        className="
              px-4 py-2 rounded-[8px]
              text-sm font-medium
              border border-gray-100 dark:border-slate-800
              text-grey dark:text-slate-400
              disabled:opacity-40
              disabled:cursor-not-allowed
              hover:bg-gray-50 dark:hover:bg-slate-800
            "
      >
        Next
      </button>
    </div>
  );
}
