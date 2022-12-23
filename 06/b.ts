import { readFile } from 'node:fs/promises'

const input = (await readFile('./input.txt')).toString()

const SIZE_OF_MARKER = 14

let i = SIZE_OF_MARKER
for (; i <= input.length; i++) {
	if (new Set(input.slice(i - SIZE_OF_MARKER, i).split('')).size === SIZE_OF_MARKER) break;
}

console.log(i)
