import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="grid size-16 place-items-center rounded-[12px] border-2 border-ink bg-lime shadow-offset-sm">
        <Compass className="size-8 text-[#060605]" />
      </span>
      <p className="eyebrow mt-6">404 Error</p>
      <h1 className="display-1 mt-2">Yard item or route not found.</h1>
      <p className="mx-auto mt-4 max-w-[46ch] text-base leading-relaxed text-ink-soft">
        The equipment listing or page you navigated to doesn’t exist or has been
        moved to another yard location.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/equipment">
            <ArrowLeft className="size-4" />
            Back to catalogue
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
