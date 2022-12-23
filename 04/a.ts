
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

function isLeftOverlappingRight(left: Range, right: Range) {
	return left.start <= right.start && left.end >= right.end
}

function hasFullOverlap(line: string): boolean {
	const [ first, second ] = parseRangeCouple(line)

	return isLeftOverlappingRight(first, second) || isLeftOverlappingRight(second, first)
}


const input = (await readFile('./input.txt')).toString()
const lines = input.split('\n').filter(line => line.length)
const numberOfLinesWithFullOverlap = lines.reduce((acc, line) => acc + +hasFullOverlap(line), 0)

console.log(numberOfLinesWithFullOverlap)
