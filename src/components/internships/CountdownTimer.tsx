"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function CountdownTimer({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [color, setColor] = useState<string>("text-green-500");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(deadline).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        setColor("text-red-500");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hrs}h ${mins}m ${secs}s`);

      if (days < 3) setColor("text-red-500");
      else if (days < 7) setColor("text-amber-500");
      else setColor("text-green-500");
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <div className={`flex items-center gap-1.5 font-bold text-xs ${color}`}>
      <Clock className="w-4 h-4" />
      {timeLeft}
    </div>
  );
}
