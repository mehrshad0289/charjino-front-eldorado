import { FA } from "./data/faCopy";
import { ILLUSTRATIONS } from "./data/illustrations";

/* Shared empty list/shop block: concerned dragon + «چیزی پیدا نشد». */

export default function ShopNoResults({
  title = FA.nothingFound,
  text = FA.nothingFoundHint,
  compact = false,
  tone = "light",
}) {
  const size = compact ? 72 : 100;
  const titleClass = compact
    ? "text-center text-[16px] font-bold leading-[24px]"
    : "text-center text-[24px] font-bold leading-[36px]";
  const titleColor = tone === "dark" ? "text-white" : "text-ink";
  const hintColor = tone === "dark" ? "text-navgray" : "text-graytext";
  return (
    <div aria-label={FA.nothingFound} className="flex justify-center">
      <div className={compact ? "py-4" : "py-12"}>
        <div className="flex flex-col items-center gap-3">
          <div className="shrink-0 overflow-hidden" style={{ height: size }}>
            <img
              alt={FA.nothingFound}
              src={ILLUSTRATIONS.emptyDragon}
              className="block object-contain align-middle"
              width={size}
              height={size}
            />
          </div>
          <div className={`${titleClass} ${titleColor}`}>{title}</div>
          {text ? <div className={`pt-1 text-center ${hintColor}`}>{text}</div> : null}
        </div>
      </div>
    </div>
  );
}
