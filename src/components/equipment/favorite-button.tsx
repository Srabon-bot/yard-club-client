"use client";

import { useState, useTransition } from "react";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleFavoriteAction } from "@/lib/actions/favorites";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  equipmentId,
  initialSaved,
  name,
}: {
  equipmentId: string;
  initialSaved: boolean;
  name: string;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  const toggle = () => {
    const next = !saved;
    startTransition(async () => {
      const result = await toggleFavoriteAction(equipmentId, next);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setSaved(result.saved);
      toast.success(result.saved ? "Saved to your shortlist" : "Removed from saved", {
        description: name,
      });
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={toggle}
      disabled={pending}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from saved equipment` : `Save ${name}`}
      className={cn(
        "gap-1.5 border-2 border-ink",
        saved && "bg-lime-soft text-lime-ink",
      )}
    >
      {pending ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
      ) : (
        <Heart
          className={cn("size-3.5", saved && "fill-current")}
          aria-hidden="true"
        />
      )}
      {saved ? "Saved" : "Save"}
    </Button>
  );
}
