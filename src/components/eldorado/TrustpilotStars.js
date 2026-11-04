/* Trustpilot stars — the capture draws each star as an icomoon square glyph
   with a green background and a white star overlay (full) or a 50/50
   green/gray linear gradient (half). Colors: header row rgb(33,150,83),
   review cards rgb(0,182,122) with rgb(217,217,217) half base. */
const COLORS = {
  header: { green: "rgb(33,150,83)", base: "rgb(220,220,229)" },
  review: { green: "rgb(0,182,122)", base: "rgb(217,217,217)" },
};

export default function TrustpilotStars({
  variant = "review",
  size = 20,
  full = 5,
  half = 0,
  gap = 4,
}) {
  const c = COLORS[variant];
  const stars = [];
  for (let i = 0; i < full; i += 1) stars.push({ half: false, key: `f${i}` });
  for (let i = 0; i < half; i += 1) stars.push({ half: true, key: `h${i}` });
  return (
    <span className="flex" style={{ gap }}>
      {stars.map((s) => (
        <span
          key={s.key}
          aria-label={s.half ? "half star" : "full star"}
          className="block shrink-0 rounded-sm"
          style={{
            width: size,
            height: size,
            /* full stars need background (a color), NOT backgroundImage —
               a raw color string in backgroundImage is invalid CSS and
               renders the square invisible (caught on /checkout) */
            background: s.half
              ? `linear-gradient(90deg, ${c.green} 50%, ${c.base} 50%)`
              : c.green,
          }}
        >
          <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 2.6 15 9l6.8.5-5.2 4.5 1.6 6.6L12 17l-6.2 3.6 1.6-6.6L2.2 9.5 9 9l3-6.4Z"
              fill="#ffffff"
            />
          </svg>
        </span>
      ))}
    </span>
  );
}

/* The "Trustpilot" wordmark next to the header stars: green star icon +
   plain text label, per the capture (icomoon star + text node). */
export function TrustpilotLogo() {
  return (
    <span className="flex items-center">
      <span className="block">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2.6 15 9l6.8.5-5.2 4.5 1.6 6.6L12 17l-6.2 3.6 1.6-6.6L2.2 9.5 9 9l3-6.4Z"
            fill="rgb(33,150,83)"
          />
        </svg>
      </span>
      <span className="block">Trustpilot</span>
    </span>
  );
}
