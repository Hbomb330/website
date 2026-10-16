import { useEffect, useRef, useState } from "react";
import "../time-core.css";

export function meta() {
  return [
    { title: "Time Core — HBOMB Browser Clock" },
    {
      name: "description",
      content:
        "A live local clock and countdown timers in your browser. Free from HBOMB R.G.",
    },
  ];
}
type Timer = {
  id: number;
  label: string;
  duration: number;
  remaining: number;
  end: number | null;
  done: boolean;
};
const key = "hbomb-time-core-v1";
export default function TimeCore() {
  const [now, setNow] = useState<Date | null>(null);
  const [format, setFormat] = useState("24");
  const [style, setStyle] = useState("signal");
  const [ready, setReady] = useState(false);
  const [storageNote, setStorageNote] = useState("");
  const [timers, setTimers] = useState<Timer[]>([]);
  const [minutes, setMinutes] = useState("5");
  const [seconds, setSeconds] = useState("0");
  const [label, setLabel] = useState("");
  const [message, setMessage] = useState("");
  const [audioStatus, setAudioStatus] = useState(
    "Sound needs a tap to enable.",
  );
  const audio = useRef<AudioContext | null>(null);
  const notified = useRef(new Set<number>());
  const nextId = useRef(0);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "null");
      if (saved?.format === "12" || saved?.format === "24")
        setFormat(saved.format);
      if (["signal", "ember", "minimal"].includes(saved?.style))
        setStyle(saved.style);
    } catch {
      setStorageNote(
        "Local storage is unavailable; preferences last for this visit.",
      );
    }
    setReady(true);
    const tick = () => setNow(new Date());
    tick();
    const interval = window.setInterval(tick, 250);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", tick);
      void audio.current?.close();
      audio.current = null;
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(key, JSON.stringify({ format, style }));
    } catch {
      setStorageNote(
        "Local storage is unavailable; preferences last for this visit.",
      );
    }
  }, [format, style, ready]);
  function beep() {
    const context = audio.current;
    if (!context || context.state !== "running") {
      setAudioStatus(
        "Sound is blocked or suspended. Tap Enable / test sound again.",
      );
      return;
    }
    for (let i = 0; i < 3; i++) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = context.currentTime + i * 0.35;
      oscillator.frequency.value = i === 1 ? 660 : 880;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.25);
      oscillator.onended = () => {
        oscillator.disconnect();
        gain.disconnect();
      };
    }
  }
  async function enableSound() {
    try {
      if (!audio.current) audio.current = new AudioContext();
      await audio.current.resume();
      if (audio.current.state !== "running") throw new Error("Suspended");
      setAudioStatus(
        "Sound enabled. Keep this tab open and your volume audible.",
      );
      beep();
    } catch {
      setAudioStatus(
        "Audio is unavailable or blocked in this browser. Visual alerts still work.",
      );
    }
  }
  useEffect(() => {
    if (!now) return;
    const expired = timers.filter(
      (t) =>
        t.end !== null && t.end <= now.getTime() && !notified.current.has(t.id),
    );
    if (!expired.length) return;
    expired.forEach((t) => notified.current.add(t.id));
    setMessage(expired.map((t) => `${t.label} finished`).join(". "));
    beep();
    setTimers((current) =>
      current.map((t) =>
        expired.some((e) => e.id === t.id)
          ? { ...t, end: null, remaining: 0, done: true }
          : t,
      ),
    );
  }, [now, timers]);
  function addTimer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const m = Number(minutes),
      s = Number(seconds);
    if (
      !Number.isInteger(m) ||
      !Number.isInteger(s) ||
      m < 0 ||
      m > 1440 ||
      s < 0 ||
      s > 59 ||
      m * 60 + s <= 0
    ) {
      setMessage(
        "Enter 0–1440 minutes and 0–59 seconds, with a total above zero.",
      );
      return;
    }
    if (timers.length >= 8) {
      setMessage("Remove a timer before adding another (maximum 8).");
      return;
    }
    const duration = (m * 60 + s) * 1000;
    const id = ++nextId.current;
    setTimers((current) => [
      ...current,
      {
        id,
        label: label.trim() || `Timer ${id}`,
        duration,
        remaining: duration,
        end: Date.now() + duration,
        done: false,
      },
    ]);
    setLabel("");
    setMessage("Timer started.");
  }
  function toggle(timer: Timer) {
    const remaining =
      timer.end === null
        ? timer.remaining
        : Math.max(0, timer.end - Date.now());
    if (!remaining) return;
    setTimers((current) =>
      current.map((t) =>
        t.id === timer.id
          ? {
              ...t,
              remaining,
              end: t.end === null ? Date.now() + remaining : null,
            }
          : t,
      ),
    );
  }
  function reset(timer: Timer) {
    notified.current.delete(timer.id);
    setTimers((current) =>
      current.map((t) =>
        t.id === timer.id
          ? { ...t, remaining: t.duration, end: null, done: false }
          : t,
      ),
    );
  }
  const displayTime =
    now?.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: format === "12",
    }) || "--:--:--";
  return (
    <div className={`tc tc-${style}`}>
      <a className="tc-skip" href="#tc-main">
        Skip to clock
      </a>
      <header className="tc-header">
        <a href="/">← HBOMB R.G. / App hub</a>
        <span>BROWSER EDITION</span>
      </header>
      <main id="tc-main" className="tc-main">
        <div className="tc-heading">
          <div>
            <p className="tc-eyebrow">YOUR TIME. YOUR SIGNAL.</p>
            <h1>
              Time Core<span>.</span>
            </h1>
          </div>
          <p>
            Live local time.
            <br />
            Room to focus.
          </p>
        </div>
        <section className="tc-clock" aria-label="Local clock">
          <p className="tc-eyebrow">LOCAL DEVICE TIME</p>
          <time dateTime={now?.toISOString()} className="tc-digits">
            {displayTime}
          </time>
          <p>
            {now
              ? now.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : "Loading local date…"}
          </p>
          <div className="tc-settings">
            <label>
              Clock format
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="24">24-hour</option>
                <option value="12">12-hour</option>
              </select>
            </label>
            <label>
              Visual style
              <select value={style} onChange={(e) => setStyle(e.target.value)}>
                <option value="signal">Signal blue</option>
                <option value="ember">Red ember</option>
                <option value="minimal">Quiet monochrome</option>
              </select>
            </label>
          </div>
          {storageNote && <p>{storageNote}</p>}
        </section>
        <section className="tc-panel" aria-labelledby="timer-title">
          <div className="tc-section-title">
            <div>
              <p className="tc-eyebrow">MAKE EVERY SECOND COUNT</p>
              <h2 id="timer-title">Countdowns</h2>
            </div>
            <button type="button" onClick={enableSound}>
              Enable / test sound
            </button>
          </div>
          <p className="tc-muted" role="status">
            {audioStatus}
          </p>
          <form className="tc-form" onSubmit={addTimer}>
            <label className="tc-label-input">
              Timer name
              <input
                maxLength={40}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Focus session"
              />
            </label>
            <label>
              Minutes
              <input
                type="number"
                required
                min="0"
                max="1440"
                step="1"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
              />
            </label>
            <label>
              Seconds
              <input
                type="number"
                required
                min="0"
                max="59"
                step="1"
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
              />
            </label>
            <button
              className="tc-primary"
              type="submit"
              disabled={timers.length >= 8}
            >
              Start timer
            </button>
          </form>
          <p className="tc-message" role="status" aria-atomic="true">
            {message}
          </p>
          <div className="tc-timers">
            {!timers.length && (
              <p className="tc-empty">
                Your next focus session starts here. Add a countdown above.
              </p>
            )}
            {timers.map((timer) => {
              const total = Math.ceil(
                Math.max(
                  0,
                  timer.end === null
                    ? timer.remaining
                    : timer.end - (now?.getTime() || Date.now()),
                ) / 1000,
              );
              const reading = `${String(Math.floor(total / 3600)).padStart(2, "0")}:${String(Math.floor(total / 60) % 60).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
              return (
                <article
                  key={timer.id}
                  className={`tc-timer${timer.done ? " tc-done" : ""}`}
                  aria-label={timer.label}
                >
                  <div>
                    <h3>{timer.label}</h3>
                    <p>
                      {timer.done
                        ? "Finished"
                        : timer.end !== null
                          ? "Running"
                          : "Paused · ready to resume"}
                    </p>
                  </div>
                  <span className="tc-count">{reading}</span>
                  <div className="tc-timer-buttons">
                    <button onClick={() => toggle(timer)} disabled={timer.done}>
                      {timer.end !== null ? "Pause" : "Resume"}
                    </button>
                    <button onClick={() => reset(timer)}>Reset</button>
                    <button
                      onClick={() => {
                        setTimers((current) =>
                          current.filter((t) => t.id !== timer.id),
                        );
                        notified.current.delete(timer.id);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
        <aside className="tc-help">
          <h2>Before you step away</h2>
          <ul>
            <li>
              Tap Enable / test sound first. Browser autoplay rules, silent mode
              and device volume can prevent an audible alert.
            </li>
            <li>
              Keep this page open and your device awake. Background tabs, screen
              locks and sleep can delay alerts; countdowns catch up when the
              browser resumes. Device clock changes can affect remaining time.
            </li>
            <li>
              Alerts appear inside this page. This edition does not send system
              notifications or run after the tab closes. Do not rely on it for
              critical reminders.
            </li>
            <li>
              Clock format and style are saved on this browser when storage is
              available. Timers are session-only: refreshing or leaving this
              page clears them. Reset restores the original duration and pauses
              the timer.
            </li>
          </ul>
          <p>
            Want the Windows app?{" "}
            <a href="https://github.com/Hbomb330/hbombrg-com/releases/download/time-core-v2.3.0/HBOMB.Time.Core.Setup.2.3.0.exe">
              Download Time Core 2.3.0 for Windows ↗
            </a>
          </p>
        </aside>
      </main>
      <footer className="tc-footer">
        HBOMB R.G. / TIME CORE WEB · <a href="/orbit-deck">Orbit Deck</a>
      </footer>
    </div>
  );
}
