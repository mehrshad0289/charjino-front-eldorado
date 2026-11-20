"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { likeBlogComment, loadMoreBlogComments, postBlogComment } from "@/actions/blog.actions";
import { toFaDigits } from "@/lib/fa-digits";
import { useSessionUser } from "@/lib/session-client";

const YELLOW_BTN =
  "blog-display inline-flex min-h-10 items-center justify-center rounded-lg bg-[rgb(255,182,0)] px-4 py-[8px] text-[18px] font-extrabold leading-[26px] text-[rgb(20,19,26)] disabled:opacity-60";
const FIELD =
  "w-full resize-none rounded-lg bg-[rgb(30,31,40)] p-4 text-[16px] leading-[24px] text-white placeholder:text-[rgb(138,134,157)]";
const GHOST =
  "text-[14px] font-semibold leading-[19.6px] text-[rgb(152,126,251)] underline decoration-[rgb(152,126,251)] disabled:opacity-60";

function loginHref(path) {
  return `/login?next=${encodeURIComponent(path || "/blog")}`;
}

function patchTree(items, id, patch) {
  return items.map((row) => {
    if (row.id === id) return { ...row, ...patch(row) };
    if (!row.replies?.length) return row;
    return { ...row, replies: patchTree(row.replies, id, patch) };
  });
}

