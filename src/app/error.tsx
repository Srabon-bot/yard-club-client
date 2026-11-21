"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { StatusBadge } from "@/components/site/status-badge";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-14 lg:py-20">
      <div className="mx-auto max-w-2xl rounded-[10px] border-2 border-ink bg-surface p-6 shadow-offset sm:p-10">
        <StatusBadge tone="red">Something went wrong</StatusBadge>
        <h1 className="display-2 mt-4">That page hit a snag.</h1>
        <p className="lede mt-3">
          The request could not be completed. Try again, or head back to the
          catalogue while we get the yard sorted.
        </p>
        {error.digest ? (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft">
            Reference: {error.digest}
          </p>
        ) : null}
        <div className="mt-7 flex flex-col gap-2 sm:flex-row">
          <Button type="button" onClick={retry} className="h-11">
            <RotateCcw className="size-4" aria-hidden="true" />
            Try again
          </Button>
          <Button asChild variant="outline" className="h-11 border-2 border-ink">
            <Link href="/equipment">Browse equipment</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
