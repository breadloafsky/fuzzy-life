import { writable } from 'svelte/store';
import { Settings } from "./types/settings";
import { Callbacks } from "./types/callbacks";
import { Params } from "./types/params";
import { TempParams } from './types/tempParams';

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
export const presets = writable<Params[]|any[]>([]);

export const toolTip = writable<string>("");