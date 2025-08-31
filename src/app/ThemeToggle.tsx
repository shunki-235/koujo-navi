"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    try {
      const saved = typeof window !== "undefined" ? window.localStorage.getItem("theme") : null;
      let next: "light" | "dark" = "light";
      if (saved === "dark" || saved === "light") next = saved;
      else if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) next = "dark";
      setTheme(next);
      if (typeof document !== "undefined") document.documentElement.dataset.theme = next;
    } catch {}
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    try {
      if (typeof document !== "undefined") document.documentElement.dataset.theme = next;
      if (typeof window !== "undefined") window.localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <button onClick={toggle} className="btn btn-outline h-9 px-3 text-xs" aria-label="テーマ切替">
      {theme === "dark" ? "ライト" : "ダーク"}
    </button>
  );
}


