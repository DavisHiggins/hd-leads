import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function GeneratedContentDialog({ open, onOpenChange, title, icon, loading, content }) {
  const Icon = icon;
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast({ title: "Copied", description: "Copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {Icon && <Icon size={18} className="text-amber-500" />}
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto mt-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-amber-500 mb-3" />
              <p className="text-sm text-muted-foreground">Generating...</p>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap text-sm leading-relaxed font-body bg-gray-50 rounded-lg p-4 border">{content}</pre>
          )}
        </div>
        {!loading && content && (
          <div className="flex justify-end pt-3 border-t mt-3">
            <Button onClick={copy} variant="outline" className="gap-2 text-sm">
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