function CommentBody({ comment, canReply, nested = false, busyId, onReply, onLike }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const replies = Array.isArray(comment.replies) ? comment.replies : [];

  async function submitReply(event) {
    event.preventDefault();
    const next = text.trim();
    if (next.length < 3) {
      setError("متن نظر خیلی کوتاه است.");
      return;
    }
    setError("");
    const ok = await onReply(comment.id, next);
    if (ok) {
      setText("");
      setOpen(false);
    }
  }

  return (
    <article className={nested ? "pt-1" : "rounded-lg bg-[rgb(30,31,40)] p-6 max-sm:p-4"}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgb(14,13,18)] text-[16px] font-bold text-[rgb(255,182,0)]"
        >
          {(comment.authorName || "ک").slice(0, 1)}
        </span>
        <span className="font-semibold leading-[22.4px] text-white" dir="auto">
          {comment.authorName}
        </span>
        {comment.date ? (
          <>
            <span aria-hidden="true" className="text-[22px] font-bold leading-[22.4px] text-[rgb(138,134,157)]">
              ·
            </span>
            <span className="leading-[22.4px] text-[rgb(138,134,157)]">{comment.date}</span>
          </>
        ) : null}
      </div>
      <p className="whitespace-pre-wrap text-[18px] leading-[36px] text-[rgb(191,187,212)]" dir="auto">
        {comment.body}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          className={`text-[14px] font-semibold leading-[19.6px] ${
            comment.liked ? "text-[rgb(255,182,0)]" : "text-[rgb(138,134,157)]"
          }`}
          onClick={() => onLike(comment.id)}
          disabled={busyId === `like-${comment.id}`}
        >
          پسند {toFaDigits(comment.likesCount || 0)}
        </button>
        {canReply ? (
          <button type="button" className={GHOST} onClick={() => setOpen((value) => !value)}>
            پاسخ
          </button>
        ) : null}
      </div>
      {open ? (
        <form className="mt-4" onSubmit={submitReply}>
          <label className="sr-only" htmlFor={`reply-${comment.id}`}>
            پاسخ
          </label>
          <textarea
            id={`reply-${comment.id}`}
            rows={3}
            maxLength={1000}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="پاسخ خود را بنویسید"
            className={FIELD}
          />
          {error ? <p className="mt-2 text-[14px] leading-[19.6px] text-[rgb(255,182,0)]">{error}</p> : null}
          <div className="mt-3 flex flex-wrap gap-3">
            <button type="submit" className={YELLOW_BTN} disabled={busyId === `reply-${comment.id}`}>
              {busyId === `reply-${comment.id}` ? "در حال ارسال..." : "ارسال پاسخ"}
            </button>
            <button type="button" className={GHOST} onClick={() => setOpen(false)}>
              لغو
            </button>
          </div>
        </form>
      ) : null}
      {replies.length ? (
        <ul className="mt-4 space-y-3 border-s-2 border-[rgb(42,42,48)] ps-4">
          {replies.map((reply) => (
            <li key={reply.id}>
              <CommentBody
                comment={reply}
                nested
                canReply={false}
                busyId={busyId}
                onReply={onReply}
                onLike={onLike}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

export default function BlogArticleComments({ slug, path, initialItems = [], initialMeta = null }) {
  const router = useRouter();
  const { user, known } = useSessionUser();
  const signedIn = Boolean(user);
  const [items, setItems] = useState(() => (Array.isArray(initialItems) ? initialItems : []));
  const [meta, setMeta] = useState(
    () => initialMeta || { page: 1, perPage: 20, total: 0, totalPages: 1 },
  );
  const [page, setPage] = useState(1);
  const [body, setBody] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const loginPath = loginHref(path);
  const hasMore = page < (Number(meta.totalPages) || 1);
  const countLabel = useMemo(() => {
    const total = Number(meta.total) || 0;
    if (total < 1) return "هنوز نظری ثبت نشده است.";
    return `بر اساس ${toFaDigits(total)} نظر تأییدشده`;
  }, [meta.total]);

  function goLogin() {
    router.push(loginPath);
  }

  async function onLike(id) {
    if (!signedIn) {
      goLogin();
      return;
    }
    setBusyId(`like-${id}`);
    const result = await likeBlogComment(id);
    setBusyId("");
    if (result.unauthorized) {
      goLogin();
      return;
    }
    if (!result.ok) {
      setError(result.message || "پسند ثبت نشد.");
      return;
    }
    setItems((prev) =>
      patchTree(prev, id, () => ({
        liked: result.liked,
        likesCount: result.likesCount,
      })),
    );
  }

  async function onReply(parentId, text) {
    if (!signedIn) {
      goLogin();
      return false;
    }
    setBusyId(`reply-${parentId}`);
    const result = await postBlogComment(slug, text, parentId);
    setBusyId("");
    if (result.unauthorized) {
      goLogin();
      return false;
    }
    if (!result.ok) {
      setError(result.message || "ارسال پاسخ انجام نشد.");
      return false;
    }
    setNotice(result.message || "نظر ثبت شد و پس از تأیید نمایش داده می‌شود.");
    setError("");
    return true;
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (!signedIn) {
      goLogin();
      return;
    }
    const text = body.trim();
    if (text.length < 3) {
      setError("متن نظر خیلی کوتاه است.");
      return;
    }
    setBusyId("root");
    const result = await postBlogComment(slug, text);
    setBusyId("");
    if (result.unauthorized) {
      goLogin();
      return;
    }
    if (!result.ok) {
      setError(result.message || "ثبت نظر انجام نشد.");
      return;
    }
    setBody("");
    setError("");
    setNotice(result.message || "نظر ثبت شد و پس از تأیید نمایش داده می‌شود.");
  }

  async function onMore() {
    if (!hasMore || busyId) return;
    const nextPage = page + 1;
    setBusyId("more");
    const result = await loadMoreBlogComments(slug, nextPage);
    setBusyId("");
    if (!result.ok) return;
    setPage(nextPage);
    setItems((prev) => [...prev, ...(result.items || [])]);
    if (result.meta) setMeta(result.meta);
  }

  return (
    <section className="mb-[40px] pb-16 pt-6" aria-labelledby="blog-comments-heading">
      <div className="blog-display mb-[32px] text-[32px] font-black uppercase leading-[38.4px] tracking-[1.28px]">
        <h2 id="blog-comments-heading" className="uppercase">
          نظرات
        </h2>
      </div>
      <p className="mb-6 text-[14px] leading-[19.6px] text-[rgb(138,134,157)]">{countLabel}</p>

      {items.length ? (
        <ul className="mb-8 space-y-3">
          {items.map((comment) => (
            <li key={comment.id}>
              <CommentBody
                comment={comment}
                canReply={signedIn}
                busyId={busyId}
                onReply={onReply}
                onLike={onLike}
              />
            </li>
          ))}
        </ul>
      ) : null}

      {hasMore ? (
        <div className="mb-8 flex justify-center">
          <button type="button" className={YELLOW_BTN} disabled={busyId === "more"} onClick={onMore}>
            {busyId === "more" ? "در حال بارگذاری..." : "بیشتر"}
          </button>
        </div>
      ) : null}

      {notice ? (
        <p className="mb-6 rounded-lg bg-[rgb(30,31,40)] p-4 text-[16px] leading-[24px] text-[rgb(255,182,0)]">
          {notice}
        </p>
      ) : null}

      {known && !signedIn ? (
        <div className="rounded-lg bg-[rgb(30,31,40)] p-6">
          <h3 className="mb-2 text-[24px] font-bold leading-[28.8px] text-white">نظر بگذارید</h3>
          <p className="mb-4 text-[16px] leading-[24px] text-[rgb(138,134,157)]">
            برای ثبت نظر و گفتگو وارد حساب کاربری شوید.
          </p>
          <a href={loginPath} className={YELLOW_BTN}>
            ورود
          </a>
        </div>
      ) : null}

      {signedIn ? (
        <form className="rounded-lg bg-[rgb(30,31,40)] p-6 max-sm:p-4" onSubmit={onSubmit}>
          <h3 className="mb-4 text-[24px] font-bold leading-[28.8px] text-white">نظر بگذارید</h3>
          <label className="sr-only" htmlFor="blog-comment-body">
            متن نظر
          </label>
          <textarea
            id="blog-comment-body"
            rows={5}
            maxLength={1000}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="نظر خود را بنویسید"
            className={FIELD}
          />
          {error ? <p className="mt-2 text-[14px] leading-[19.6px] text-[rgb(255,182,0)]">{error}</p> : null}
          <div className="mt-4">
            <button type="submit" className={YELLOW_BTN} disabled={busyId === "root"}>
              {busyId === "root" ? "در حال ارسال..." : "ثبت نظر"}
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}
