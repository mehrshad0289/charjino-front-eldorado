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
      <p
        className={`mb-[16px] min-h-[22.95px] text-[15px] leading-[23.25px] ${
          block.justify ? "text-justify" : "text-left"
        }`}
      >
        {block.bold ? <b className="font-bold"><Segments segments={block.segments} /></b> : <Segments segments={block.segments} />}
      </p>
    );
  }
  if (block.type === "links") {
    return (
      <ul className="mb-[16px] mt-[16px] list-disc pl-6 text-left">
        {block.items.map((it) => (
          <li key={it.label} className="mb-[8px] min-h-[22.95px]">
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
      <ul className="mb-[16px] mt-[16px] list-disc pl-6 text-left">
        {block.items.map((it, i) => (
          <li key={i} className="mb-[8px]">
            <p className="text-left min-h-[22.95px]">
              {it.lead && <b className="font-bold">{it.lead}</b>}
              <Segments segments={it.segments} />
            </p>
            {(it.paras ?? []).map((p, j) => (
              <p key={j} className="text-left min-h-[22.95px]">
                {p}
              </p>
            ))}
            {it.nested && (
              <ul className="mb-[16px] mt-[16px] list-disc pl-6">
                {it.nested.map((n) => (
                  <li key={n} className="mb-[8px]">
                    <p className="text-left min-h-[22.95px]">{n}</p>
                  </li>
                ))}
              </ul>
            )}
            {(it.tail ?? []).map((t, j) => (
              <p key={j} className="text-left min-h-[22.95px]">
                {t.lead && <b className="font-bold">{t.lead}</b>}
                <Segments segments={t.segments} />
              </p>
            ))}
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "table") {
    return (
      <table className="mb-[24px] w-full table rounded-md border-[0.8px] border-[rgba(26,_26,_26,_0.15)] text-left text-[14px] leading-[21px]">
        <tbody className="table-row-group align-top">
          <tr className="table-row align-top">
            {block.head.map((h) => (
              <th
                key={h}
                className="table-cell border-b-[0.8px] border-r-[0.8px] border-[rgba(26,_26,_26,_0.15)] bg-[rgba(232,_232,_232,_0.5)] pb-1 pl-3 pr-3 pt-1 font-semibold align-top first:rounded-tl-[5px] last:rounded-tr-[5px] last:border-r-0"
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
                  className={`table-cell border-b-[0.8px] border-[rgba(26,_26,_26,_0.15)] pb-2 pl-3 pr-3 pt-2 align-top ${
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

function RowChevron({ open, src }) {
  return (
    <button
      type="button"
      aria-label={`${open ? "Collapse" : "Expand"}`}
      className="mr-[4px] flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/0 text-[color(srgb_0.34902_0.34902_0.34902_/_0.68)]"
    >
      <span className={`flex h-4 w-4 text-center ${open ? "rotate-90" : ""}`}>
        <img alt="" src={src} className="block h-4 w-4 max-w-full fill-none overflow-hidden align-middle" />
      </span>
    </button>
  );
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
  const articleLink = (ch) => (
    <a
      key={ch.label}
      href={ch.href}
      className={`block w-full rounded-lg p-2 text-[14px] leading-[21.7px] ${
        ch.active ? "text-[rgb(2,_88,_217)]" : "text-[rgb(89,_89,_89)] hover:bg-[rgb(244,_244,_245)]"
      }`}
    >
      {ch.active && (
        <span
          aria-hidden="true"
          className="absolute left-[-26.5px] top-[18.85px] h-4 w-[2px] rounded-[1px] bg-[rgb(2,_88,_217)]"
        />
      )}
      {ch.label}
    </a>
  );

  return (
    <ul className="flex list-none flex-col gap-[2px] pb-8 pl-4 pr-4 pt-6">
      {SUPPORT_NAV.map((c) => {
        const open = state[c.label];
        return (
          <li key={c.label} className="relative isolate">
            <div className="flex items-start gap-[4px] rounded-lg">
              <a
                href={c.href}
                className="flex grow basis-0 items-start gap-[8px] rounded-lg p-2 text-[14px] font-semibold leading-[20px] text-[rgb(26,_26,_26)] hover:bg-[rgb(244,_244,_245)]"
              >
                {c.icon && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                    <img alt="" src={c.icon} className="block size-full" />
                  </span>
                )}
                <span>{c.label}</span>
              </a>
              {c.chevron && (
                <button
                  type="button"
                  aria-label={`${open ? "Collapse" : "Expand"} ${c.label}`}
                  onClick={() => toggle(c.label)}
                  className="mr-[4px] flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/0 text-[color(srgb_0.34902_0.34902_0.34902_/_0.68)]"
                >
                  <span className={`flex h-4 w-4 text-center ${open ? "rotate-90" : ""}`}>
                    <img alt="" src={c.chevron} className="block h-4 w-4 max-w-full fill-none overflow-hidden align-middle" />
                  </span>
                </button>
              )}
            </div>
            {open && c.articles && c.articles.length > 0 && (
              <ul className="relative flex list-none flex-col gap-[1px] pl-7">
                {c.articles.map((a) => {
                  if (a.collection) {
                    const subOpen = state[a.label];
                    return (
                      <li key={a.label} className="relative isolate">
                        <div className="flex items-center gap-[4px] rounded-lg">
                          <a
                            href={a.href}
                            className="block grow basis-0 rounded-lg p-2 text-[14px] font-semibold leading-[20px] text-[rgb(26,_26,_26)] hover:bg-[rgb(244,_244,_245)]"
                          >
                            {a.label}
                          </a>
                          {a.chevron && (
                            <button
                              type="button"
                              aria-label={`${subOpen ? "Collapse" : "Expand"} ${a.label}`}
                              onClick={() => toggle(a.label)}
                              className="mr-[4px] flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/0 text-[color(srgb_0.34902_0.34902_0.34902_/_0.68)]"
                            >
                              <span className={`flex h-4 w-4 text-center ${subOpen ? "rotate-90" : ""}`}>
                                <img alt="" src={a.chevron} className="block h-4 w-4 max-w-full fill-none overflow-hidden align-middle" />
                              </span>
                            </button>
                          )}
                        </div>
                        {subOpen && a.children && a.children.length > 0 && (
                          <ul className="flex list-none flex-col gap-[1px] pl-4">
                            {a.children.map((ch) => (
                              <li key={ch.label} className="list-none relative">
                                {articleLink(ch, true)}
                              </li>
                            ))}
                          </ul>
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
            )}
          </li>
        );
      })}
    </ul>
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
              href="/support"
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
            {art.breadcrumb.map((b, bi) => (
              <span key={b.label} className="flex items-center gap-2">
                <a href={b.href} className="block max-w-full truncate hover:underline">
                  {b.label}
                </a>
                <span className="flex text-[color(srgb_0.34902_0.34902_0.34902_/_0.68)]">
                  <img
                    alt=""
                    src={bi === 0 ? SUPPORT_IMAGES.breadcrumbChevron : SUPPORT_IMAGES.breadcrumbChevron2}
                    className="block size-3"
                  />
                </span>
              </span>
            ))}
            <span className="block max-w-[301.6px] truncate text-[rgb(26,_26,_26)]">{art.current}</span>
          </nav>

          <header className="mb-[32px] border-b-[0.8px] border-[rgba(26,_26,_26,_0.15)] pb-8">
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
                    className="flex h-8 items-center gap-1 whitespace-nowrap rounded-bl-lg rounded-tl-lg border-[0.8px] border-[rgba(26,_26,_26,_0.15)] bg-white pl-3 pr-3 text-[12px] font-bold leading-[12px]"
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
                    className="-ml-px flex h-8 items-center justify-center rounded-br-lg rounded-tr-lg border-[0.8px] border-[rgba(26,_26,_26,_0.15)] bg-white px-2 text-[rgb(89,_89,_89)]"
                  >
                    <img alt="" src={SUPPORT_IMAGES.moreActions} className="block size-4" />
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
          <div className="mt-[48px] border-t-[0.8px] border-[rgba(26,_26,_26,_0.15)] pt-8">
            <fieldset>
              <legend className="mb-[12px] text-[14px] leading-[21.7px] text-[rgb(89,_89,_89)]">
                Did this answer your question?
              </legend>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Yes, this answered my question"
                  className="flex h-10 w-10 items-center justify-center rounded-md border-[0.8px] border-[rgba(26,_26,_26,_0.15)] bg-black/0 text-[rgb(89,_89,_89)] hover:bg-[rgb(244,_244,_245)]"
                >
                  <img alt="" src={SUPPORT_IMAGES.feedbackUp} className="block size-[22px]" />
                </button>
                <button
                  type="button"
                  aria-label="No, this did not answer my question"
                  className="flex h-10 w-10 items-center justify-center rounded-md border-[0.8px] border-[rgba(26,_26,_26,_0.15)] bg-black/0 text-[rgb(89,_89,_89)] hover:bg-[rgb(244,_244,_245)]"
                >
                  <img alt="" src={SUPPORT_IMAGES.feedbackDown} className="block size-[22px]" />
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
                    <img alt="" src={SUPPORT_IMAGES.relatedArrow} className="block size-full" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* On this page TOC — capture: fixed w-60 top-[60px] right-4 */}
        <div className="hidden max-xl:hidden xl:block">
          <div className="fixed top-[60px] right-4 w-60 overflow-auto pb-8" style={{ gridArea: "1 / 3 / 2 / 4" }}>
            <nav
              aria-label="On this page"
              className="border-l-[0.8px] pb-4 pl-4 pt-8"
              style={{ borderLeftColor: "color(srgb 0.101961 0.101961 0.101961 / 0.12)" }}
            >
              <div className="mb-[12px] text-[13px] font-semibold leading-[20.15px] text-[rgb(26,_26,_26)]">On this page</div>
              <ul className="flex flex-col gap-[8px]">
                {art.toc.map((t) => (
                  <li key={t.anchor} className="relative list-none">
                    {t.active && (
                      <span
                        aria-hidden="true"
                        className="absolute left-[-17.5px] top-[8.4px] h-4 w-[2px] rounded-[1px] bg-[rgb(2,_88,_217)]"
                      />
                    )}
                    <a
                      href={`#${t.anchor}`}
                      className={`block pl-3 text-[12px] leading-[16.8px] ${
                        t.active ? "text-[rgb(2,_88,_217)]" : "text-[rgb(89,_89,_89)] hover:text-[rgb(26,_26,_26)] hover:underline"
                      }`}
                    >
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
