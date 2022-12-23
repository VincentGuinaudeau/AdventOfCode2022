
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

const whip = Array(10).fill(null).map(_ => ({ x: 0, y: 0 }))

const tailTrail = new Set();

function tailFollow(head: Position, tail: Position) {
	let xMoved = false;
	let yMoved = false;
	if (tail.x < head.x - 1) {
		tail.x = head.x - 1
		xMoved = true;
	}
	if (tail.x > head.x + 1) {
		tail.x = head.x + 1
		xMoved = true;
	}
	if (tail.y < head.y - 1) {
		tail.y = head.y - 1
		yMoved = true;
	}
	if (tail.y > head.y + 1) {
		tail.y = head.y + 1
		yMoved = true;
	}

	if (xMoved && !yMoved) {
		tail.y = head.y
	}
	else if (yMoved && !xMoved) {
		tail.x = head.x
	}
}

function updateTiptrail() {
	tailTrail.add(`${whip[9].x}.${whip[9].y}`);
}

function move(direction: Direction) {
	whip[0][direction % 2 ? 'y' : 'x'] += direction < 2 ? -1 : 1;
	for (let i = 0; i < whip.length - 1; i++) {
		tailFollow(whip[i], whip[i + 1])
	}
	updateTiptrail()
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
// const input = (await readFile('./example.txt')).toString()
const lines = input.split('\n').filter(e => e.length)

for (let line of lines) {
	moveInstruction(line);
}

console.log(tailTrail.size);
