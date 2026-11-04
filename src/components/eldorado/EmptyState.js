/* Centered empty state (100px image, bold 24px title, gray text) from the
   dashboard capture's offers page. Reusable for orders/messages/etc. */
export default function EmptyState({ image, imageAlt, title, text }) {
  return (
    <div className="flex justify-center px-[30px] pt-10 pb-0">
      <div className="flex max-w-[600px] flex-col items-center gap-3">
        <div className="h-[100px] shrink-0 overflow-hidden">
          <img alt={imageAlt} src={image} className="block size-[100px] object-cover align-middle" />
        </div>
        <div className="text-center text-[24px] font-bold leading-[36px]">{title}</div>
        <div className="pt-1 text-center text-[rgb(106,_102,_123)]">{text}</div>
      </div>
    </div>
  );
}
