import Logo from "./Logo";

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="#55555E" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="#55555E" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function HeaderBar() {
  return (
    <header className="bg-white">
      <div className="flex h-[60px] items-center justify-between px-4 md:px-6">
        <a href="/" aria-label="Eldorado logo" className="shrink-0">
          <Logo className="hidden md:block" />
          <Logo iconOnly className="md:hidden" />
        </a>

        <div className="hidden flex-1 justify-center pl-16 md:flex">
          <button
            type="button"
            className="flex h-10 w-full max-w-[500px] items-center gap-2.5 rounded-lg border border-hairline bg-white px-3.5 text-left text-sm text-secondary"
          >
            <SearchIcon />
            <span>Search for games, keyword</span>
          </button>
        </div>

        <button
          type="button"
          className="h-[42px] shrink-0 rounded-lg bg-brand px-4 text-sm font-bold text-ink"
        >
          Log in
        </button>
      </div>

      {/* mobile full-width search row */}
      <div className="px-4 pb-3 md:hidden">
        <button
          type="button"
          className="flex h-10 w-full items-center gap-2.5 rounded-lg border border-hairline bg-white px-3.5 text-left text-sm text-secondary"
        >
          <SearchIcon />
          <span>Search for games, keywords, utilities...</span>
        </button>
      </div>
    </header>
  );
}
