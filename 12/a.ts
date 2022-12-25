
import { readFile } from 'node:fs/promises'

enum Direction {
	Left = 0,
	Up = 1,
	Right = 2,
	Down = 3,
}

const allDirections = [
	Direction.Left,
	Direction.Down,
	Direction.Right,
	Direction.Up,
] as const

interface Path {
	direction: Direction,
	distance: number,
}

interface Cell {
	x: number,
	y: number,
	height: number,
	canReach: Direction [],
	reachMe: Direction [],
	path: Path | null,
}

const input = (await readFile('./input.txt')).toString()
let start: Cell | null = null
let end: Cell | null = null

const grid: Cell [] [] = []
for (let [y, line] of input.split('\n').filter(e => e.length).entries()) {
	const row: Cell [] = []
	grid.push(row)
	for (let [x, letter] of line.split('').entries()) {
		const cell: Cell = {
			x,
			y,
			height: 0,
			canReach: [],
			reachMe: [],
			path: null,
		}

		if (letter === 'S') {
			start = cell
			cell.path = {
				distance: 0,
				direction: Direction.Up
			}
		}
		else if (letter === 'E') {
			end = cell
			cell.height = 25
		}
		else {
			cell.height = letter.charCodeAt(0) - 'a'.charCodeAt(0)
		}

		row.push(cell)
	}
}

if (!start || !end) {
	console.log('missing start or end')
	process.exit(1)
}

function getCell(cell: Cell, dir: Direction): Cell | null {
	let { x, y } = cell

	if (dir % 2) {
		y += Math.floor(dir / 2) ? 1 : -1
	}
	else {
		x +=  Math.floor(dir / 2) ? 1 : -1
	}

	return grid[y]?.[x] ?? null
}

// link cells
{
	for (const row of grid) {
		for (const cell of row) {
			for (const dir of allDirections) {
				const neighbor = getCell(cell, dir)
				if (neighbor && cell.height >= neighbor.height - 1) {
					cell.canReach.push(dir)
					neighbor.reachMe.push(dir ^ 2)
				}
			}
		}
	}
}

// first exploration
{
	let queue: Cell [] = [ start ]

	let cell
	while (cell = queue.shift()) {
		const currentPath = cell.path as Path
		for (const dir of cell.canReach) {
			const neighbor = getCell(cell, dir)
			if (neighbor && neighbor.path === null) {
				neighbor.path = {
					distance: currentPath.distance + 1,
					direction: dir ^ 2,
				}
				queue.push(neighbor)
			}
		}
	}
}

function propagateChangePath(cell: Cell) {
	const currentPath = cell.path as Path
	for (const dir of cell.reachMe) {
		const neighbor = getCell(cell, dir)
		if (neighbor?.path?.direction !== undefined && neighbor.path.direction === (dir ^ 2)) {
			neighbor.path.distance = currentPath.distance + 1
		}
	}
}

// optimize
let changed
do {
	changed = false
	for (const row of grid) {
		for (const cell of row) {
			if (cell.path) {
				for (let dir of cell.canReach) {
					const neighbor = getCell(cell, dir)
					if (neighbor?.path && neighbor.path.distance > cell.path.distance + 1) {
						neighbor.path.direction = dir ^ 2
						neighbor.path.distance = cell.path.distance + 1
						propagateChangePath(neighbor)
						changed = true
					}
				}
			}
		}
	}
} while (changed)

// {
// 	const fullPath:Map<string, Direction> = new Map()

// 	{
// 		let breadcrumb = end
// 		while (breadcrumb !== start) {
// 			const currentPath = breadcrumb.path as Path
// 			breadcrumb = getCell(breadcrumb, currentPath.direction) as Cell
// 			fullPath.set(`${breadcrumb.x}.${breadcrumb.y}`, currentPath.direction ^ 2)
// 		}
// 	}

// 	console.log(
// 		grid.map(row => {
// 			return row.map(cell => {
// 				const dir = fullPath.get(`${cell.x}.${cell.y}`)
// 				if (dir !== undefined) {
// 					return '<^>V'[dir]
// 				}
// 				return String.fromCharCode('a'.charCodeAt(0) + cell.height)
// 			}).join('')
// 		}).join('\n')
// 	)
// }

console.log(end.path?.distance);
