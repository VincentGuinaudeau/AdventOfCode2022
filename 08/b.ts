
import { readFile } from 'node:fs/promises'


const input = (await readFile('./input.txt')).toString()
const heightGrid = input.split('\n').filter(line => line.length).map(line => line.split('').map(cell => +cell))

const maxY = heightGrid.length - 1
const maxX = heightGrid[0].length - 1

const viewDistanceGrid = Array(maxY + 1).fill(null).map(_ => Array(maxX + 1).fill(null).map(_ => ({ left: 0, top: 0, right: 0, bottom: 0 })))

for (let x = 0; x < maxX; x++) {
	for (let y = 0; y < maxX; y++) {
		for (let xDescending = x - 1; xDescending >= 0; xDescending--) {
			viewDistanceGrid[y][x].left++
			if (heightGrid[y][xDescending] >= heightGrid[y][x]) break
		}
		for (let yDescending = y - 1; yDescending >= 0; yDescending--) {
			viewDistanceGrid[y][x].top++
			if (heightGrid[yDescending][x] >= heightGrid[y][x]) break
		}
		for (let xAscending = x + 1; xAscending <= maxX; xAscending++) {
			viewDistanceGrid[y][x].right++
			if (heightGrid[y][xAscending] >= heightGrid[y][x]) break
		}
		for (let yAscending = y + 1; yAscending <= maxY; yAscending++) {
			viewDistanceGrid[y][x].bottom++
			if (heightGrid[yAscending][x] >= heightGrid[y][x]) break
		}
	}
}

const viewDistanceProducts = viewDistanceGrid.flatMap(line => line.map(cell => cell.left * cell.top * cell.right * cell.bottom))

const bestViewDistanceProduct = viewDistanceProducts.reduce((a, b) => Math.max(a, b))

console.log(bestViewDistanceProduct)
