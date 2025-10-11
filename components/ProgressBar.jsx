"use client";

import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { usePathname } from "next/navigation";

export default function ProgressBar() {
  const pathname = usePathname();

  // Normalize paths (remove trailing slash)
  const normalizePath = (path) => {
    if (!path) return "/";
    return path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
  };

  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target;
      const link = target.closest("a");

      if (link && link.href.startsWith(window.location.origin)) {
        const targetPath = normalizePath(link.pathname);
        const currentPath = normalizePath(pathname);

        // Only start progress if navigating to a different route
        if (targetPath !== currentPath) {
          NProgress.start();
        }
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [pathname]); // safe dependency (won’t cause warning)

  useEffect(() => {
    const timer = setTimeout(() => NProgress.done(), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
