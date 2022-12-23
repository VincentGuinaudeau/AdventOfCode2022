
import { readFile } from 'node:fs/promises'

enum Direction {
	Left = 0,
	Down = 1,
	Right = 2,
	Up = 3,
}

const charToDirection = {
	L: Direction.Left,
	D: Direction.Down,
	R: Direction.Right,
	U: Direction.Up,
} as const

interface Position {
	x: number,
	y: number,
}

const headPos:Position = { x: 0, y: 0 };
const tailPos:Position = { x: 0, y: 0 };

const tailTrail = new Set();
updateTail();

function updateTail() {
	tailTrail.add(`${tailPos.x}.${tailPos.y}`);
}

function tailFollow() {
	if (tailPos.x < headPos.x - 1) {
		tailPos.x = headPos.x - 1
		tailPos.y = headPos.y
	}
	if (tailPos.x > headPos.x + 1) {
		tailPos.x = headPos.x + 1
		tailPos.y = headPos.y
	}
	if (tailPos.y < headPos.y - 1) {
		tailPos.y = headPos.y - 1
		tailPos.x = headPos.x
	}
	if (tailPos.y > headPos.y + 1) {
		tailPos.y = headPos.y + 1
		tailPos.x = headPos.x
	}
	updateTail()
}

function move(direction: Direction) {
	headPos[direction % 2 ? 'y' : 'x'] += direction < 2 ? -1 : 1;
	tailFollow()
}


function isValidChar(char: string): char is keyof typeof charToDirection {
	return char.length === 1 && 'LDRU'.includes(char)
}

function moveInstruction(line: string) {

	const directionChar = line[0];

	if (!isValidChar(directionChar)) {
		throw new Error('Invalid direction');
	}
	const direction = charToDirection[directionChar];
	const steps = parseInt(line.slice(2))
	if (isNaN(steps) || steps < 1) {
		throw new Error('Invalid steps');
	}

	for (let i = 0; i < steps; i++) {
		move(direction);
	}
}

const input = (await readFile('./input.txt')).toString()
const lines = input.split('\n').filter(e => e.length)

for (let line of lines) {
	moveInstruction(line);
}

console.log(tailTrail.size);
