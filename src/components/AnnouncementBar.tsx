import { useState } from "react";
import { X, AlertCircle, Info, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface Announcement {
  id: string;
  message: string;
  priority: "urgent" | "normal" | "info";
}

const AnnouncementBar = () => {
  const [dismissed, setDismissed] = useState(false);

  // Mock announcement - in production, fetch from CMS
  const announcement: Announcement = {
    id: "1",
    message: "Academic Calendar 2024/2025 now available. Registration for new students starts November 1st.",
    priority: "normal",
  };

  if (dismissed) return null;

  const getStyles = () => {
    switch (announcement.priority) {
      case "urgent":
        return "bg-urgent text-white";
      case "normal":
        return "bg-normal text-foreground";
      case "info":
        return "bg-info text-white";
      default:
        return "bg-muted text-foreground";
    }
  };

  const getIcon = () => {
    switch (announcement.priority) {
      case "urgent":
        return <AlertCircle className="h-4 w-4" />;
      case "normal":
        return <Bell className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className={cn("py-2 px-4", getStyles())}>
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          {getIcon()}
          <p className="text-sm font-medium">{announcement.message}</p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
