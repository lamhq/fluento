import { useCallback, useEffect, useRef, useState } from 'react';
import ReactTopLoadingBar from 'react-top-loading-bar';

const START_PROGRESS = 1;
const MAX_PROGRESS = 100;
const MAX_LOADING_PROGRESS = 95;
const INTERVAL = 80;
const INITIAL_DURATION = 2000;

interface TopLoadingBarProps {
  open: boolean;
}

export default function TopLoadingBar({ open }: TopLoadingBarProps) {
  const [progress, setProgress] = useState(START_PROGRESS);
  const [duration, setDuration] = useState(INITIAL_DURATION);
  const delta = MAX_LOADING_PROGRESS * (INTERVAL / duration);
  const increaseProgress = useCallback(
    (p: number) => Math.min(p + delta, MAX_LOADING_PROGRESS),
    [delta],
  );
  // needed for tracking past loading bar's completion time
  const isOpened = useRef(open);
  const lastStart = useRef<number | null>(null);
  const pastDurations = useRef<number[]>([]);

  // automatic increase loading bar's progress while open
  useEffect(() => {
    let interval: number;
    if (open) {
      setTimeout(() => {
        setProgress(START_PROGRESS);
      }, 0);
      interval = setInterval(() => {
        setProgress(increaseProgress);
      }, INTERVAL);
    }
    return () => {
      clearInterval(interval);
    };
  }, [open, increaseProgress]);

  useEffect(() => {
    const durations = pastDurations.current;

    // track loading bar's completion time
    if (open) {
      lastStart.current ??= performance.now();
    } else if (isOpened.current && lastStart.current !== null) {
      durations.push(performance.now() - lastStart.current);
      if (durations.length > 3) {
        durations.shift();
      }
      lastStart.current = null;
    }
    isOpened.current = open;

    // calculate approximate completion time based on past data
    setDuration(
      durations.length > 0
        ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
        : INITIAL_DURATION,
    );
  }, [open]);

  return (
    <ReactTopLoadingBar
      progress={!open ? MAX_PROGRESS : progress}
      shadow={true}
      color="var(--muted-foreground)"
    />
  );
}
