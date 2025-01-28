// Notification.tsx
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import React from "react";
import Image from 'next/image'

export interface NotificationProps {
  id: string | number;             // Identify each notification
  title?: string;                  // Optional title
  description: string;            // Main content
  avatar?: string;                // Optional avatar image
  timestamp?: string;             // e.g., "2 min ago"
  onAccept?: () => void;          // Handler for accept button
  onDecline?: () => void;         // Handler for decline button
  onClose?: (id: string | number) => void; // Handler for close icon
}

export default function Notification({
                                       id,
                                       title,
                                       description,
                                       avatar,
                                       timestamp,
                                       onAccept,
                                       onDecline,
                                       onClose,
                                     }: NotificationProps) {
  return (
    <div className="z-[100] max-w-[400px] rounded-lg border border-border bg-background p-4 shadow-lg shadow-black/5">
      <div className="flex gap-3">
        {avatar && (
          <Image
            className="size-9 rounded-full"
            src={avatar}
            width={32}
            height={32}
            alt={title || "Notification Avatar"}
          />
        )}

        <div className="flex grow flex-col gap-3">
          <div className="space-y-1">
            {title && (
              <p className="font-medium text-foreground hover:underline">
                {title}
              </p>
            )}
            <p className="text-sm text-muted-foreground">{description}</p>
            {timestamp && <p className="text-xs text-muted-foreground">{timestamp}</p>}
          </div>

          {/* Only display the buttons if handlers are provided */}
          {(onAccept || onDecline) && (
            <div className="flex gap-2">
              {onAccept && (
                <Button size="sm" variant="default" onClick={onAccept}>
                  Accept
                </Button>
              )}
              {onDecline && (
                <Button size="sm" variant="outline" onClick={onDecline}>
                  Decline
                </Button>
              )}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          aria-label="Close notification"
          onClick={() => onClose?.(id)}
        >
          <X
            size={16}
            strokeWidth={2}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  );
}
