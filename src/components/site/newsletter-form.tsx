"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function NewsletterForm() {
  const [email, setEmail] = useState("");

  return (
    <form
      className="flex w-full max-w-sm items-stretch gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (!email.includes("@")) {
          toast.error("That email needs an @");
          return;
        }
        toast.success("You're on the list", {
          description: "One drop a month. New gear, no noise.",
        });
        setEmail("");
      }}
    >
      <label htmlFor="footer-email" className="sr-only">
        Email address
      </label>
      <input
        id="footer-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@studio.com"
        className="h-11 min-w-0 flex-1 rounded-md border-2 border-white/25 bg-transparent px-3 font-mono text-xs text-white placeholder:text-white/40 focus-visible:border-lime focus-visible:outline-none"
      />
      <button
        type="submit"
        className="grid size-11 shrink-0 place-items-center rounded-md border-2 border-[#060605] bg-lime text-[#060605] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_rgba(255,255,255,0.25)]"
        aria-label="Subscribe to the Yardclub list"
      >
        <ArrowRight className="size-4" />
      </button>
    </form>
  );
}
