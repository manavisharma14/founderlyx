// components/StartSequenceButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import toast from "react-hot-toast"
import { Play } from "lucide-react";

interface StartSequenceButtonProps {
  userId: string;
  warmupHealth?: number; // Pass from dashboard page (0-100)
  disabled?: boolean;
}

export default function StartSequenceButton({ userId, warmupHealth = 0, disabled = false }: StartSequenceButtonProps) {
  const [isLoading, setIsLoading] = useState(false);


  const isWarmupBlocked = warmupHealth < 80;

  const handleStartSequence = async () => {
    if (isWarmupBlocked || disabled || isLoading) return;

    setIsLoading(true);

    try {
      // Step 1: Mark ready contacts as "sending"
      const res = await fetch("/api/campaigns/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        throw new Error("Failed to start sequence");
      }

      const data = await res.json();

      toast.success(
  `Sequence launched! 🚀 ${data.processed} leads started.`,
  { duration: 5000 }
);
    } catch (err) {
      console.error(err);
      toast.error(
  "Error launching sequence. Please try again or contact support."
);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonText = isLoading ? "Launching..." : "Launch Sequence";

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          onClick={(e) => {
            if (isWarmupBlocked) {
              e.preventDefault(); // Prevent dialog if blocked
              toast.error(
  "Warmup not ready. Add warmup emails and wait for better reputation."
);
            }
          }}
          disabled={disabled || isLoading || isWarmupBlocked}
          className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-xl px-10 py-6 rounded-xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="mr-2 h-5 w-5" />
          {buttonText}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Launch Automated Sequence?</AlertDialogTitle>
          <AlertDialogDescription>
            {isWarmupBlocked ? (
              <div className="space-y-4">
                <p className="text-red-600 font-medium">
                  Your warmup health is {warmupHealth}/100 — real sends blocked.
                </p>
                <p>We recommend waiting until 80%+ to ensure emails land in inboxes.</p>
                <Button variant="outline" asChild>
                  <a href="/dashboard/warmup">Add Warmup Emails</a>
                </Button>
              </div>
            ) : (
              "This will start sending personalized openers to ready leads. Follow-ups are automated over 14 days."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleStartSequence}
            disabled={isWarmupBlocked || isLoading}
          >
            {isWarmupBlocked ? "Improve Warmup First" : "Launch Now"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}