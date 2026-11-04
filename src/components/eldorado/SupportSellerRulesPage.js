"use client";

import { useState } from "react";
import {
  SUPPORT_IMAGES,
  SUPPORT_NAV,
  SUPPORT_ARTICLE,
  SELLER_RULES_BODY,
} from "./data/sellerRulesData";

/* support.eldorado.gg help-center article page (session 24/25; the
   user-pushed Seller rules capture → sellerrules-1920px-light-{1,2}.tsx):
   fixed black 60px header (logo, Explore Eldorado / Contact us / English
   globe / Ctrl-K search pill), then a 260px|1fr|240px grid: fixed 276px
   docs-nav accordion (capture state verbatim; sections toggle),
   830px article column (breadcrumb, 36px h1, description, updated +
   "Copy for LLM" actions, body blocks, dispute-response table, feedback
   thumbs, related articles) and the "On this page" TOC column.
   Below 1024 the capture has no reference — the columns stack in DOM
   order and the fixed aside becomes a static block (documented). */

function ChevronDown({ className = "" }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M4 8.5h16L12 17.5 4 8.5Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function Segments({ segments }) {
  return segments.map((s, i) => {
    if (typeof s === "string") return <span key={i}>{s}</span>;
    if (s.b) return <b key={i} className="font-bold">{s.b}</b>;
    return (
      <a key={i} href={s.href} className="text-left underline text-[rgb(2,_88,_217)]">
        {s.a}
      </a>
    );
  });
}

function BodyBlock({ block }) {
  if (block.type === "h2") {
    return (
      <h2 id={block.id} className="mb-[12px] text-left text-[22px] font-semibold leading-[27.5px]">
        {block.text}
      </h2>
    );
  }
  if (block.type === "p") {
    return (
      <p className="mb-[16px] text-left text-[15px] leading-[23.25px]">
        <Segments segments={block.segments} />
      </p>
    );
  }
  if (block.type === "links") {
    return (
      <ul className="mb-[16px] list-disc pl-6 text-left">
        {block.items.map((it) => (
          <li key={it.label} className="mb-[8px]">
            <a href={it.href} className="text-left underline text-[rgb(2,_88,_217)]">
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "ul") {
    return (
      <ul className="mb-[16px] list-disc pl-6 text-left">
        {block.items.map((it, i) => (
          <li key={i} className="mb-[8px]">
            <p className="text-left text-[15px] leading-[23.25px]">
              {it.lead && <b className="font-bold">{it.lead}</b>}
              <Segments segments={it.segments} />
            </p>
            {it.nested && (
              <ul className="mb-[16px] mt-[8px] list-disc pl-6">
                {it.nested.map((n) => (
                  <li key={n} className="mb-[8px]">
                    {n}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "table") {
    return (
      <table className="mb-[24px] w-full table rounded-md border-[0.8px] border-[rgba(9,9,11,0.15)] text-left text-[14px] leading-[21px]">
        <tbody className="table-row-group align-top">
          <tr className="table-row align-top">
            {block.head.map((h) => (
              <th
                key={h}
                className="table-cell border-b-[0.8px] border-r-[0.8px] border-[rgba(9,9,11,0.15)] bg-[rgba(232,_232,_232,_0.5)] py-1 pl-3 pr-3 pt-1 font-semibold align-top first:rounded-tl-[5px] last:rounded-tr-[5px] last:border-r-0"
              >
                {h}
              </th>
            ))}
          </tr>
          {block.rows.map((row, ri) => (
            <tr key={ri} className="table-row align-top">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`table-cell border-b-[0.8px] border-[rgba(9,9,11,0.15)] py-1 pl-3 pr-3 align-top ${
                    ci === 0 ? "border-r-[0.8px]" : ""
                  } ${ri === block.rows.length - 1 ? "border-b-0" : ""}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  return null;
}

function DocsNav() {
  const [state, setState] = useState(() =>
    Object.fromEntries(
      SUPPORT_NAV.flatMap((c) => [
        [c.label, c.expanded],
        ...(c.articles ?? [])
          .filter((a) => a.collection)
          .map((a) => [a.label, a.expanded]),
      ])
    )
  );
  const toggle = (label) => setState((s) => ({ ...s, [label]: !s[label] }));

  return (
    <div className="flex flex-col gap-[2px] py-4 pl-2 pr-2">
      <a
        href="https://support.eldorado.gg/en/"
        className="flex items-center gap-[6px] rounded-lg p-2 text-[14px] font-semibold leading-[20px] text-[rgb(26,_26,_26)] hover:bg-[rgb(244,_244,_245)]"
      >
        All Collections
        <span className="flex text-[color(srgb_0.34902_0.34902_0.34902_/_0.68)]">
          <img alt="" src={SUPPORT_IMAGES.collectionIcon} className="block size-3" />
        </span>
      </a>
      {SUPPORT_NAV.map((c) => {
        const open = state[c.label];
        return (
          <div key={c.label}>
            <div className="flex items-center">
              <a
                href={c.href}
                className="block grow basis-0 rounded-lg p-2 text-[14px] font-semibold leading-[20px] text-[rgb(26,_26,_26)] hover:bg-[rgb(244,_244,_245)]"
              >
                {c.label}
              </a>
              <button
                type="button"
                aria-label={`${open ? "Collapse" : "Expand"} ${c.label}`}
                onClick={() => toggle(c.label)}
                className="mr-[4px] flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/0 text-[rgb(89,_89,_89)]/68"
              >
                <ChevronDown className={open ? "" : "-rotate-90"} />
              </button>
            </div>
            {open && (
              <div className="overflow-hidden">
                <ul className="flex flex-col gap-[1px] pl-4">
                  {c.articles.map((a) => {
                    if (a.collection) {
                      const subOpen = state[a.label];
                      return (
                        <li key={a.label} className="list-none">
                          <div className="flex items-center">
                            <a
                              href={a.href}
                              className="block grow basis-0 rounded-lg p-2 text-[14px] font-semibold leading-[20px] text-[rgb(26,_26,_26)] hover:bg-[rgb(244,_244,_245)]"
                            >
                              {a.label}
                            </a>
                            <button
                              type="button"
                              aria-label={`${subOpen ? "Collapse" : "Expand"} ${a.label}`}
                              onClick={() => toggle(a.label)}
                              className="mr-[4px] flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/0 text-[rgb(89,_89,_89)]/68"
                            >
                              <ChevronDown className={subOpen ? "" : "-rotate-90"} />
                            </button>
                          </div>
                          {subOpen && (
                            <div className="overflow-hidden">
                              <ul className="flex flex-col gap-[1px] pl-4">
                                {a.children.map((ch) => (
                                  <li key={ch.label} className="list-none relative">
                                    {ch.active && (
                                      <span
                                        aria-hidden="true"
                                        className="absolute left-[-26.5px] top-[10px] h-4 w-[2px] rounded-[1px] bg-[rgb(2,_88,_217)]"
                                      />
                                    )}
                                    <a
                                      href={ch.href}
                                      className={`block w-full rounded-lg p-2 text-[14px] leading-[21.7px] ${
                                        ch.active
                                          ? "text-[rgb(2,_88,_217)]"
                                          : "text-[rgb(89,_89,_89)] hover:bg-[rgb(244,_244,_245)]"
                                      }`}
                                    >
                                      {ch.label}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </li>
                      );
                    }
                    return (
                      <li key={a.label} className="list-none">
                        <a
                          href={a.href}
                          className="block w-full rounded-lg p-2 text-[14px] leading-[21.7px] text-[rgb(89,_89,_89)] hover:bg-[rgb(244,_244,_245)]"
                        >
                          {a.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function SupportSellerRulesPage() {
  const art = SUPPORT_ARTICLE;
  return (
    <div className="min-h-full bg-white text-[rgb(26,_26,_26)]">
      {/* fixed black support header (capture: h-60) */}
      <header
        role="banner"
        className="fixed left-0 right-0 top-0 z-50 flex h-[60px] items-center border-b-[0.8px] border-b-white/12 bg-black text-white"
      >
        <div className="flex w-full items-center justify-between gap-4 px-4">
          <div className="flex grow basis-0 items-center">
            <a
              href="https://support.eldorado.gg/en/"
              aria-label="Help Center home"
              className="flex items-center overflow-hidden gap-3 pl-2"
            >
              <img
                src={SUPPORT_IMAGES.logo}
                alt="Eldorado Help Center"
                className="block h-8 max-w-56 shrink-0 object-contain align-middle"
              />
            </a>
          </div>
          <div className="flex grow basis-0 items-center justify-end gap-6">
            <nav aria-label="Help center links" className="flex shrink-0 items-center gap-6">
              <a
                href="https://www.eldorado.gg/"
                className="block whitespace-nowrap rounded-lg px-3 pb-2 pt-2 text-[14px] leading-[14px] text-white/78"
              >
                Explore Eldorado
              </a>
              <a
                href="https://www.eldorado.gg/contact-us"
                className="block whitespace-nowrap rounded-lg px-3 pb-2 pt-2 text-[14px] leading-[14px] text-white/78"
              >
                Contact us
              </a>
            </nav>
            <div className="flex shrink-0 items-center whitespace-nowrap rounded-lg px-3 pb-2 pt-2 text-[14px] leading-[14px] text-white/78">
              <div className="flex items-center gap-1 overflow-hidden pt-0.5 pb-0.5">
                <img alt="" src={SUPPORT_IMAGES.globe} className="block size-3.5 shrink-0" />
                English
                <img alt="" src={SUPPORT_IMAGES.chevron} className="block size-3.5 shrink-0" />
              </div>
            </div>
            <button
              type="button"
              aria-label="Search docs (Ctrl K)"
              aria-haspopup="dialog"
              className="flex h-[30px] shrink-0 items-center justify-between gap-3 rounded-lg border-[0.8px] border-white/15 bg-white/5 px-4 text-[14px] leading-[21.7px] text-white/78"
            >
              <span className="block">Search</span>
              <kbd className="flex items-baseline text-[12px] font-medium leading-[12px]" style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}>
                Ctrl K
              </kbd>
            </button>
          </div>
        </div>
      </header>
      <div className="h-[60px]" />

      {/* 260px | 1fr | 240px grid per the 1920 capture */}
      <div
        className="grid w-full items-start gap-[48px] px-4 pb-16 max-xl:flex max-xl:flex-col"
        style={{ gridTemplateColumns: "260px minmax(0, 1fr) 240px" }}
      >
        {/* docs nav: the capture wraps the fixed 276px aside in a
            self-stretch grid placeholder — the wrapper keeps the 260px
            column while the aside pins to the viewport */}
        <div className="self-stretch">
          <aside
            aria-label="Docs navigation"
            className="self-start bg-white max-xl:static max-xl:w-full xl:fixed xl:left-0 xl:top-[60px] xl:h-[1140px] xl:w-[276px] xl:border-r-[0.8px] xl:border-r-[rgb(229,_231,_235)]"
          >
            <div className="max-xl:rounded-lg max-xl:border max-xl:border-[rgb(229,_231,_235)]">
              <DocsNav />
            </div>
          </aside>
        </div>

        {/* article column */}
        <main className="mx-auto ml-auto mr-auto flex size-full max-w-[830px] flex-col pb-16 pt-8 max-xl:max-w-none">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-2 text-[14px] text-[rgb(89,_89,_89)]"
          >
            {art.breadcrumb.map((b) => (
              <span key={b.label} className="flex items-center gap-2">
                <a href={b.href} className="block max-w-full truncate hover:underline">
                  {b.label}
                </a>
                <span className="flex text-[color(srgb_0.34902_0.34902_0.34902_/_0.68)]">
                  <img alt="" src={SUPPORT_IMAGES.breadcrumbChevron} className="block size-3" />
                </span>
              </span>
            ))}
            <span className="flex items-center gap-2">
              <span className="flex text-[color(srgb_0.34902_0.34902_0.34902_/_0.68)]">
                <img alt="" src={SUPPORT_IMAGES.breadcrumbCurrent} className="block size-3" />
              </span>
              <span className="block max-w-[301.6px] truncate text-[rgb(26,_26,_26)]">{art.current}</span>
            </span>
          </nav>

          <header className="mb-[32px] border-b-[0.8px] border-[rgba(9,9,11,0.15)] pb-8">
            <h1 className="mb-[12px] text-[36px] font-semibold leading-[40.32px]">{art.title}</h1>
            <p className="mb-[24px] text-[18px] leading-[27.9px] text-[rgb(89,_89,_89)]">{art.description}</p>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center text-[rgb(89,_89,_89)]">
                <div className="whitespace-nowrap text-[13px] leading-[18.2px] text-[rgb(89,_89,_89)]">
                  <time>{art.updated}</time>
                </div>
              </div>
              <div className="w-fit">
                <div aria-label="Article actions" role="group" className="inline-flex max-w-full items-stretch">
                  <button
                    type="button"
                    className="flex h-8 items-center gap-1 whitespace-nowrap rounded-bl-lg rounded-tl-lg border-[0.8px] border-[rgba(9,9,11,0.15)] bg-white pl-3 pr-3 text-[12px] font-bold leading-[12px]"
                  >
                    <span className="flex shrink-0">
                      <img alt="" src={SUPPORT_IMAGES.copyLlm} className="block size-4" />
                    </span>
                    Copy for LLM
                  </button>
                  <button
                    type="button"
                    aria-label="More article actions"
                    aria-haspopup="menu"
                    className="-ml-px flex h-8 items-center justify-center rounded-br-lg rounded-tr-lg border-[0.8px] border-[rgba(9,9,11,0.15)] bg-white px-2 text-[rgb(89,_89,_89)]"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <circle cx="5" cy="12" r="1.6" />
                      <circle cx="12" cy="12" r="1.6" />
                      <circle cx="19" cy="12" r="1.6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </header>

          <article>
            {SELLER_RULES_BODY.map((block, i) => (
              <BodyBlock key={i} block={block} />
            ))}
          </article>

          {/* feedback fieldset (mt-48 pt-8 border-t per capture) */}
          <div className="mt-[48px] border-t-[0.8px] border-[rgba(9,9,11,0.15)] pt-8">
            <fieldset>
              <legend className="mb-[12px] text-[14px] leading-[21.7px] text-[rgb(89,_89,_89)]">
                Did this answer your question?
              </legend>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Yes, this answered my question"
                  className="flex h-10 w-10 items-center justify-center rounded-md border-[0.8px] border-[rgba(9,9,11,0.15)] bg-black/0 text-[rgb(89,_89,_89)] hover:bg-[rgb(244,_244,_245)]"
                >
                  <img alt="" src={SUPPORT_IMAGES.feedbackUp} className="block size-[22px]" />
                </button>
                <button
                  type="button"
                  aria-label="No, this did not answer my question"
                  className="flex h-10 w-10 items-center justify-center rounded-md border-[0.8px] border-[rgba(9,9,11,0.15)] bg-black/0 text-[rgb(89,_89,_89)] hover:bg-[rgb(244,_244,_245)]"
                >
                  <img alt="" src={SUPPORT_IMAGES.feedbackDown} className="block size-[22px]" />
                </button>
                <button
                  type="button"
                  aria-label="Submit feedback"
                  className="flex h-10 items-center justify-center rounded-md border-[0.8px] border-[rgba(9,9,11,0.15)] bg-black/0 px-3 text-[14px] font-semibold text-[rgb(26,_26,_26)] hover:bg-[rgb(244,_244,_245)]"
                >
                  Submit
                </button>
              </div>
            </fieldset>

            {/* related articles */}
            <div className="mt-8">
              <h2 className="mb-[16px] text-[19px] font-semibold leading-[24.7px]">Related Articles</h2>
              <div className="flex flex-col">
                {art.related.map((r) => (
                  <a
                    key={r.label}
                    href={r.href}
                    className="-mx-3 grid items-center gap-3 rounded-lg py-2 pl-3 pr-3 pt-2 hover:bg-[rgb(244,_244,_245)]"
                    style={{ gridTemplateColumns: "minmax(0px, 1fr) 20px" }}
                  >
                    <span className="block truncate text-[14px] font-semibold leading-[21.7px]">{r.label}</span>
                    <ChevronDown className="-rotate-90 text-[rgb(89,_89,_89)]" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* On this page TOC (240px column) */}
        <div className="hidden pt-8 xl:block">
          <div className="sticky top-[84px] text-[14px]">
            <div className="mb-[10px] font-semibold text-[rgb(26,_26,_26)]">On this page</div>
            <ul className="flex flex-col gap-[6px] border-l-[0.8px] border-l-[rgb(229,_231,_235)] pl-3">
              {art.toc.map((t) => (
                <li key={t}>
                  <a href={`#${t.toLowerCase().replace(/[^a-z]+/g, "-")}`} className="block text-[rgb(89,_89,_89)] hover:text-[rgb(26,_26,_26)] hover:underline">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
