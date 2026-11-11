"use client";

import { useState } from "react";
import { HELP_COPY, HELP_IMG, helpNav } from "./data/helpCenterData";
import { ChevronGlyph, GlobeGlyph } from "./HelpCenterIcons";

function NavTree({ activeSlug }) {
  const tree = helpNav();
  const [open, setOpen] = useState({});

  return (
    <ul className="flex list-none flex-col gap-[2px] px-4 pb-8 pt-6">
      {tree.map((c) => {
        const expanded = Boolean(open[c.label]);
        return (
          <li key={c.label} className="relative isolate">
            <div className="flex items-start gap-1 rounded-lg">
              <a
                href={c.href}
                className="flex grow basis-0 items-start gap-2 rounded-lg p-2 text-[14px] font-semibold leading-5 text-[rgb(26,26,26)] hover:bg-[rgb(244,244,245)]"
              >
                <span className="flex size-5 shrink-0 items-center justify-center">
                  <img src={c.icon} alt="" className="block size-5 object-contain" />
                </span>
                <span>{c.label}</span>
              </a>
              <button
                type="button"
                aria-label={expanded ? `Collapse ${c.label}` : `Expand ${c.label}`}
                onClick={() => setOpen((s) => ({ ...s, [c.label]: !s[c.label] }))}
                className="mr-1 mt-1 flex size-7 shrink-0 items-center justify-center rounded-lg text-[rgb(89,89,89)]"
              >
                <span className={`flex size-4 ${expanded ? "rotate-90" : ""}`}>
                  <ChevronGlyph />
                </span>
              </button>
            </div>
            {expanded ? (
              <ul className="flex list-none flex-col gap-px pl-7">
                {(c.children || []).map((node) => {
                  if (node.articles) {
                    const subOpen = Boolean(open[node.label]);
                    return (
                      <li key={node.label}>
                        <div className="flex items-center gap-1 rounded-lg">
                          <a href={node.href} className="block grow rounded-lg p-2 text-[14px] font-semibold leading-5">
                            {node.label}
                          </a>
                          <button
                            type="button"
                            aria-label={subOpen ? `Collapse ${node.label}` : `Expand ${node.label}`}
                            onClick={() => setOpen((s) => ({ ...s, [node.label]: !s[node.label] }))}
                            className="mr-1 flex size-7 items-center justify-center rounded-lg"
                          >
                            <span className={`flex size-4 ${subOpen ? "rotate-90" : ""}`}>
                              <ChevronGlyph />
                            </span>
                          </button>
                        </div>
                        {subOpen ? (
                          <ul className="flex list-none flex-col gap-px pl-4">
                            {node.articles.map((a) => (
                              <li key={a.href}>
                                <a
                                  href={a.href}
                                  className={`block rounded-lg p-2 text-[14px] leading-[21.7px] ${
                                    a.slug === activeSlug ? "text-[rgb(2,88,217)]" : "text-[rgb(89,89,89)] hover:bg-[rgb(244,244,245)]"
                                  }`}
                                >
                                  {a.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    );
                  }
                  return (
                    <li key={node.href || node.label}>
                      <a
                        href={node.href}
                        className={`block rounded-lg p-2 text-[14px] leading-[21.7px] ${
                          node.slug === activeSlug ? "text-[rgb(2,88,217)]" : "text-[rgb(89,89,89)] hover:bg-[rgb(244,244,245)]"
                        }`}
                      >
                        {node.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function HelpCenterHeader() {
  return (
    <header
      role="banner"
      className="fixed inset-x-0 top-0 z-50 flex h-[60px] items-center border-b-[0.8px] border-white/12 bg-black text-white"
    >
      <div className="flex w-full items-center justify-between gap-4 px-4">
        <div className="flex grow basis-0 items-center">
          <a href="/support" aria-label={HELP_COPY.homeAria} className="flex items-center gap-3 overflow-hidden pl-2">
            <img src={HELP_IMG.logo} alt="" className="block h-8 max-w-56 shrink-0 object-contain" />
          </a>
        </div>
        <div className="flex grow basis-0 items-center justify-end gap-6">
          <nav aria-label="Help center links" className="hidden items-center gap-6 sm:flex">
            <a href="/" className="rounded-lg px-3 py-2 text-[14px] leading-[14px] text-white/78">
              {HELP_COPY.explore}
            </a>
            <a href="/contact-us" className="rounded-lg px-3 py-2 text-[14px] leading-[14px] text-white/78">
              {HELP_COPY.contact}
            </a>
          </nav>
          <div className="flex items-center gap-1 rounded-lg px-3 py-2 text-[14px] leading-[14px] text-white/78">
            <GlobeGlyph />
            {HELP_COPY.language}
          </div>
          <a
            href="/support"
            aria-label="Search docs (Ctrl K)"
            className="flex h-[30px] min-w-[140px] items-center justify-between gap-3 rounded-lg border-[0.8px] border-white/15 bg-white/5 px-4 text-[14px] leading-[21.7px] text-white/78"
          >
            <span>{HELP_COPY.search}</span>
            <kbd className="text-[12px] font-medium leading-3" style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
              Ctrl K
            </kbd>
          </a>
        </div>
      </div>
    </header>
  );
}

export function HelpCenterFooter() {
  return (
    <footer id="footer" className="shrink-0 bg-black px-0 py-12 text-left text-[14px] leading-[21.7px] text-[rgb(146,155,165)]">
      <div className="text-center">
        <a href="/support" className="no-underline">
          <img src={HELP_IMG.logoFooter} alt="Help Center" className="inline max-h-8 contrast-[0.8]" />
        </a>
        <div className="mt-10">
          <ul className="mb-4 flex list-none justify-center p-0">
            <li className="mx-3 inline-block">
              <a href="/" className="no-underline">
                {HELP_COPY.explore}
              </a>
            </li>
            <li className="mx-3 inline-block">
              <a href="/contact-us" className="no-underline">
                {HELP_COPY.contact}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default function HelpCenterShell({ children, activeSlug, hero = null }) {
  return (
    <div dir="ltr" className="min-h-full bg-white text-[15px] leading-[23.25px] text-[rgb(26,26,26)]" style={{ fontFamily: "Lato, sans-serif" }}>
      <HelpCenterHeader />
      <div className="h-[60px]" />
      {hero}
      <div className="grid w-full grid-cols-1 items-start gap-12 px-4 xl:grid-cols-[260px_minmax(0,1fr)]">
        <div className="self-stretch">
          <aside aria-label="Docs navigation" className="w-[276px] border-r-[0.8px] border-[rgba(26,26,26,0.12)] bg-white max-xl:w-full max-xl:border-r-0">
            <NavTree activeSlug={activeSlug} />
          </aside>
        </div>
        <div className="min-w-0">{children}</div>
      </div>
      <HelpCenterFooter />
    </div>
  );
}
