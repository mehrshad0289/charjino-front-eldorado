import { PRIVACY_POLICY_HTML, TERMS_HTML } from "./data/legalData";

/* Legal document column from the privacy-policy / terms-of-service
   captures (session 17c): a centered max-w-[682px] column (mt/mb 40px)
   rendered from verbatim extracted HTML. The bare <h6> section headings
   carry no styling info in the captures (Eldorado's CSS is not inlined)
   — 16px bold with spacing, documented assumption. Tables get a
   horizontal scroll wrapper like the blog article body. */

export default function LegalDoc({ html }) {
  return (
    <div className="mx-auto w-fit px-6">
      {/* Block (not flex) centering: the capture's flex wrapper held one
          nested column div; the extracted content sits directly inside, so
          flex layout would line the paragraphs up in a single row. */}
      <div
        className="mx-auto mt-10 mb-10 max-w-[682px] [&_h6]:mb-3 [&_h6]:mt-5 [&_h6]:text-[16px] [&_h6]:font-bold"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

export { PRIVACY_POLICY_HTML, TERMS_HTML };
