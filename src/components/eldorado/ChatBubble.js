/* Intercom-style chat bubble, fixed bottom-end. Icon from imeg/support.svg. */
export default function ChatBubble() {
  return (
    <a
      href="/contact-us"
      aria-label="تماس با ما"
      className="fixed end-5 bottom-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-brand shadow-[0_1px_6px_rgba(0,0,0,0.06),0_2px_32px_rgba(0,0,0,0.16)]"
    >
      <img src="/home/support.svg" alt="" width="24" height="24" loading="lazy" />
    </a>
  );
}
