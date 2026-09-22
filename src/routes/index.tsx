import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Sparkles, X } from "lucide-react";
import { useState } from "react";

import crocodileAsset from "../assets/crocodile.png.asset.json";
import footballAsset from "../assets/football.png.asset.json";
import globeAsset from "../assets/globe.png.asset.json";
import peacockAsset from "../assets/peacock-color.png.asset.json";
import doveAsset from "../assets/dove.png.asset.json";

function playTone(kind: "correct" | "wrong") {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    const notes = kind === "correct" ? [659.25, 830.61, 987.77, 1318.51] : [180, 120];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = kind === "correct" ? "triangle" : "square";
      osc.frequency.value = freq;
      const start = now + i * (kind === "correct" ? 0.09 : 0.18);
      const dur = kind === "correct" ? 0.42 : 0.26;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(kind === "correct" ? 0.22 : 0.3, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur + 0.02);
    });
    window.setTimeout(() => ctx.close(), 1600);
  } catch {
    /* audio is optional */
  }
}

const CONFETTI = Array.from({ length: 26 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  dx: `${((i * 53) % 120) - 60}px`,
  dr: `${((i * 97) % 720) - 360}deg`,
  dur: `${1.1 + ((i * 13) % 7) / 10}s`,
  delay: `${((i * 7) % 5) / 12}s`,
  color: ["oklch(0.82 0.17 92)", "oklch(0.7 0.18 150)", "oklch(0.75 0.15 200)", "oklch(0.88 0.14 110)"][i % 4],
  size: 8 + (i % 4) * 4,
}));

