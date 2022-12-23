
import { readFile } from 'node:fs/promises'

enum Shape {
	Rock = 0,
	Paper = 1,
	Scissors = 2,
}

const CharToShape = {
	A: Shape.Rock,
	B: Shape.Paper,
	C: Shape.Scissors,
} as const

function isValidChar(char: string): char is keyof typeof CharToShape {
	return char.length === 1 && 'ABC'.includes(char)
}

function getShape(char: string): Shape {
	if (isValidChar(char)) {
		return CharToShape[char]
	}
	throw Error(`Invalid Char ${char}`)
}

const ScoreForShape = {
	[Shape.Rock]:     1,
	[Shape.Paper]:    2,
	[Shape.Scissors]: 3,
} as const

enum RoundOutcome {
	Win = 1,
	Draw = 0,
	Lose = -1,
}

const charToOutcome = {
	X: RoundOutcome.Lose,
	Y: RoundOutcome.Draw,
	Z: RoundOutcome.Win,
} as const

function isValidCharForOutcome(char: string): char is keyof typeof charToOutcome {
	return char.length === 1 && 'XYZ'.includes(char)
}

function getOutcome(char: string): RoundOutcome {
	if (isValidCharForOutcome(char)) {
		return charToOutcome[char]
	}
	throw Error(`Invalid Outcome ${char}`)
}

const ScoreForOutcome = {
	[RoundOutcome.Lose]: 0,
	[RoundOutcome.Draw]: 3,
	[RoundOutcome.Win]:  6,
}

function calculateOutcome(me:Shape, them:Shape): RoundOutcome {
	let diff = me - them
	if (diff === -2) diff = 1
	if (diff === 2)  diff = -1
	return diff
}

function selectShapeForOutcome(them: Shape, desiredOutcome: RoundOutcome): Shape {
	let shape = them + desiredOutcome
	if (shape === 3) shape = 0
	if (shape === -1) shape = 2
	return shape
}

function calculateScoreOfRound(them: Shape, desiredOutcome: RoundOutcome) {
	const me = selectShapeForOutcome(them, desiredOutcome)
	return (
		ScoreForOutcome[calculateOutcome(me, them)] +
		ScoreForShape[me]
	)
}

const input = (await readFile('./input.txt')).toString()
const rounds = input.split('\n').filter(line => line.length >= 3)
const score = rounds.reduce((acc, round) => acc + calculateScoreOfRound(getShape(round[0]), getOutcome(round[2])), 0)

console.log(score)
