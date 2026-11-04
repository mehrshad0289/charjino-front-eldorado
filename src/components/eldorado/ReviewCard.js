import TrustpilotStars from "./TrustpilotStars";

/* Trustpilot review card from the about capture: initials avatar (w-10
   circle, rgb(199,242,217) fill / rgb(18,101,53) text), name + relative
   date, star row, bold title, gray body. Fixed 296px height, 248px min
   width, soft shadow, inside the horizontally scrollable row. */
export default function ReviewCard({ review }) {
  return (
    <div className="flex h-[296px] grow basis-0 flex-col gap-4 rounded-2xl bg-card p-6 shadow-[0_2px_4px_rgba(9,9,11,0.05),0_12px_8px_rgba(9,9,11,0.02)] min-w-[248px]">
      <div className="flex gap-4">
        <span className="block w-10 rounded-full bg-avatarbg px-1 py-[10px] text-center text-[14px] font-bold leading-[20px] text-avatartext">
          {review.initials}
        </span>
        <div className="flex flex-col justify-center">
          <span className="block truncate text-[14px] font-bold leading-[19.6px]">{review.name}</span>
          <span className="block truncate text-[12px] leading-[16.8px] text-graytext">{review.date}</span>
        </div>
      </div>
      <TrustpilotStars variant="review" size={20} full={review.stars.full} half={review.stars.half} />
      <div className="flex flex-col gap-2 overflow-hidden">
        <h3 className="mb-[10px] truncate font-bold">{review.title}</h3>
        <p className="line-clamp-4 text-[14px] leading-[19.6px] text-graytext">{review.text}</p>
      </div>
    </div>
  );
}
