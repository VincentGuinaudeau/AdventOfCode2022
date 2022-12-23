
import { readFile } from 'node:fs/promises'

const stacks: Record<string, string[]> = {}

const input = (await readFile('./input.txt')).toString()
const lines = input.split('\n')

const separator = lines.findIndex(e => e === '')

const state = lines.slice(0, separator)
const groundLine = state[state.length - 1]

for (let Hscan = 0; Hscan < groundLine.length; Hscan ++) {
	const stackName = groundLine[Hscan]
	if (!stackName || stackName === ' ') continue;

	const stack: string[] = [];
	for (let Vscan = state.length - 2; Vscan >= 0; Vscan--) {
		const char = state[Vscan][Hscan]
		if (char && char !== ' ') {
			stack.push(char)
		}
	}
	stacks[stackName] = stack
}

const instructions = lines.slice(separator).filter(line => line.length)

for (const instruction of instructions) {
	const [,toMove, from, to] = /move (\d+) from (\d+) to (\d+)/.exec(instruction) ?? [ '0', '0', '0']

	for (let i = 0; i < +toMove; i++) {
		const elem = stacks[from].pop()
		if (elem) stacks[to].push(elem)
	}
}

console.log(Object.values(stacks).map(stack => stack[stack.length - 1]).join(''))
