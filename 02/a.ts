
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
	X: Shape.Rock,
	Y: Shape.Paper,
	Z: Shape.Scissors,
} as const

function isValidChar(char: string): char is keyof typeof CharToShape {
	return char.length === 1 && 'ABCXYZ'.includes(char)
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

function calculateScoreOfRound(me: Shape, them: Shape) {
	return (
		ScoreForOutcome[calculateOutcome(me, them)] +
		ScoreForShape[me]
	)
}

const input = (await readFile('./input.txt')).toString()
const rounds = input.split('\n').filter(line => line.length >= 3)
const score = rounds.reduce((acc, round) => acc + calculateScoreOfRound(getShape(round[2]), getShape(round[0])), 0)

console.log(score)
