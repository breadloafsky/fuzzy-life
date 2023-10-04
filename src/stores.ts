import { writable } from 'svelte/store';
import { Settings } from "./types/settings";
import { Callbacks } from "./types/callbacks";
import { Params } from "./types/params";
import { TempParams } from './types/tempParams';
import type { GradientPoint } from './types/ui';
import type { Scene } from './webgl/scene';

export const callbacks = writable<Callbacks>({
	...new Callbacks()
});
export const params = writable<Params>({
	...new Params()
});
export const tempParams = writable<TempParams>({
	...new TempParams()
});
export const settings = writable<Settings>({
	...new Settings()
});
export const scene = writable<Scene|any>(null);
export const presets = writable<Params[]|any[]>([]);
export const toolTip = writable<string>("");
export const gradient = writable<GradientPoint[]>(
	[
		{
			"color": "#000000",
			"pos": 0
		},
		{
			"color": "#0054a8",
			"pos": 0.25
		},
		{
			"color": "#4fdc4a",
			"pos": 0.5
		},
		{
			"color": "#d0de21",
			"pos": 0.75
		},
		{
			"color": "#ff0000",
			"pos": 1
		}	  
	]
);
