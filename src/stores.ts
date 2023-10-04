import { writable } from 'svelte/store';
import type { Kernel, Params, Rule } from "./types/params";
import type { GradientPoint } from './types/ui';
import type { Scene } from './webgl/scene';


export const kernels = writable<Kernel[]>([]);

export const rules = writable<Rule[]>([]);
export const kernRadius = writable<number>(16);

export const scene = writable<Scene|any>(null);
export const fpsLimit = writable<number>(80);

export const presets = writable<Params[]|any[]>([]);
export const gradient = writable<GradientPoint[]|null>(null);

export const toolTip = writable<string>("");
