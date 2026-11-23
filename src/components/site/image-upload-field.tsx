"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UploadResponse = { url?: string; error?: string };

export function ImageUploadField({
  id = "image",
  name = "image",
  label = "Image",
  note,
  placeholder = "https://i.ibb.co/... or direct image link",
  defaultValue = "",
  required = false,
  onValueChange,
}: {
  id?: string;
  name?: string;
  label?: string;
  note?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  onValueChange?: (value: string) => void;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateUrl = (next: string) => {
    setUrl(next);
    onValueChange?.(next);
  };

  const upload = async (file?: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("image", file);
      formData.set("name", file.name);

      const response = await fetch("/api/uploads/imgbb", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as UploadResponse;

      if (!response.ok || !result.url) {
        throw new Error(result.error || "Image upload failed.");
      }

      updateUrl(result.url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid gap-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label htmlFor={id} className="text-xs font-semibold">
          {label}
        </Label>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="sr-only"
          aria-label={`Upload ${label.toLowerCase()}`}
          onChange={(event) => {
            void upload(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <ImagePlus className="size-3.5" aria-hidden="true" />
          )}
          {uploading ? "Uploading…" : "Upload image"}
        </Button>
      </div>

      <div className="flex items-center gap-3 rounded-[6px] border-2 border-ink bg-background p-2">
        <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-[6px] border-2 border-ink/15 bg-secondary/50">
          {url ? (
            // Preview only; the stored value is the hosted ImgBB URL.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="size-full object-cover" />
          ) : (
            <ImagePlus className="size-5 text-ink-soft" aria-hidden="true" />
          )}
        </span>
        <Input
          id={id}
          name={name}
          type="url"
          value={url}
          required={required}
          placeholder={placeholder}
          onChange={(event) => updateUrl(event.target.value)}
          className="h-11 rounded-[6px] border-2 border-ink bg-background text-sm"
        />
      </div>

      {note && (
        <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-ink-soft">
          {note}
        </p>
      )}
    </div>
  );
}