function FeedbackBurst({ kind }: { kind: "correct" | "wrong" }) {
  const correct = kind === "correct";
  return (
    <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center">
      <div
        className="burst-veil absolute inset-0 backdrop-blur-sm"
        style={{
          background: correct
            ? "radial-gradient(circle at 50% 45%, color-mix(in oklab, oklch(0.84 0.17 95) 70%, transparent), color-mix(in oklab, oklch(0.68 0.18 152) 55%, transparent) 55%, color-mix(in oklab, var(--background) 82%, transparent) 85%)"
            : "radial-gradient(circle at 50% 45%, color-mix(in oklab, oklch(0.62 0.23 27) 55%, transparent), color-mix(in oklab, var(--background) 80%, transparent) 75%)",
        }}
      />
      {correct && (
        <>
          <div className="burst-ripple absolute size-72 rounded-full border-[6px] border-[oklch(0.86_0.16_95)]" />
          <div className="absolute inset-0 overflow-hidden">
            {CONFETTI.map((c, i) => (
              <span
                key={i}
                className="confetti-piece absolute top-[-8vh] rounded-[3px]"
                style={{ left: c.left, width: c.size, height: c.size * 1.6, background: c.color, ["--dx" as string]: c.dx, ["--dr" as string]: c.dr, ["--dur" as string]: c.dur, ["--delay" as string]: c.delay }}
              />
            ))}
          </div>
        </>
      )}
      <div className={`${correct ? "burst-pop" : "burst-shake"} relative grid place-items-center`}>
        <div
          className="grid size-40 place-items-center rounded-full shadow-[0_30px_80px_rgba(0,0,0,0.25)] sm:size-52"
          style={{
            background: correct
              ? "linear-gradient(140deg, oklch(0.88 0.16 95), oklch(0.66 0.18 152))"
              : "linear-gradient(140deg, oklch(0.68 0.22 30), oklch(0.55 0.22 25))",
            color: "white",
          }}
        >
          {correct ? <Check className="size-24 sm:size-28" strokeWidth={3} /> : <X className="size-24 sm:size-28" strokeWidth={3} />}
        </div>
        <p className="mt-6 text-[clamp(1.6rem,5vw,3rem)] font-semibold text-foreground">{correct ? "Great choice!" : "Hmm, not this one."}</p>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Student Pre-Elections — Two choices. One voice." },
      { name: "description", content: "An interactive student pre-election campaign experience for Vice President candidates." },
      { property: "og:title", content: "Student Pre-Elections" },
      { property: "og:description", content: "Two choices. One voice." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Stage = "opening" | "boy" | "boy-detail" | "boy-confirm" | "girl" | "girl-detail" | "girl-confirm" | "final" | "done";
type Candidate = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  preferred: boolean;
  message: string;
  note: string;
};

const boys: Candidate[] = [
  { id: "fasih", name: "Muhammad Fasih Ur Rehman", symbol: "Crocodile", image: crocodileAsset.url, preferred: true, message: "Calm under pressure. Sharp on the details. Ready to lead.", note: "A choice with real bite — in the friendliest possible way." },
  { id: "abubakr", name: "Abu Bakr", symbol: "Football", image: footballAsset.url, preferred: false, message: "A brilliant symbol — but elections have no extra time.", note: "The campaign respectfully suggests keeping the football for the pitch and choosing the Crocodile for VP." },
  { id: "qamar", name: "Muhammad Qamar", symbol: "Globe", image: globeAsset.url, preferred: false, message: "Thinking globally is excellent. Starting with one school is slightly easier.", note: "The world can wait a moment. The Crocodile is ready right now." },
];

const girls: Candidate[] = [
  { id: "azla", name: "Azla", symbol: "Peacock", image: peacockAsset.url, preferred: true, message: "Confident. Distinctive. Impossible to overlook.", note: "A bold voice, a bright presence, and a campaign ready to spread its wings." },
  { id: "minaal", name: "Minaal", symbol: "Dove", image: doveAsset.url, preferred: false, message: "Peace is wonderful. Campaign season needs a little more plumage.", note: "The Dove brings calm; the campaign thinks the Peacock brings the moment." },
];

function Index() {
  const [stage, setStage] = useState<Stage>("opening");
  const [active, setActive] = useState<Candidate | null>(null);
  const [burst, setBurst] = useState<"correct" | "wrong" | null>(null);

  const openCandidate = (candidate: Candidate, group: "boy" | "girl") => {
    const kind = candidate.preferred ? "correct" : "wrong";
    setActive(candidate);
    setBurst(kind);
    playTone(kind);
    window.setTimeout(() => {
      setBurst(null);
      setStage(group === "boy" ? "boy-detail" : "girl-detail");
    }, kind === "correct" ? 1500 : 1100);
  };

  const choose = () => {
    const next: Stage = stage === "boy-detail" ? "boy-confirm" : "girl-confirm";
    setBurst("correct");
    playTone("correct");
    window.setTimeout(() => {
      setBurst(null);
      setStage(next);
    }, 1400);
  };

  return (
    <main className="relative isolate h-[100dvh] min-h-[600px] overflow-hidden bg-background text-foreground selection:bg-accent/20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_5%,color-mix(in_oklab,var(--accent)_8%,transparent),transparent_34%),radial-gradient(circle_at_84%_95%,color-mix(in_oklab,var(--ring)_10%,transparent),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,transparent,black_25%,transparent)]" />

      {stage === "opening" && <Opening onBegin={() => setStage("boy")} />}
      {stage === "boy" && <SelectionStage title="Boy Vice President" step="01" candidates={boys} onSelect={(c) => openCandidate(c, "boy")} />}
      {stage === "girl" && <SelectionStage title="Girl Vice President" step="02" candidates={girls} onSelect={(c) => openCandidate(c, "girl")} />}
      {(stage === "boy-detail" || stage === "girl-detail") && active && (
        <CandidateDetail candidate={active} onBack={() => setStage(stage === "boy-detail" ? "boy" : "girl")} onChoose={choose} />
      )}
      {(stage === "boy-confirm" || stage === "girl-confirm") && active && (
        <Confirmation candidate={active} label={stage === "boy-confirm" ? "First choice made" : "Second choice made"} onContinue={() => setStage(stage === "boy-confirm" ? "girl" : "final")} />
      )}
      {(stage === "final" || stage === "done") && <FinalScreen done={stage === "done"} onDone={() => setStage("done")} />}
      {burst && <FeedbackBurst kind={burst} />}
    </main>
  );
}

function Shell({ children, step }: { children: React.ReactNode; step?: string }) {
  return (
    <section className="stage-enter mx-auto flex h-full w-full max-w-[1180px] flex-col px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-[max(24px,env(safe-area-inset-top))] sm:px-10 lg:px-14">
      <header className="grid h-11 grid-cols-[1fr_auto] items-center">
        <div className="flex min-w-0 items-center gap-3 text-[12px] font-semibold uppercase text-muted-foreground">
          <span className="grid size-7 shrink-0 place-items-center rounded-full border border-border bg-card shadow-sm">SE</span>
          <span className="truncate">Student Pre-Elections</span>
        </div>
        {step && <span className="text-sm font-medium tabular-nums text-muted-foreground">{step} / 02</span>}
      </header>
      {children}
    </section>
  );
}

function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-primary px-8 text-[16px] font-semibold text-primary-foreground shadow-[0_14px_38px_color-mix(in_oklab,var(--primary)_22%,transparent)] transition duration-200 active:scale-[0.97] sm:min-h-16 sm:px-10 sm:text-lg">
      {children}<ArrowRight className="size-5 transition-transform group-active:translate-x-1" strokeWidth={2} />
    </button>
  );
}

