"use client";

import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { usePathname, useRouter } from "next/navigation";

export default function ProgressBar() {
  const pathname = usePathname();
  const router = useRouter();

  // Normalize paths
  const normalizePath = (path) => {
    if (!path) return "/";
    return path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
  };

  // Handle clicks on <a> links
  useEffect(() => {
    const handleClick = (e) => {
      const link = e.target.closest("a");
      if (link && link.href.startsWith(window.location.origin)) {
        const targetPath = normalizePath(link.pathname);
        const currentPath = normalizePath(pathname);
        if (targetPath !== currentPath) {
          NProgress.start();
        } else {
          // If clicking on same route, instantly complete
          NProgress.start();
          NProgress.set(0.3);
          NProgress.done();
        }
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [pathname]);

  // Hook into router.push()
  useEffect(() => {
    const originalPush = router.push;
    router.push = async (...args) => {
      const targetUrl = args[0];
      const currentPath = normalizePath(pathname);
      const targetPath = normalizePath(
        typeof targetUrl === "string"
          ? new URL(targetUrl, window.location.origin).pathname
          : targetUrl?.pathname || "/"
      );

      if (targetPath !== currentPath) {
        NProgress.start();
      } else {
        // If pushing to same route, instantly complete
        NProgress.start();
        NProgress.set(0.3);
        NProgress.done();
      }

      try {
        await originalPush.apply(router, args);
      } finally {
        NProgress.done();
      }
    };

    return () => {
      router.push = originalPush; // restore original method on unmount
    };
  }, [router, pathname]);

  // Complete progress when pathname changes
  useEffect(() => {
    const timer = setTimeout(() => NProgress.done(), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
