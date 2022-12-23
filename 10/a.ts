
import { readFile } from 'node:fs/promises'

const registers = {
	X: 1,
}

let sumOfSignalStrength = 0

let cycleCounter = 0;
function handleCycle() {
	cycleCounter++

	if ((cycleCounter + 20) % 40 === 0) {
		sumOfSignalStrength += cycleCounter * registers.X
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

console.log(sumOfSignalStrength);
