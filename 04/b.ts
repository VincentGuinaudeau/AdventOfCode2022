
import { readFile } from 'node:fs/promises'


interface Range {
	start: number,
	end: number,
}

function parseRange(str: string): Range {
	const [ start, end ] = str.split('-').map(str => +str)
	return { start, end }
}

function parseRangeCouple(line: string): [Range, Range] {
	return line.split(',').map(parseRange) as [Range, Range]
}

function hasOverlap(line: string): boolean {
	const [ first, second ] = parseRangeCouple(line)

	return first.end >= second.start && second.end >= first.start
}

const input = (await readFile('./input.txt')).toString()
const lines = input.split('\n').filter(line => line.length)
const numberOfLinesWithOverlap = lines.reduce((acc, line) => acc + +hasOverlap(line), 0)

console.log(numberOfLinesWithOverlap)
