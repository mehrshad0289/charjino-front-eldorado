import { SHOP_ITEM_GAME, SHOP_ITEM_TABS } from "./data/shopItemData";

/* Dark game sub-nav from the shop-item capture (h-14, bg rgb(40,40,54)):
   28px rounded game icon + bold white game name on the left, centered tab
   row (1fr 2fr 1fr grid per capture). Active tab = white bold + 2px white
   bottom border + a blurred yellow glow gradient (kept verbatim). Inactive
   tabs rgb(168,170,179). Below md the tabs scroll horizontally (capture is
   1920-only; documented approximation like the rest of the shop family).

   Session 19: parameterized so the ea-fc-boosting page can reuse it with
   its own game + tabs + content width (the boosting capture uses a
   1208px content column vs the shop family's 1576px). Defaults keep the
   roblox-items behavior byte-identical. */

export default function ShopItemSubNav({
  game = SHOP_ITEM_GAME,
  tabs = SHOP_ITEM_TABS,
  contentWidth = "md:w-[1576px]",
}) {
  return (
    <div className="flex w-full items-center">
      <div className="w-full bg-[rgb(40,40,54)] shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,_rgba(9,9,11,0.02)_0px_12px_8px_0px]">
        <div className={`mx-auto grid h-14 w-full max-w-full grid-cols-[1fr_2fr_1fr] px-6 md:w-auto ${contentWidth}`}>
          <div className="flex items-center">
            <div className="h-7 shrink-0 overflow-hidden">
              <img
                alt={game.alt || "game icon"}
                src={game.icon}
                className="block h-7 w-7 rounded-sm object-cover align-middle"
              />
            </div>
            <div className="ml-2 font-bold leading-[20px] text-white">
              {game.name}
            </div>
          </div>
          <nav className="hidden items-center justify-center md:flex">
            <div>
              <div className="flex items-center justify-center">
                {tabs.map((t) => {
                  const active = !!t.active;
                  return (
                    <a
                      key={t.label}
                      href={t.href}
                      className={`relative mr-3 ml-3 flex items-center justify-center gap-2 whitespace-nowrap px-0 pb-[18px] pt-[13px] ${
                        active ? "font-bold text-white" : "text-[rgb(168,170,179)]"
                      }`}
                    >
                      {active && (
                        <>
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 border-b-2 border-white"
                          />
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 opacity-[0.15] blur-md"
                            style={{
                              backgroundImage:
                                "linear-gradient(0deg, rgb(254, 169, 0) -7.89%, rgba(255, 237, 71, 0.24) 71.95%, rgba(255, 237, 71, 0) 0%)",
                            }}
                          />
                        </>
                      )}
                      <span className="block">{t.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </nav>
          <div />
        </div>
      </div>
    </div>
  );
}