function Opening({ onBegin }: { onBegin: () => void }) {
  return (
    <Shell>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-8 flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-xs font-semibold uppercase text-muted-foreground shadow-sm backdrop-blur-xl sm:text-sm">
          <Sparkles className="size-4 text-accent" /> Your voice, your moment
        </div>
        <h1 className="max-w-5xl text-balance text-[clamp(3.3rem,9vw,7.7rem)] font-semibold leading-[0.91] text-foreground">Student<br />Pre-Elections</h1>
        <p className="mt-7 text-xl font-medium text-muted-foreground sm:text-2xl">Two choices. One voice.</p>
        <div className="mt-10 sm:mt-14"><PrimaryButton onClick={onBegin}>Begin</PrimaryButton></div>
      </div>
      <p className="pb-1 text-center text-xs font-medium text-muted-foreground">A fast, two-stage campaign experience</p>
    </Shell>
  );
}

function SelectionStage({ title, step, candidates, onSelect }: { title: string; step: string; candidates: Candidate[]; onSelect: (candidate: Candidate) => void }) {
  return (
    <Shell step={step}>
      <div className="flex flex-1 flex-col justify-center py-5 sm:py-8">
        <div className="mb-6 sm:mb-9">
          <p className="mb-2 text-sm font-semibold uppercase text-accent">Stage {step}</p>
          <h1 className="text-[clamp(2.3rem,6vw,5.2rem)] font-semibold leading-none">{title}</h1>
          <p className="mt-3 text-lg text-muted-foreground sm:text-xl">Choose your candidate.</p>
        </div>
        <div className={`grid min-h-0 flex-1 gap-3 sm:gap-5 ${candidates.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
          {candidates.map((candidate) => (
            <button key={candidate.id} onClick={() => onSelect(candidate)} className={`group relative flex min-w-0 flex-col overflow-hidden rounded-[1.7rem] border p-3 text-left shadow-[0_16px_48px_color-mix(in_oklab,var(--foreground)_7%,transparent)] backdrop-blur-xl transition duration-200 active:scale-[0.975] sm:p-5 lg:p-6 ${candidate.preferred ? "border-[oklch(0.82_0.15_95)] bg-[linear-gradient(150deg,color-mix(in_oklab,oklch(0.88_0.16_95)_18%,var(--card)),color-mix(in_oklab,oklch(0.68_0.18_152)_16%,var(--card)))]" : "border-border bg-card/75"}`}>
              <span className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase backdrop-blur sm:right-5 sm:top-5 sm:text-[11px] ${candidate.preferred ? "border-transparent bg-[linear-gradient(135deg,oklch(0.85_0.16_95),oklch(0.66_0.18_152))] text-white" : "border-border bg-background/80 text-muted-foreground"}`}>{candidate.preferred ? "Campaign pick" : "Explore"}</span>
              <div className="flex min-h-0 flex-1 items-center justify-center p-2 sm:p-5">
                <img src={candidate.image} alt={`${candidate.symbol} symbol`} className="max-h-[24vh] w-full max-w-[270px] object-contain mix-blend-multiply transition-transform duration-300 group-active:scale-95" />
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-2 border-t border-border pt-3 sm:pt-5">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground sm:text-xs">{candidate.symbol}</p>
                  <h2 className="mt-1 text-[clamp(1rem,2vw,1.55rem)] font-semibold leading-tight">{candidate.name}</h2>
                </div>
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary transition group-active:bg-primary group-active:text-primary-foreground sm:size-11"><ChevronRight className="size-5" /></span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Shell>
  );
}

