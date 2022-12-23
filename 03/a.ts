
import { readFile } from 'node:fs/promises'

function splitLine(line: string): [string, string] {
	if (line.length % 2) throw new Error('line must have an even number of character')
	return [line.slice(0, line.length / 2), line.slice(line.length / 2)]
}

function computePriorityOfChar(char: string): number {
	const isLowerCase = char === char.toLowerCase()
	const charCode = char.charCodeAt(0)

	if (isLowerCase) {
		return charCode - 97 + 1
	}
	else {
		return charCode - 65 + 27
	}
}

function computePriorityOfLine(line: string): number {
	const [start, end] = splitLine(line);

	const letters = new Set(start.split(''))

	for (const char of end) {
		if (letters.has(char)) {
			return computePriorityOfChar(char)
		}
	}

	throw new Error('no duplicate on this line : ' + line)
}

const input = (await readFile('./input.txt')).toString()
const lines = input.split('\n').filter(line => line.length)

const sumOfPriorities = lines.reduce((acc, line) => acc + computePriorityOfLine(line), 0)

console.log(sumOfPriorities)
