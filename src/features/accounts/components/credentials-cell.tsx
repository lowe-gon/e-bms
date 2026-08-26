import { Button } from '@/components/ui/button';
import type { Users } from '@/typings';
import { AtSign, Check, Copy } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

export default function CredentialsCell({ username, id }: Users) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, targetId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(targetId);
    toast.success('Copied Username');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const uniqueKey = `table-user-${id}`;
  const isCopied = copiedId === uniqueKey;

  return (
    <div className="border-border bg-accent flex max-w-50 items-center justify-between rounded-lg border p-1">
      <div className="flex min-w-0 items-center gap-1">
        <AtSign className="h-3 w-3 shrink-0 text-blue-600 dark:text-blue-400" />
        <span className="truncate font-mono text-[11px] font-bold text-slate-800 dark:text-slate-200">
          {username}
        </span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={() => username && copyToClipboard(username, uniqueKey)}
        title="Copy username"
        className="text-muted-foreground hover:text-primary cursor-pointer rounded px-2 py-1 transition-colors">
        {isCopied ? (
          <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <Copy className="size-3" />
        )}
      </Button>
    </div>
  );
}
