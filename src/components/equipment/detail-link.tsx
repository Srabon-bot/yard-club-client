"use client";

import Link from "next/link";
import { usePreviewRole } from "@/components/preview-role";

/* Guests are sent to login, signed-in visitors go straight to the listing.
   The real auth gate lands with BetterAuth; this preview context keeps the
   visual flow honest until then. */
export function DetailLink({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { role } = usePreviewRole();
  const href =
    role === "guest"
      ? `/login?next=${encodeURIComponent(`/equipment/${id}`)}`
      : `/equipment/${id}`;

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
