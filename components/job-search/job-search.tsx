import { SearchIcon } from "lucide-react"

/** Search bar above the browse list (screenshot: dark field + white
 *  "Search Jobs" button). Submit-driven on purpose — pressing the button is
 *  what commits the query, so the page never has to reset the page number
 *  from inside an effect. */
export function JobSearch({
  value,
  onChange,
  onSubmit,
}: {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}) {
  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <div className="flex h-[54px] flex-1 items-center gap-3 rounded-[12px] border border-white/10 bg-[#151516] px-4 transition-colors focus-within:border-[#5c53fe]/70">
        <SearchIcon
          aria-hidden="true"
          className="size-4 shrink-0 text-white/40"
        />
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search job title, keywords..."
          aria-label="Search jobs"
          className="h-full w-full bg-transparent font-inter text-[15px] text-white outline-none placeholder:text-white/40"
        />
      </div>

      <button
        type="submit"
        className="h-[54px] shrink-0 cursor-pointer rounded-[12px] bg-white px-7 font-manrope text-[15px] font-semibold text-[#0b0b14] transition-colors hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-[#5c53fe]/60 focus-visible:outline-none"
      >
        Search Jobs
      </button>
    </form>
  )
}
