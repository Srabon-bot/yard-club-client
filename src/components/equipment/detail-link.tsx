import Link from "next/link";

/** The detail page is private and redirects guests to /login with ?next=. */
export function DetailLink({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={`/equipment/${encodeURIComponent(id)}`}
      className={className}
    >
      {children}
    </Link>
  );
}
