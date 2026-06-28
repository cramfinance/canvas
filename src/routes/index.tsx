import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState, type CSSProperties } from "react";
import ControlPanel from "@/components/ControlPanel";
import type { EnvPreset } from "@/components/CardScene";

const CardScene = lazy(() => import("@/components/CardScene"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "3D Product Ad Studio" },
      {
        name: "description",
        content:
          "Render, extrude, and animate 2D card artwork into photorealistic 3D spinning commercials.",
      },
      { property: "og:title", content: "3D Product Ad Studio" },
      {
        property: "og:description",
        content:
          "Upload card artwork and produce photorealistic 3D spin animations in the browser.",
      },
    ],
  }),
  component: Studio,
});

const DEFAULTS = {
  depth: 1.0,
  spinning: true,
  speed: 0.8,
  env: "studio" as EnvPreset,
  background: "#0d0d12",
};

function Studio() {
  const [frontUrl, setFrontUrl] = useState<string | null>(null);
  const [backUrl, setBackUrl] = useState<string | null>(null);
  const [depth, setDepth] = useState(DEFAULTS.depth);
  const [spinning, setSpinning] = useState(DEFAULTS.spinning);
  const [speed, setSpeed] = useState(DEFAULTS.speed);
  const [env, setEnv] = useState<EnvPreset>(DEFAULTS.env);
  const [background, setBackground] = useState(DEFAULTS.background);
  const [showTextBubble, setShowTextBubble] = useState(false);
  const [bubbleScale, setBubbleScale] = useState(1.0);

  const reset = () => {
    setDepth(DEFAULTS.depth);
    setSpinning(DEFAULTS.spinning);
    setSpeed(DEFAULTS.speed);
    setEnv(DEFAULTS.env);
    setBackground(DEFAULTS.background);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <main className="relative flex-1 min-w-0">
        <div className="absolute inset-0">
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center text-muted-foreground text-sm">
                Loading 3D engine…
              </div>
            }
          >
            <CardScene
              frontUrl={frontUrl}
              backUrl={backUrl}
              depth={depth}
              spinning={spinning}
              speed={speed}
              env={env}
              background={background}
            />
          </Suspense>
        </div>

        <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_var(--color-primary)]" />
          <div>
            <p className="label-mono">Viewport</p>
            <p className="font-mono text-xs text-foreground/80">
              {env.toUpperCase()} · {depth.toFixed(2)}mm · {speed.toFixed(2)}×
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute bottom-8 right-8 z-50 pointer-events-none">
            <div
              className={`bubble-overlay ${showTextBubble ? "bubble-enter" : "bubble-exit"}`}
              style={{
                "--bubble-scale": bubbleScale,
              } as CSSProperties}
            >
              <img
                src="/TXT MESSAGE.png"
                alt="Text bubble"
                className="block max-w-[18rem] w-auto"
              />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-5 right-5 rounded-md border border-border bg-panel/70 backdrop-blur px-3 py-1.5">
          <p className="label-mono">{spinning ? "● Recording spin" : "○ Paused"}</p>
        </div>
      </main>

      <div className="w-[340px] shrink-0 lg:w-[380px]">
        <ControlPanel
          frontUrl={frontUrl}
          backUrl={backUrl}
          onFrontChange={setFrontUrl}
          onBackChange={setBackUrl}
          depth={depth}
          setDepth={setDepth}
          spinning={spinning}
          setSpinning={setSpinning}
          speed={speed}
          setSpeed={setSpeed}
          env={env}
          setEnv={setEnv}
          background={background}
          setBackground={setBackground}
          showTextBubble={showTextBubble}
          setShowTextBubble={setShowTextBubble}
          bubbleScale={bubbleScale}
          setBubbleScale={setBubbleScale}
          onReset={reset}
        />
      </div>
    </div>
  );
}
