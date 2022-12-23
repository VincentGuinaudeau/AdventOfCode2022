
import { readFile } from 'node:fs/promises'


const parent: unique symbol = Symbol('parent')
const size: unique symbol = Symbol('size')

interface Dir extends Record<string, number | Dir> {
	[parent]: Dir | null,
	[size]: number,
}

function makeDir(parentDir: Dir | null = null): Dir {
	return {
		[parent]: parentDir,
		[size]: 0,
	}
}

const fs = makeDir()
let cwd = fs


function moveUp() {
	if (!cwd[parent]) return
	cwd = cwd[parent]
}

function moveDown(name: string) {
	if (!(name in cwd)) {
		cwd[name] = makeDir(cwd)
	}
	const element = cwd[name];
	if (typeof element === 'object') {
		cwd = element
	}
}

function parseInstruction(line: string) {
	if (line === 'ls') {
		return
	}
	else if (line === '$ cd /') {
		cwd = fs
	}
	else if (line === '$ cd ..') {
		moveUp()
	}
	else if (line.startsWith('$ cd ')) {
		moveDown(line.slice('$ cd '.length))
	}
	else if (line.startsWith('dir ')) {
		cwd[line.slice('dir '.length)] = makeDir(cwd)
	}
	else {
		const [,size, name] = /^(\d+) (.+)$/.exec(line) ?? ['0', '']
		cwd[name] = +size
	}
}

const input = (await readFile('./input.txt')).toString()
input.split('\n').filter(line => line.length).forEach(parseInstruction)


function computeSize(dir: Dir) {
	for (const entry of Object.values(dir)) {
		if (typeof entry === 'object') {
			computeSize(entry)
			dir[size] += entry[size]
		}
		else {
			dir[size] += entry
		}
	}
}

computeSize(fs)

const SIZE_THRESHOLD = 100000
let sumOfSmallDirSizes = 0

function sumSmallSizes(dir: Dir) {
	if (dir[size] <= SIZE_THRESHOLD) {
		sumOfSmallDirSizes += dir[size]
	}
	for (const entry of Object.values(dir)) {
		if (typeof entry === 'object') {
			sumSmallSizes(entry)
		}
	}
}

sumSmallSizes(fs)

console.log(sumOfSmallDirSizes)
