import { readonly, writable } from 'svelte/store';
import { Automaton, Callbacks, Params } from "./types/types";

export const callbacks = writable<Callbacks>({
	...new Callbacks()
})


export const automaton = writable<Automaton>({
	...new Automaton()
})

