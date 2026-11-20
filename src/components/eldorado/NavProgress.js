"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { doneNavProgress } from "@/lib/nav-progress";

/* Completes the top navigation bar when the destination route commits.
   Start is fired from instrumentation-client (onRouterTransitionStart). */

export default function NavProgress() {
  const pathname = usePathname();
  const query = useSearchParams().toString();
  const skip = useRef(true);

  useEffect(() => {
    if (skip.current) {
      skip.current = false;
      return;
    }
    doneNavProgress();
  }, [pathname, query]);

  return null;
}
