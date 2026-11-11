export default function ShopTopupNotice({ title = "", body = "" }) {
  const heading = String(title || "").trim();
  const text = String(body || "").trim();
  if (!heading && !text) return null;

  return (
    <div className="rounded-lg bg-[#F8D5B5] px-4 py-3 text-[14px] leading-[21px] text-nav">
      {heading ? <p className="font-bold">{heading}</p> : null}
      {text ? <p className={heading ? "mt-1" : ""}>{text}</p> : null}
    </div>
  );
}
