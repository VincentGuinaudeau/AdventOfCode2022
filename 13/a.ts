
import { readFile } from 'node:fs/promises'

type Signal = Array<Signal | number>

function parseBlob(line: string): Signal {
	return eval(line)
}

function comparePair(left: Signal, right: Signal): boolean {
	const stack: { left: Signal, right: Signal, index: number } [] = [ { left, right, index: 0 } ]

	while (stack.length) {
		const stackElem = stack[stack.length - 1]
		const {left, right, index} = stackElem
		const leftElem = left[index]
		const rightElem = right[index]

		if (leftElem === undefined && rightElem === undefined) {
			stack.pop()
			continue
		}
		else if (leftElem === undefined || rightElem === undefined) {
			return leftElem === undefined
		}

		if (typeof leftElem === 'number' && typeof rightElem === 'number') {
			if (leftElem !== rightElem) {
				return leftElem < rightElem
			}
		}
		else if (typeof leftElem === 'object' && typeof rightElem === 'object') {
			stack.push({ left: leftElem, right: rightElem, index: 0 })
		}
		else {
			stack.push({
				left: typeof leftElem === 'number' ? [ leftElem ]: leftElem,
				right: typeof rightElem === 'number' ? [ rightElem ]: rightElem,
				index: 0
			})
		}

		stackElem.index++
	}

	return true
}

const input = (await readFile('./input.txt')).toString()
const blobs = input.split('\n\n').filter(e => e.length)

let result = 0

for (let [index, blob] of blobs.entries()) {
	const [left, right] = blob.split('\n').map(parseBlob)

	if (comparePair(left, right)) {
		result += index + 1
	}
}

console.log(result);
