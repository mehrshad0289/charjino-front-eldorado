import { FA } from "./data/faCopy";
import { ILLUSTRATIONS } from "./data/illustrations";

/* Centered empty state (100px illustration, bold 24px title, gray text). */

export default function EmptyState({
  image = ILLUSTRATIONS.emptyDragon,
  imageAlt = FA.nothingFound,
  title = FA.nothingFound,
  text,
}) {
  return (
    <div className="flex justify-center px-[30px] pt-10 pb-0">
      <div className="flex max-w-[600px] flex-col items-center gap-3">
        <div className="h-[100px] shrink-0 overflow-hidden">
          <img alt={imageAlt} src={image} className="block size-[100px] object-contain align-middle" />
        </div>
        <div className="text-center text-[24px] font-bold leading-[36px]">{title}</div>
        {text ? <div className="pt-1 text-center text-[rgb(106,_102,_123)]">{text}</div> : null}
      </div>
    </div>
  );
}
