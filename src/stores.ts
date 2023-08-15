import { writable } from 'svelte/store';
import { Params, Settings, Input } from "./types/types";

export const params = writable<Params>({
	...new Params()
})
export const input = writable<Input>({
	...new Input()
});
export const settings = writable<Settings>({
	...new Settings()
})


