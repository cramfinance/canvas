import { useRef, type ChangeEvent } from "react";
import { Pause, Play, Upload, RotateCcw } from "lucide-react";
import type { EnvPreset } from "./CardScene";

interface Props {
  frontUrl: string | null;
  backUrl: string | null;
  onFrontChange: (url: string | null) => void;
  onBackChange: (url: string | null) => void;
  depth: number;
  setDepth: (v: number) => void;
  spinning: boolean;
  setSpinning: (v: boolean) => void;
  speed: number;
  setSpeed: (v: number) => void;
  env: EnvPreset;
  setEnv: (v: EnvPreset) => void;
  background: string;
  setBackground: (v: string) => void;
  showTextBubble: boolean;
  setShowTextBubble: (v: boolean) => void;
  bubbleScale: number;
  setBubbleScale: (v: number) => void;
  onReset: () => void;
}

function ImageDrop({
  label,
  url,
  onChange,
}: {
  label: string;
  url: string | null;
  onChange: (url: string | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="label-mono">{label}</span>
        {url && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-[0.65rem] text-muted-foreground hover:text-foreground transition"
          >
            clear
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="group relative w-full aspect-[1.586/1] rounded-md border border-dashed border-border bg-surface/60 hover:border-primary/60 hover:bg-surface transition overflow-hidden"
      >
        {url ? (
          <img
            src={url}
            alt={label}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground group-hover:text-foreground transition">
            <Upload className="h-5 w-5" />
            <span className="text-xs">Drop image or click</span>
          </div>
        )}
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handle}
      />
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="label-mono">{label}</span>
        <span className="font-mono text-xs text-foreground">
          {display ?? value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 appearance-none rounded-full bg-secondary accent-primary cursor-pointer"
      />
    </div>
  );
}

const ENV_OPTIONS: { value: EnvPreset; label: string }[] = [
  { value: "studio", label: "Studio Light" },
  { value: "cinematic", label: "Cinematic Dark" },
  { value: "stark", label: "Stark White" },
];

const BG_SWATCHES = ["#0d0d12", "#1a1a22", "#202036", "#2b1f1f", "#0a1f1c", "#ffffff"];

export default function ControlPanel(props: Props) {
  return (
    <aside className="flex h-full w-full flex-col border-l border-border bg-panel">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <p className="label-mono">Studio</p>
          <h1 className="text-sm font-semibold tracking-tight text-foreground">
            3D Product Ad
          </h1>
        </div>
        <button
          type="button"
          onClick={props.onReset}
          className="rounded-md border border-border p-2 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition"
          title="Reset scene"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-7">
        <section className="space-y-4">
          <h2 className="label-mono">Textures</h2>
          <ImageDrop
            label="Front Card"
            url={props.frontUrl}
            onChange={props.onFrontChange}
          />
          <ImageDrop
            label="Back Card"
            url={props.backUrl}
            onChange={props.onBackChange}
          />
        </section>

        <section className="space-y-5">
          <h2 className="label-mono">Geometry</h2>
          <Slider
            label="Extrusion Depth"
            value={props.depth}
            min={0.1}
            max={5.0}
            step={0.05}
            onChange={props.setDepth}
            display={`${props.depth.toFixed(2)}mm`}
          />
        </section>

        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="label-mono">Motion</h2>
            <button
              type="button"
              onClick={() => props.setSpinning(!props.spinning)}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition"
            >
              {props.spinning ? (
                <>
                  <Pause className="h-3 w-3" /> Pause
                </>
              ) : (
                <>
                  <Play className="h-3 w-3" /> Play
                </>
              )}
            </button>
          </div>
          <Slider
            label="Spin Speed"
            value={props.speed}
            min={0}
            max={5}
            step={0.05}
            onChange={props.setSpeed}
            display={`${props.speed.toFixed(2)}×`}
          />
        </section>

        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="label-mono">Text Overlay</h2>
            <button
              type="button"
              onClick={() => props.setShowTextBubble(!props.showTextBubble)}
              className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition"
            >
              {props.showTextBubble ? "Hide" : "Show"}
            </button>
          </div>

          <Slider
            label="Text Bubble Size"
            value={props.bubbleScale}
            min={0.1}
            max={5.0}
            step={0.1}
            onChange={props.setBubbleScale}
            display={`${props.bubbleScale.toFixed(1)}×`}
          />
        </section>

        <section className="space-y-4">
          <h2 className="label-mono">Environment</h2>
          <div className="space-y-2">
            <span className="label-mono">Lighting</span>
            <div className="grid grid-cols-1 gap-1.5">
              {ENV_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => props.setEnv(opt.value)}
                  className={`rounded-md border px-3 py-2 text-left text-xs transition ${
                    props.env === opt.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-surface/60 text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="label-mono">Background</span>
            <div className="flex flex-wrap gap-2">
              {BG_SWATCHES.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => props.setBackground(color)}
                  className={`h-7 w-7 rounded-md border transition ${
                    props.background === color
                      ? "border-primary ring-2 ring-primary/40"
                      : "border-border hover:border-foreground/40"
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Background ${color}`}
                />
              ))}
              <label className="relative h-7 w-7 rounded-md border border-border overflow-hidden cursor-pointer hover:border-foreground/40">
                <input
                  type="color"
                  value={props.background}
                  onChange={(e) => props.setBackground(e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
                <div
                  className="h-full w-full"
                  style={{
                    background:
                      "conic-gradient(from 0deg,#f43,#fa3,#fd3,#3f6,#3cf,#63f,#f3a,#f43)",
                  }}
                />
              </label>
            </div>
          </div>
        </section>
      </div>

      <div className="border-t border-border px-5 py-3">
        <p className="label-mono">Drag the canvas to orbit · scroll to zoom</p>
      </div>
    </aside>
  );
}
