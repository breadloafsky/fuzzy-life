import { writable } from 'svelte/store';
import { Automaton, Callbacks } from "./types/types";

export const callbacks = writable<Callbacks>({
	...new Callbacks()
})


export const automaton = writable<Automaton>({
	...new Automaton()
})



