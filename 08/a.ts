
import { readFile } from 'node:fs/promises'


const input = (await readFile('./input.txt')).toString()
const heightGrid = input.split('\n').filter(line => line.length).map(line => line.split('').map(cell => +cell))

const maxY = heightGrid.length - 1
const maxX = heightGrid[0].length - 1

const visibleGrid = heightGrid.map((line, y) => line.map((height, x) => {
	if (x === 0 || x === maxX || y === 0 || y === maxY) {
		return true
	}
	return (
		line.every((otherHeight, i) => i <= x || otherHeight < height) ||
		line.every((otherHeight, i) => i >= x || otherHeight < height) ||
		heightGrid.every((otherLine, i) => i <= y || otherLine[x] < height) ||
		heightGrid.every((otherLine, i) => i >= y || otherLine[x] < height)
	)
}))

console.log(visibleGrid.reduce((acc, line) => acc + line.reduce((acc, cell) => acc + +cell, 0), 0))
