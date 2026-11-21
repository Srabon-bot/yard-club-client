"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleFavoriteAction } from "@/lib/actions/favorites";

export function RemoveFavoriteButton({
  equipmentId,
  name,
}: {
  equipmentId: string;
  name: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await toggleFavoriteAction(equipmentId, false);
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          toast.success("Removed from favourites", { description: name });
        })
      }
    >
      {pending ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
      ) : (
        <Trash2 className="size-3.5" aria-hidden="true" />
      )}
      Remove
    </Button>
  );
}
