"use client";

import { useState } from "react";
import {
  BOOST_CHIPS,
  BOOST_VARIANTS,
  BOOST_TEXTAREA_PLACEHOLDER,
  BOOST_EXCLAMATION,
  BOOST_SAVE_MONEY,
  BOOST_TRUST,
} from "./data/eaFcBoostingData";

/* Session 22 — the interactive part of /ea-fc-boosting/b/142-4: filter
   chips + config cards + textarea + customize panel + save-money
   banner. Session 19 rendered this server-side with Division Rivals
   active (ui ux/Boosting-rivals/ capture); the user then pushed a
   second capture of the SAME URL with "Champions Finals" active
   (ui ux/Boosting-Champions-Finals/ — full diff in
   data/eaFcBoostingData.js BOOST_VARIANTS). The two captured states
   switch on chip click; chips without a captured variant do nothing
   (no reference — nothing invented). Static per captures: comboboxes
   closed, Solo active, switches off. */

function ShieldIcon() {
  /* the capture's icomoon shield glyph decodes empty → neutral inline
     SVG (documented assumption, same as every other icomoon glyph) */
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3 5 5.8v5.4c0 4.3 2.9 8.3 7 9.6 4.1-1.3 7-5.3 7-9.6V5.8L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Combobox({ field }) {
  return (
    <div className={field.full ? "max-lg:col-span-1 min-[640px]:col-span-2" : ""}>
      <div className="flex items-center">
        <div className="mb-[6px]">{field.label}</div>
      </div>
      <div aria-label={field.label}>
        <div className="flex w-full flex-col">
          <div
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded="false"
            className="relative flex items-center justify-between overflow-hidden rounded-lg bg-inputgray pt-4 pb-4 pl-[14px] pr-[14px] shadow-[rgba(0,0,0,0)_0px_0px_0px_1px_inset]"
            style={{ minHeight: 60 }}
          >
            <div className="relative flex grow basis-[0%] items-center gap-1">
              <span className="block max-w-full grow truncate basis-[0%]">{field.value}</span>
            </div>
            <div className="flex shrink-0 items-center">
              <span className="ml-2 block">
                <div className="h-6 w-6 overflow-hidden text-[rgb(98,_99,_98)]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BoostingConfigSection() {
  const [variant, setVariant] = useState("Division Rivals");
  const { cards, customize } = BOOST_VARIANTS[variant];
  const wide = cards.length === 1 && cards[0].wide;

  return (
    <>
      {/* Chips scroller */}
      <div className="mb-[10px] mt-[14px] flex gap-[14px]">
        <div className="min-w-0 max-w-full grow basis-[0%]">
          <div className="relative w-full min-w-0">
            <div className="relative isolate w-full min-w-0 overflow-hidden">
              <div className="h-full items-center overflow-hidden whitespace-nowrap">
                <div className="size-full overflow-x-auto overflow-y-hidden">
                  <div>
                    {BOOST_CHIPS.map((chip) => {
                      const selectable = chip.label in BOOST_VARIANTS;
                      const active = chip.label === variant;
                      return (
                        <div key={chip.label} className="inline-block pl-2 first:pl-0">
                          <button
                            type="button"
                            aria-pressed={active}
                            onClick={selectable ? () => setVariant(chip.label) : undefined}
                            className={`flex h-8 items-center justify-center rounded-full border-[0.8px] px-4 pt-1 pb-1 text-center text-[14px] ${
                              active
                                ? "border-[rgb(34,_33,_39)] bg-ink font-bold text-white"
                                : "border-[rgb(198,_198,_204)] bg-card"
                            }`}
                          >
                            {chip.label}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        {/* LEFT column */}
        <div className={`grid grid-cols-1 gap-8 ${wide ? "" : "min-[640px]:grid-cols-2"}`}>
          {cards.map((card) => (
            <div
              key={card.label || card.title}
              className="relative w-full rounded-2xl border-[0.8px] border-cardborder bg-card p-6"
            >
              <div className="pointer-events-none absolute inset-0 size-full overflow-hidden rounded-2xl">
                <div className="pointer-events-none h-[200px] overflow-hidden">
                  <img
                    alt="Background image"
                    src={card.bg}
                    className="pointer-events-none absolute left-0 top-0 block h-[200px] w-full object-cover object-top align-middle"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      bottom: card.fade ?? 158,
                      backgroundImage: "linear-gradient(rgba(255, 255, 255, 0) 80.25%, rgb(255, 255, 255) 100%)",
                    }}
                  />
                </div>
              </div>
              {card.icon ? (
                <>
                  <div className="pointer-events-none absolute inset-0 size-full overflow-hidden">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute h-[296px] w-[296px] left-[-70px] top-[-75px]"
                      style={{ backgroundImage: "radial-gradient(39.28% 38.28% at 50.21% 50.21%, rgba(255, 214, 106, 0.2) 0%, rgba(255, 214, 106, 0) 100%)" }}
                    />
                  </div>
                  <div className="relative mb-6 flex items-center gap-[10px]">
                    <div className="h-[90px] shrink-0 overflow-hidden">
                      <img alt="Card header icon" src={card.icon} className="block h-[90px] w-[90px] object-cover align-middle" />
                    </div>
                    <div className="font-bold">
                      <div className="mb-[10px] text-graytext">{card.label}</div>
                      <div className="text-[24px] leading-[28.8px]">{card.value}</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="relative mb-[24px] mt-[176px] text-[24px] font-bold leading-[28.8px]">
                  {card.title}
                </div>
              )}
              <form className={`relative grid gap-x-10 gap-y-4 grid-cols-1 ${wide ? "min-[640px]:grid-cols-2" : ""}`}>
                {card.fields.map((field) => (
                  <Combobox key={field.label} field={field} />
                ))}
              </form>
            </div>
          ))}

          {/* Additional information textarea card */}
          <div className="relative w-full rounded-2xl border-[0.8px] border-cardborder bg-card p-6 min-[640px]:col-span-2">
            <form className="relative grid max-lg:grid-cols-1 grid-cols-2 gap-x-10 gap-y-4">
              <div className="self-center col-span-2 max-lg:col-span-1">
                <div className="flex items-center">
                  <div className="mb-[6px]">Provide any additional information</div>
                </div>
                <div className="h-[58px]">
                  <textarea
                    rows={2}
                    placeholder={BOOST_TEXTAREA_PLACEHOLDER}
                    aria-label="Provide any additional information"
                    className="block h-[58px] w-full resize-none overflow-hidden whitespace-pre-wrap rounded-lg bg-inputgray p-[10px] leading-[normal]"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT column */}
        <div className="flex flex-col gap-8">
          {/* Customize order panel (gradient border) */}
          <div>
            <div
              className="rounded-2xl p-px"
              style={{
                backgroundColor: "rgb(209, 240, 143)",
                backgroundImage: "linear-gradient(340deg, rgba(71, 131, 255, 0) 66.76%, rgb(71, 131, 255) 96.04%)",
              }}
            >
              <div className="px-6 pt-5 pb-[17px] text-[14px] font-black uppercase tracking-[0.42px] leading-[19.6px]">
                {customize.title}
              </div>
              <div className="rounded-tl-2xl rounded-tr-2xl bg-card px-[22px] pt-6 pb-4">
                <div
                  aria-label="Solo or Duo toggle"
                  className="relative flex h-[50px] w-full items-center gap-[6px] rounded-2xl border-[0.8px] border-cardborder bg-card pr-[2px] pl-[2px]"
                >
                  <div
                    aria-hidden="true"
                    className="absolute h-11 left-[2px] w-[calc(50%-5px)] rounded-[0.9375rem] border-[0.8px] border-cardborder bg-inputgray"
                  />
                  {customize.modes.map((mode) => (
                    <div
                      key={mode.label}
                      aria-label={mode.active ? mode.label : `Select ${mode.label}`}
                      role="button"
                      aria-disabled={mode.active}
                      className={`z-[1] flex h-11 grow basis-[0%] flex-col items-center justify-center rounded-2xl pt-[7px] pb-[7px] ${mode.active ? "pointer-events-none" : ""}`}
                    >
                      <div className="pointer-events-none text-center text-[14px] leading-[21px]">{mode.label}</div>
                    </div>
                  ))}
                </div>
                {customize.switches.map((sw) => (
                  <div key={sw.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-ink">{sw.label}</div>
                    <div className="flex h-10 w-16 items-center justify-center">
                      <label className="relative block h-5 w-12">
                        <input type="checkbox" aria-label={sw.label} readOnly checked={sw.on} className="inline-block h-0 w-0 opacity-0" />
                        <span aria-hidden="true" className="absolute inset-0 block rounded-2xl bg-inputgray">
                          <span
                            className="absolute z-[1] block h-6 w-6 rounded-[50%] bg-card shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,_rgba(9,9,11,0.02)_0px_12px_8px_0px]"
                            style={{ top: -2, left: sw.on ? 20 : 0 }}
                          />
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              {customize.alert ? (
                <div className="rounded-bl-2xl rounded-br-2xl bg-card px-[22px] pt-[22px] pb-7 shadow-[rgb(231,231,231)_0px_1px_0px_0px_inset]">
                  <div className="flex flex-col gap-[10px] rounded-2xl border-[0.8px] border-[rgb(71,_131,_255)] bg-[rgba(71,_131,_255,_0.2)] p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-[26px] shrink-0 overflow-hidden">
                        <img alt="Exclamation mark" src={BOOST_EXCLAMATION} className="block h-[26px] w-[27px] object-cover align-middle" />
                      </div>
                      <p className="font-bold">{customize.alert.title}</p>
                    </div>
                    <p className="text-[14px] leading-[21px]">{customize.alert.body}</p>
                    <div>
                      <button
                        type="button"
                        aria-label={customize.alert.button}
                        className="inline-block min-h-[42px] min-w-[70px] w-full overflow-hidden rounded-lg bg-[rgb(40,_39,_46)] px-4 pt-[10px] pb-[10px] text-center text-[14px] font-bold leading-[21px] text-white"
                      >
                        <span className="flex items-center justify-center gap-[6px] text-center">
                          <span className="block text-center">{customize.alert.button}</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-bl-2xl rounded-br-2xl bg-card px-[22px] pt-[22px] pb-7 shadow-[rgb(231,231,231)_0px_1px_0px_0px_inset]">
                  <button
                    type="button"
                    aria-label={customize.offerCta.button}
                    className="inline-block min-h-14 min-w-[70px] w-full overflow-hidden rounded-lg bg-[rgb(34,_33,_39)] px-4 pt-3 pb-3 text-center text-[14px] font-bold leading-[21px] text-white"
                  >
                    <span className="flex items-center justify-center gap-[6px] text-center">
                      <span className="block text-center">{customize.offerCta.button}</span>
                    </span>
                  </button>
                  <div className="mt-[12px] flex w-full items-center justify-center gap-[4px] text-[14px] leading-[19.6px]">
                    <span className="block text-ink">
                      <ShieldIcon />
                    </span>
                    <span className="block">{customize.offerCta.protectionPrefix}</span>
                    <span className="block text-[rgb(45,_94,_173)] underline">{customize.offerCta.protectionLink}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save money banner */}
          <div className="relative flex overflow-hidden rounded-lg border-[0.8px] border-cardborder bg-card px-4 pt-3 pb-3">
            <picture className="z-[0]">
              <img
                alt="Save money banner background image"
                src={BOOST_SAVE_MONEY.bg}
                className="pointer-events-none absolute left-0 top-0 block size-full max-w-full object-cover object-top align-middle"
              />
            </picture>
            <div className="relative z-[10] flex max-w-[calc(100%-80px)] flex-col gap-2">
              <div className="whitespace-nowrap text-[14px] font-bold leading-[19.6px] max-lg:whitespace-normal">
                Save up to{" "}
                <span className="relative ml-1 mr-1 inline-block px-2">
                  <span aria-hidden="true" className="absolute left-0 top-[50%] z-[-10] h-[23px] w-[52px] overflow-hidden align-middle">
                    <img src={BOOST_SAVE_MONEY.badge} alt="" className="block size-full" />
                  </span>
                  <span className="relative z-[10] text-[18px] font-black leading-[27px] text-black">60%</span>
                </span>{" "}
                on boosting.
              </div>
              <div className="text-[14px] leading-[19.6px] text-graytext">
                Hundreds of boosters compete, so prices stay low.
              </div>
            </div>
            <div aria-hidden="true" className="absolute bottom-0 right-4 z-[0] h-[78px] w-[78px] shrink-0 overflow-hidden">
              <img alt="Money Dragon image" src={BOOST_SAVE_MONEY.dragon} className="block h-[78px] w-[78px] object-cover align-middle" />
            </div>
          </div>
        </div>

        {/* Why trust card (row 2, left cell) */}
        <div className="max-w-3xl">
          <div className="relative overflow-hidden rounded-2xl border-[0.8px] border-cardborder bg-card px-5 pt-6 pb-6">
            <picture>
              <img
                alt="Trust background image"
                src={BOOST_TRUST.bg}
                className="pointer-events-none absolute left-0 top-0 block size-full max-w-full object-cover object-top align-middle"
              />
            </picture>
            <div className="relative mb-6">
              <div className="mb-2 text-[24px] font-bold leading-[normal]">{BOOST_TRUST.title}</div>
              <div className="text-graytext">{BOOST_TRUST.sub}</div>
            </div>
            <div className="relative grid grid-cols-1 gap-x-8 min-[640px]:grid-cols-2">
              {BOOST_TRUST.rows.map((row, i) => (
                <div
                  key={row}
                  className={`flex items-center gap-2 py-[15px] ${
                    i < 2 ? "border-y-[0.8px]" : "border-b-[0.8px]"
                  } border-cardborder`}
                >
                  <div className="h-[18px] shrink-0 overflow-hidden">
                    <img alt="Trust checkbox image" src={BOOST_TRUST.checkbox} className="block h-[18px] w-[18px] object-cover align-middle" />
                  </div>
                  <div className="text-[18px] leading-[27px]">{row}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
