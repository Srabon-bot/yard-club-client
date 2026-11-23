"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

const LOADING_TOAST_ID = "yardclub-loading";
const SHOW_DELAY_MS = 180;
const MAX_VISIBLE_MS = 12_000;

let showTimer: ReturnType<typeof setTimeout> | null = null;
let maxTimer: ReturnType<typeof setTimeout> | null = null;

function LoadingCard({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="flex w-[min(22rem,calc(100vw-2rem))] items-center gap-3 rounded-[10px] border-2 border-ink bg-surface p-3 shadow-offset-sm"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-[7px] border-2 border-ink bg-lime text-ink">
        <LoaderCircle
          className="size-4 animate-spin motion-reduce:animate-none"
          aria-hidden="true"
        />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-soft">
          Yardclub · Loading
        </p>
        <p className="truncate font-heading text-sm font-bold text-ink">
          {message}
        </p>
        <span className="mt-2 block h-[3px] w-full overflow-hidden rounded-full bg-ink/10">
          <span className="yc-loading-sweep block h-full w-1/3 rounded-full bg-lime-ink" />
        </span>
      </div>
    </div>
  );
}

/** Show the branded loading toast immediately (forms, uploads, sign-in). */
export function showLoadingToast(message = "Getting things ready…") {
  if (showTimer) clearTimeout(showTimer);
  showTimer = null;

  toast.custom(() => <LoadingCard message={message} />, {
    id: LOADING_TOAST_ID,
    duration: Infinity,
    dismissible: false,
    unstyled: true,
    position: "top-center",
  });

  if (maxTimer) clearTimeout(maxTimer);
  // Never strand the toast if a request fails before the route changes.
  maxTimer = setTimeout(() => dismissLoadingToast(), MAX_VISIBLE_MS);
}

/** Schedule the toast so fast navigations never flash it. */
export function scheduleLoadingToast(message = "Loading page…") {
  if (showTimer) return;
  showTimer = setTimeout(() => {
    showTimer = null;
    showLoadingToast(message);
  }, SHOW_DELAY_MS);
}

export function dismissLoadingToast() {
  if (showTimer) clearTimeout(showTimer);
  showTimer = null;
  if (maxTimer) clearTimeout(maxTimer);
  maxTimer = null;
  toast.dismiss(LOADING_TOAST_ID);
}

/**
 * Mounted once at the root. Gives immediate feedback for link navigations and
 * browser back/forward while the server renders the next route.
 */
export function RouteLoadingToast() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    const isModifiedClick = (event: MouseEvent) =>
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

    const handleClick = (event: MouseEvent) => {
      if (event.button !== 0 || isModifiedClick(event)) return;
      if (!(event.target instanceof Element)) return;

      const anchor = event.target.closest("a");
      if (!anchor || anchor.hasAttribute("download")) return;

      const target = anchor.getAttribute("target");
      if (target && target !== "_self") return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || /^(mailto:|tel:|javascript:)/i.test(href))
        return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        !url.hash
      )
        return;

      scheduleLoadingToast();
    };

    const handlePopState = () => scheduleLoadingToast("Loading page…");

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", handlePopState);
    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", handlePopState);
      dismissLoadingToast();
    };
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    dismissLoadingToast();
  }, [pathname]);

  return null;
}
