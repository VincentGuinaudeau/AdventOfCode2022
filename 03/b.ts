
import { readFile } from 'node:fs/promises'

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

function computePriorityOfGroup(lines: string[]): number {

	const letters = new Set(lines[0].split(''))

	const secondLetters = new Set()

	for (const char of lines[1]) {
		if (letters.has(char)) {
			secondLetters.add(char)
		}
	}

	for (const char of lines[2]) {
		if (secondLetters.has(char)) {
			return computePriorityOfChar(char)
		}
	}

	throw new Error('no duplicate on this group : ' + lines)
}

const input = (await readFile('./input.txt')).toString()
const lines = input.split('\n').filter(line => line.length)

const groupsOfLines = lines.reduce((acc:string[][], line) => (acc.length === 0 || acc[0].length === 3 ? acc.unshift([line]) : acc[0].push(line), acc), [])

const sumOfPriorities = groupsOfLines.reduce((acc, lines) => acc + computePriorityOfGroup(lines), 0)

console.log(sumOfPriorities)
