"use client";

import Image from "next/image";
import { forwardRef, useEffect, useImperativeHandle, useRef, type CSSProperties } from "react";

export type ScrollCinemaHandle = {
  /** Absolute scene progress. Safe to call before metadata or after a resize. */
  setProgress: (progress: number) => void;
};

export type ScrollCinemaProps = {
  videoSrc: string;
  posterSrc: string;
  posterAlt?: string;
  className?: string;
  style?: CSSProperties;
  /** Matches every layout that should use the poster without downloading video. */
  staticMediaQuery?: string;
};

type CinemaState = "loading" | "ready" | "error" | "static";
const SEEK_TOLERANCE = 1 / 120;
const normalizeProgress = (value: number) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

/**
 * A paused video whose only clock is scroll position. Never calls play().
 * A short, seek-friendly MP4 with frequent keyframes is recommended, particularly
 * for iOS. If a browser cannot load/seek without playback, the poster stays visible.
 */
export const ScrollCinema = forwardRef<ScrollCinemaHandle, ScrollCinemaProps>(function ScrollCinema(
  { videoSrc, posterSrc, posterAlt = "", className, style, staticMediaQuery = "(prefers-reduced-motion: reduce)" },
  forwardedRef,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const latestProgress = useRef(0);
  const scheduleRef = useRef<(() => void) | null>(null);

  useImperativeHandle(forwardedRef, () => ({
    setProgress(value) {
      latestProgress.current = normalizeProgress(value);
      scheduleRef.current?.();
    },
  }), []);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    const poster = posterRef.current;
    if (!root || !video || !poster) return;

    const staticMode = window.matchMedia(staticMediaQuery);
    let disposed = false;
    let pendingFrame = 0;
    let sourceActive = false;
    let seekInFlight = false;
    let failed = false;
    let pendingSeekTarget: number | null = null;
    let completedSeekTarget: number | null = null;

    const setState = (state: CinemaState) => {
      root.dataset.cinemaState = state;
      root.dataset.cinemaReady = String(state === "ready");
      // Keep a complete visual until a decoded video frame is available.
      video.style.opacity = state === "ready" ? "1" : "0";
      poster.style.opacity = state === "ready" ? "0" : "1";
    };

    const recordTime = () => {
      root.dataset.cinemaTime = String(Number.isFinite(video.currentTime) ? video.currentTime : 0);
      root.dataset.cinemaPaused = String(video.paused);
    };

    const fail = () => {
      if (disposed || !sourceActive) return;
      failed = true;
      seekInFlight = false;
      video.pause();
      setState(staticMode.matches ? "static" : "error");
      recordTime();
    };

    const mediaError = () => {
      // Removing/replacing a source resets MediaError but queued events can arrive
      // afterwards. Never turn a deliberate unload or an old error into a failure.
      if (!sourceActive || !video.error) return;
      if (video.currentSrc && video.currentSrc !== video.src) return;
      fail();
    };

    const update = () => {
      pendingFrame = 0;
      if (disposed) return;
      root.dataset.cinemaProgress = String(latestProgress.current);
      if (staticMode.matches || !sourceActive) {
        setState("static");
        return;
      }
      if (failed) return;
      // iOS can expose the element before it knows the duration. Retain the latest
      // requested progress and retry from metadata/data events instead of seeking.
      if (video.readyState < 1 || !Number.isFinite(video.duration) || video.duration <= 0) return;

      const target = latestProgress.current * Math.max(0, video.duration - 0.001);
      root.dataset.cinemaTargetTime = String(target);
      // An in-flight seek is allowed to finish. Hundreds of rapid scroll updates
      // collapse to one latest destination rather than restarting the decoder.
      if (seekInFlight || video.seeking) return;
      if (completedSeekTarget === target || Math.abs(video.currentTime - target) <= SEEK_TOLERANCE) {
        if (video.readyState >= 2) setState("ready");
        recordTime();
        return;
      }
      try {
        seekInFlight = true;
        pendingSeekTarget = target;
        video.currentTime = target;
        recordTime();
      } catch {
        // Some browser/power-saving modes refuse paused seeking. Do not start
        // playback to bypass that policy; retain the supplied poster instead.
        fail();
      }
    };

    const schedule = () => {
      if (!disposed && !pendingFrame) pendingFrame = window.requestAnimationFrame(update);
    };
    scheduleRef.current = schedule;

    const seeked = () => {
      if (!sourceActive || disposed) return;
      seekInFlight = false;
      if (pendingSeekTarget !== null && Math.abs(video.currentTime - pendingSeekTarget) > 0.25) {
        const ranges = video.seekable;
        let canSeek = false;
        for (let index = 0; index < ranges.length; index++) {
          if (ranges.end(index) - ranges.start(index) > SEEK_TOLERANCE) {
            canSeek = true;
            break;
          }
        }
        // Some servers can deliver/decode the entire MP4 but cannot serve byte
        // ranges. A browser may then emit seeked after silently returning to 0.
        // Distinguish this from small privacy-related currentTime rounding.
        if (!canSeek) {
          root.dataset.cinemaFallback = "unseekable";
          fail();
          return;
        }
      }
      // Privacy settings may round currentTime. A completed request must not
      // trigger an endless loop of identical seeks because of that rounding.
      completedSeekTarget = pendingSeekTarget;
      recordTime();
      schedule();
    };
    const metadata = () => {
      if (!sourceActive || disposed) return;
      root.dataset.cinemaDuration = String(Number.isFinite(video.duration) ? video.duration : 0);
      schedule();
    };

    const unloadSource = () => {
      sourceActive = false;
      failed = false;
      seekInFlight = false;
      pendingSeekTarget = null;
      completedSeekTarget = null;
      root.dataset.cinemaSourceActive = "false";
      root.dataset.cinemaDuration = "0";
      root.dataset.cinemaTargetTime = "0";
      root.dataset.cinemaFallback = "";
      video.pause();
      video.preload = "none";
      if (video.hasAttribute("src")) {
        video.removeAttribute("src");
        // With no src or <source>, load() aborts outstanding range requests and
        // releases the previous resource; it does not request another video.
        video.load();
      }
      recordTime();
    };

    const modeChanged = () => {
      if (disposed) return;
      if (staticMode.matches) {
        unloadSource();
        setState("static");
      } else if (!sourceActive) {
        sourceActive = true;
        failed = false;
        seekInFlight = false;
        pendingSeekTarget = null;
        completedSeekTarget = null;
        root.dataset.cinemaSourceActive = "true";
        root.dataset.cinemaFallback = "";
        setState("loading");
        video.preload = "auto";
        video.src = videoSrc;
        try {
          video.load();
          metadata();
        } catch {
          fail();
        }
      }
      schedule();
    };
    const keepPaused = () => {
      video.pause();
      recordTime();
    };

    // Both the DOM property and attribute are intentional: older iOS WebKit uses
    // the latter for inline media and must never switch into fullscreen playback.
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("webkit-playsinline", "true");
    video.pause();
    video.addEventListener("loadedmetadata", metadata);
    video.addEventListener("durationchange", metadata);
    video.addEventListener("loadeddata", schedule);
    video.addEventListener("canplay", schedule);
    video.addEventListener("seeked", seeked);
    video.addEventListener("timeupdate", recordTime);
    video.addEventListener("error", mediaError);
    video.addEventListener("play", keepPaused);
    staticMode.addEventListener("change", modeChanged);

    setState(staticMode.matches ? "static" : "loading");
    recordTime();
    modeChanged();

    return () => {
      disposed = true;
      scheduleRef.current = null;
      window.cancelAnimationFrame(pendingFrame);
      video.pause();
      video.removeEventListener("loadedmetadata", metadata);
      video.removeEventListener("durationchange", metadata);
      video.removeEventListener("loadeddata", schedule);
      video.removeEventListener("canplay", schedule);
      video.removeEventListener("seeked", seeked);
      video.removeEventListener("timeupdate", recordTime);
      video.removeEventListener("error", mediaError);
      video.removeEventListener("play", keepPaused);
      staticMode.removeEventListener("change", modeChanged);
      unloadSource();
    };
  }, [videoSrc, posterSrc, staticMediaQuery]);

  return (
    <div
      ref={rootRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", ...style }}
      data-cinema-state="loading"
      data-cinema-ready="false"
      data-cinema-progress="0"
      data-cinema-time="0"
      data-cinema-paused="true"
      data-cinema-source-active="false"
    >
      <video
        ref={videoRef}
        poster={posterSrc}
        muted
        playsInline
        preload="none"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0, pointerEvents: "none" }}
      />
      <Image
        ref={posterRef}
        src={posterSrc}
        alt={posterAlt}
        fill
        priority
        unoptimized
        sizes="100vw"
        style={{ objectFit: "cover", opacity: 1, pointerEvents: "none" }}
      />
    </div>
  );
});