function CandidateDetail({ candidate, onBack, onChoose }: { candidate: Candidate; onBack: () => void; onChoose: () => void }) {
  return (
    <Shell>
      <div className="grid flex-1 items-center gap-5 py-5 md:grid-cols-[0.9fr_1.1fr] md:gap-12">
        <div className="flex min-h-0 items-center justify-center">
          <img src={candidate.image} alt={`${candidate.symbol} symbol`} className="float-symbol max-h-[36vh] w-full max-w-[440px] object-contain mix-blend-multiply md:max-h-[52vh]" />
        </div>
        <div className="mx-auto w-full max-w-xl text-center md:text-left">
          <span className={`inline-flex rounded-full px-3.5 py-2 text-xs font-bold uppercase ${candidate.preferred ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground"}`}>{candidate.preferred ? "Campaign pick" : "Campaign briefing"}</span>
          <p className="mt-5 text-sm font-bold uppercase text-muted-foreground">{candidate.symbol}</p>
          <h1 className="mt-2 text-[clamp(2.2rem,6vw,5.5rem)] font-semibold leading-[0.96]">{candidate.name}</h1>
          <p className="mt-5 text-xl font-semibold leading-snug sm:text-2xl">{candidate.message}</p>
          <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-muted-foreground md:mx-0 sm:text-lg">{candidate.note}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
            <button onClick={onBack} className="inline-flex min-h-14 items-center gap-2 rounded-full border border-border bg-card px-6 text-base font-semibold shadow-sm active:scale-[0.97]"><ArrowLeft className="size-5" />Back</button>
            {candidate.preferred && <PrimaryButton onClick={onChoose}>Choose {candidate.symbol}</PrimaryButton>}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Confirmation({ candidate, label, onContinue }: { candidate: Candidate; label: string; onContinue: () => void }) {
  return (
    <Shell>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="confirm-ring grid size-24 place-items-center rounded-full bg-accent text-accent-foreground shadow-[0_20px_60px_color-mix(in_oklab,var(--accent)_28%,transparent)] sm:size-28"><Check className="size-12" strokeWidth={2.5} /></div>
        <p className="mt-7 text-sm font-bold uppercase text-accent">{label}</p>
        <h1 className="mt-2 text-[clamp(2.6rem,7vw,6rem)] font-semibold leading-none">{candidate.symbol} selected.</h1>
        <p className="mt-4 text-xl text-muted-foreground">{candidate.name}</p>
        <div className="mt-9"><PrimaryButton onClick={onContinue}>Continue</PrimaryButton></div>
      </div>
    </Shell>
  );
}

function FinalScreen({ done, onDone }: { done: boolean; onDone: () => void }) {
  return (
    <Shell>
      <div className="flex flex-1 flex-col items-center justify-center py-4 text-center">
        <p className="text-sm font-bold uppercase text-accent">Campaign complete</p>
        <h1 className="mt-3 text-[clamp(2.4rem,6vw,5.4rem)] font-semibold leading-none">{done ? "Thank you." : "Your choices have been made."}</h1>
        <div className="mt-7 grid w-full max-w-3xl grid-cols-2 gap-3 sm:gap-5">
          {[
            { ...boys[0], role: "Boy Vice President" },
            { ...girls[0], role: "Girl Vice President" },
          ].map((candidate) => (
            <article key={candidate.id} className="flex min-w-0 flex-col items-center rounded-[1.7rem] border border-border bg-card/75 p-4 shadow-[0_16px_48px_color-mix(in_oklab,var(--foreground)_7%,transparent)] backdrop-blur-xl sm:p-6">
              <img src={candidate.image} alt={`${candidate.symbol} symbol`} className="h-[16vh] min-h-24 w-full object-contain mix-blend-multiply sm:h-[21vh]" />
              <p className="mt-3 text-[10px] font-bold uppercase text-muted-foreground sm:text-xs">{candidate.role}</p>
              <h2 className="mt-1 text-[clamp(1.05rem,2.5vw,1.75rem)] font-semibold leading-tight">{candidate.name}</h2>
              <p className="mt-1 text-sm font-semibold text-accent">{candidate.symbol}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-lg font-medium text-muted-foreground">Lead with confidence. Choose with character.</p>
        {!done && <div className="mt-6"><PrimaryButton onClick={onDone}>Done</PrimaryButton></div>}
        {done && <p className="mt-7 rounded-full bg-secondary px-5 py-3 text-sm font-semibold text-muted-foreground">Ready for the next student after a page reload.</p>}
      </div>
    </Shell>
  );
}
