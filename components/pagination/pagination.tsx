import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

type PageToken = number | "gap-left" | "gap-right"

/** 1 … 3 4 5 … 12 — keeps the button row fixed-width while still paging. */
function pageTokens(page: number, totalPages: number): PageToken[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const tokens: PageToken[] = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(totalPages - 1, page + 1)

  if (start > 2) tokens.push("gap-left")
  for (let value = start; value <= end; value += 1) tokens.push(value)
  if (end < totalPages - 1) tokens.push("gap-right")

  tokens.push(totalPages)
  return tokens
}

/** Prev / numbered / Next pager for the browse list. */
export function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number
  totalPages: number
  onPage: (page: number) => void
}) {
  if (totalPages <= 1) return null

  const baseButton =
    "grid size-9 cursor-pointer place-items-center rounded-[8px] transition-colors focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none"

  return (
    <nav aria-label="Job list pages" className="mt-8 flex justify-center gap-2">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
        className={`${baseButton} text-white/70 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent`}
      >
        <ChevronLeftIcon aria-hidden="true" className="size-4" />
      </button>

      {pageTokens(page, totalPages).map((token, index) =>
        typeof token === "number" ? (
          <button
            key={token}
            type="button"
            aria-current={token === page ? "page" : undefined}
            aria-label={`Page ${token}`}
            onClick={() => onPage(token)}
            className={`${baseButton} font-inter text-sm font-medium ${
              token === page
                ? "bg-white text-[#0b0b14]"
                : "text-white/70 hover:bg-white/10"
            }`}
          >
            {token}
          </button>
        ) : (
          <span
            key={`${token}-${index}`}
            aria-hidden="true"
            className={`${baseButton} cursor-default text-white/40`}
          >
            …
          </span>
        )
      )}

      <button
        type="button"
        aria-label="Next page"
        disabled={page === totalPages}
        onClick={() => onPage(page + 1)}
        className={`${baseButton} text-white/70 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent`}
      >
        <ChevronRightIcon aria-hidden="true" className="size-4" />
      </button>
    </nav>
  )
}
