"use client";

import Link from "next/link";
import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { StatusBadge } from "@/components/site/status-badge";
import { Button } from "@/components/ui/button";

export default function EquipmentError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleRetry = () => {
    startTransition(() => {
      router.refresh();
      retry();
    });
  };

  return (
    <div className="container-page py-14 lg:py-20">
      <div className="mx-auto max-w-2xl rounded-[10px] border-2 border-ink bg-surface p-6 shadow-offset sm:p-10">
        <StatusBadge tone="red">Could not load</StatusBadge>
        <h1 className="display-2 mt-4">The yard didn’t load.</h1>
        <p className="lede mt-3">
          The listing service dropped the request or experienced a brief timeout.
          Your filters are still in the URL, so trying again should bring back the same set.
        </p>
        {error?.message && process.env.NODE_ENV !== "production" && (
          <p className="mt-2 text-xs font-mono text-muted">{error.message}</p>
        )}
        <div className="mt-7 flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            onClick={handleRetry}
            disabled={isPending}
            className="h-11"
          >
            <RotateCcw className={`size-4 ${isPending ? "animate-spin" : ""}`} aria-hidden="true" />
            {isPending ? "Retrying..." : "Try again"}
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 border-2 border-ink"
          >
            <Link href="/equipment">Back to all equipment</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
