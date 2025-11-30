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
    <div className="flex justify-between ss:justify-end items-center gap-3 px-6 py-4 text-sm">
      <button
        disabled={page === 1}
        onClick={() => setPage(p => Math.max(1, p - 1))}
        className="
              px-4 py-2 rounded-[8px]
              text-sm font-medium
              border border-gray-300
              text-grey
              disabled:opacity-40
              disabled:cursor-not-allowed
              hover:bg-gray-50
            "
      >
        Prev
      </button>

      <span className="font-semibold text-gray-600">
        Page {page} of {maxPage}
      </span>

      <button
        disabled={page === maxPage}
        onClick={() => setPage(p => Math.min(maxPage, p + 1))}
        className="
              px-4 py-2 rounded-[8px]
              text-sm font-medium
              border border-gray-300
              text-grey
              disabled:opacity-40
              disabled:cursor-not-allowed
              hover:bg-gray-50
            "
      >
        Next
      </button>
    </div>
  );
}
