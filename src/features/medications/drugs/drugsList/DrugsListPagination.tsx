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
  if (total === 0 || maxPage <= 1) return null;

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  return (
    <div className="flex items-center justify-between gap-3 border-t border-black/[0.05] px-4 py-3.5 ss:px-5">
      <p className="text-[12px] tabular-nums text-soft-muted">
        <span className="font-semibold text-soft-ink">
          {from}–{to}
        </span>{" "}
        of {total}
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="ndo-press grid size-9 place-items-center rounded-xl border border-black/[0.06] bg-white text-soft-ink hover:bg-soft-canvas disabled:cursor-not-allowed disabled:opacity-35"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" strokeWidth={2} />
        </button>
        <span className="min-w-[3.5rem] text-center text-[12px] font-semibold tabular-nums text-soft-muted">
          {page}/{maxPage}
        </span>
        <button
          type="button"
          disabled={page === maxPage}
          onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
          className="ndo-press grid size-9 place-items-center rounded-xl border border-black/[0.06] bg-white text-soft-ink hover:bg-soft-canvas disabled:cursor-not-allowed disabled:opacity-35"
          aria-label="Next page"
        >
          <ChevronRight className="size-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
