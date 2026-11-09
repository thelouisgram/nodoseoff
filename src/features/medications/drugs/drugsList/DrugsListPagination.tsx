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
    <div className="flex items-center justify-between gap-3 border-t border-black/[0.05] px-4 py-3.5 text-sm ss:justify-end ss:px-6">
      <button
        disabled={page === 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        className="rounded-soft-sm border border-black/[0.06] bg-soft-card px-3.5 py-2 text-[13px] font-medium text-soft-muted transition hover:bg-soft-canvas disabled:cursor-not-allowed disabled:opacity-40"
      >
        Prev
      </button>

      <span className="font-medium text-soft-muted">
        Page {page} of {maxPage}
      </span>

      <button
        disabled={page === maxPage}
        onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
        className="rounded-soft-sm border border-black/[0.06] bg-soft-card px-3.5 py-2 text-[13px] font-medium text-soft-muted transition hover:bg-soft-canvas disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
