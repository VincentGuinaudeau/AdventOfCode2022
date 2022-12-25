
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

const markerA:Signal = [[2]]
const markerB:Signal = [[6]]

const input = (await readFile('./input.txt')).toString()
const packets = input.split('\n').filter(e => e.length).map(parseBlob).concat([markerA, markerB])

packets.sort((left, right) => comparePair(left, right) ? -1 : 1)

console.log(( packets.findIndex(e => e === markerA) + 1 ) * ( packets.findIndex(e => e === markerB) + 1 ));
