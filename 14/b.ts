
import { readFile } from 'node:fs/promises'

interface Vec {
	x: number,
	y: number,
}

const occupiedTiles:Set<string> = new Set()
let lowerBound = 0;

const input = (await readFile('./input.txt')).toString()
const lines = input.split('\n').filter(e => e.length)

for (let line of lines) {
	let points: Vec [] = line.split(' -> ').map(blob => {
		const nums = blob.split(',').map(e => +e)

		if (lowerBound < nums[1]) {
			lowerBound = nums[1]
		}

		return {
			x: nums[0],
			y: nums[1],
		}
	})

	let previousPoint = points.shift() as Vec;

	for (const point of points) {
		if (point.x === previousPoint.x) {
			for (let y = Math.min(point.y, previousPoint.y); y <= Math.max(point.y, previousPoint.y); y++) {
				occupiedTiles.add(`${point.x}:${y}`)
			}
		}
		else if (point.y === previousPoint.y) {
			for (let x = Math.min(point.x, previousPoint.x); x <= Math.max(point.x, previousPoint.x); x++) {
				occupiedTiles.add(`${x}:${point.y}`)
			}
		}
		else {
			throw Error('points unaligned')
		}
		previousPoint = point
	}
}

let numberOfSandUnit = 0

mainLoop:
while (true) {
	let sandPos: Vec = { x: 500, y: 0 }
	if (occupiedTiles.has(`${sandPos.x}:${sandPos.y}`)) {
		break
	}

	while (true) {
		if (!occupiedTiles.has(`${sandPos.x}:${sandPos.y + 1}`)) {
			sandPos.y++
		}
		else if (!occupiedTiles.has(`${sandPos.x - 1}:${sandPos.y + 1}`)) {
			sandPos.y++
			sandPos.x--
		}
		else if (!occupiedTiles.has(`${sandPos.x + 1}:${sandPos.y + 1}`)) {
			sandPos.y++
			sandPos.x++
		}
		else {
			break
		}

		if (sandPos.y > lowerBound) {
			break
		}
	}

	occupiedTiles.add(`${sandPos.x}:${sandPos.y}`)
	numberOfSandUnit++
}

console.log(numberOfSandUnit)
