
import { readFile } from 'node:fs/promises'

const registers = {
	X: 1,
}

let sumOfSignalStrength = 0

let screen = Array(240).fill(false)

let cycleCounter = 0;
function handleCycle() {
	cycleCounter++

	if (Math.abs((registers.X + 1) - cycleCounter % 40) < 2) {
		screen[cycleCounter - 1] = true
	}
}

const instructions: Record<string, (...args: string[]) => void> = {
	noop() {
		handleCycle()
	},

	addx(value: string) {
		handleCycle()
		handleCycle()
		registers.X += +value
	},
}

function handleInstruction(line: string) {
	const [instructionName, ...args] = line.split(' ')

	if (!(instructionName in instructions)) {
		throw new Error('Invalid instruction')
	}

	instructions[instructionName](...args)
}

const input = (await readFile('./input.txt')).toString()
const lines = input.split('\n').filter(e => e.length)

for (const line of lines) {
	handleInstruction(line);
}

while (cycleCounter < 240) {
	handleCycle()
}

console.log(Array(6).fill(null).map((_, y) => {
	return Array(40).fill(null).map((_, x) => screen[y * 40 + x] ? '#' : '.').join('')
}).join('\n'));
