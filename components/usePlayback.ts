"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * One playback interface over two very different backings.
 *
 * - `real-audio` drives a real <audio> element. Seeking, rate and time are the
 *   browser's.
 * - `simulated` drives a requestAnimationFrame clock. There is no media, but
 *   every interaction - play, pause, seek, rate, transcript follow, timestamp
 *   deep links - behaves identically.
 *
 * Keeping them behind one hook is what stops the UI from growing two code
 * paths, and it means the seeded meetings genuinely exercise the same
 * interactions the real one does rather than faking a still image.
 */
export interface Playback {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  rate: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (sec: number) => void;
  setRate: (r: number) => void;
  /** Attach to an <audio> element when `isReal` is true. */
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isReal: boolean;
}

export function usePlayback(durationSec: number, audioSrc?: string): Playback {
  const isReal = Boolean(audioSrc);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRateState] = useState(1);

  // Simulated clock.
  //
  // Time is always derived from a wall-clock origin rather than accumulated per
  // tick, so the reported position stays correct regardless of how irregularly
  // the timer fires — and a rate change applies from the moment it is made.
  //
  // Driven by setInterval, deliberately not requestAnimationFrame: rAF is
  // starved whenever the page is not compositing (background tab, window behind
  // another window), which would freeze the clock and then jump it. A timer
  // keeps running, and because position is computed from the origin, a throttled
  // timer costs smoothness but never accuracy.
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const originRef = useRef({ at: 0, time: 0 });

  const stopLoop = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startLoop = useCallback(() => {
    stopLoop();
    const step = () => {
      const { at, time } = originRef.current;
      const elapsed = (performance.now() - at) / 1000;
      const next = time + elapsed * rate;
      if (next >= durationSec) {
        setCurrentTime(durationSec);
        setIsPlaying(false);
        stopLoop();
        return;
      }
      setCurrentTime(next);
    };
    step();
    timerRef.current = setInterval(step, 100);
  }, [durationSec, rate, stopLoop]);

  const play = useCallback(() => {
    if (isReal) {
      void audioRef.current?.play();
      return;
    }
    // Restart from the beginning if we're parked at the end.
    const from = currentTime >= durationSec ? 0 : currentTime;
    originRef.current = { at: performance.now(), time: from };
    setCurrentTime(from);
    setIsPlaying(true);
  }, [isReal, currentTime, durationSec]);

  const pause = useCallback(() => {
    if (isReal) {
      audioRef.current?.pause();
      return;
    }
    setIsPlaying(false);
  }, [isReal]);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const seek = useCallback(
    (sec: number) => {
      const clamped = Math.min(Math.max(0, sec), durationSec);
      if (isReal) {
        const el = audioRef.current;
        if (el) el.currentTime = clamped;
        setCurrentTime(clamped);
        return;
      }
      originRef.current = { at: performance.now(), time: clamped };
      setCurrentTime(clamped);
    },
    [durationSec, isReal]
  );

  const setRate = useCallback(
    (r: number) => {
      if (isReal) {
        const el = audioRef.current;
        if (el) el.playbackRate = r;
      } else {
        // Re-anchor so the rate change applies from now, not retroactively.
        originRef.current = { at: performance.now(), time: currentTime };
      }
      setRateState(r);
    },
    [isReal, currentTime]
  );

  // Simulated: run the loop while playing.
  useEffect(() => {
    if (isReal) return;
    if (isPlaying) startLoop();
    else stopLoop();
    return stopLoop;
  }, [isReal, isPlaying, startLoop, stopLoop]);

  // Real audio: mirror the element's state into React.
  useEffect(() => {
    if (!isReal) return;
    const el = audioRef.current;
    if (!el) return;

    const onTime = () => setCurrentTime(el.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, [isReal]);

  return {
    currentTime,
    duration: durationSec,
    isPlaying,
    rate,
    play,
    pause,
    toggle,
    seek,
    setRate,
    audioRef,
    isReal,
  };
}
