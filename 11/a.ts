
import { readFile } from 'node:fs/promises'

interface Item {
	worry: number,
}

interface MonkeyParsingInprogress {
	text: string,
	id: string,
	items: Item [],
	operation: (item: Item) => void,
	test: (item: Item) => boolean,
	activity: number,
}

interface Monkey extends MonkeyParsingInprogress {
	destinationWhenTrue: Monkey,
	destinationWhenFalse: Monkey,
}

function parseMonkey(text: string): MonkeyParsingInprogress {
	const monkeyNum = /Monkey (\d+)/.exec(text)?.[1]
	const itemsList = /Starting items: ([\d, ]+)\n/.exec(text)?.[1].split(', ').map(e => +e)
	const operationStr = /Operation: ([^\n]+)/.exec(text)?.[1]
	const divideByStr = /divisible by (\d+)/.exec(text)?.[1]

	if (!monkeyNum || !itemsList || !operationStr || !divideByStr) {
		throw new Error('cannot parse monkey')
	}

	const divideBy = +divideByStr;

	return {
		text,
		id: monkeyNum,
		items: itemsList.map(num => ({ worry: num })),
		operation: eval(`(item) => { const old = item.worry; const _${operationStr}; item.worry = _new }`),
		test: (item) => item.worry % divideBy === 0,
		activity: 0,
	}
}

function linkMonkeys(monkeys: MonkeyParsingInprogress []): Monkey [] {
	const newMonkeys = monkeys as Monkey [];

	for (const monkey of newMonkeys) {
		const destTrueStr = /If true: throw to monkey (\d+)/.exec(monkey.text)?.[1]
		const destFalseStr = /If false: throw to monkey (\d+)/.exec(monkey.text)?.[1]

		if (!destTrueStr || !destFalseStr) {
			throw new Error('cannot link monkeys')
		}

		monkey.destinationWhenTrue = newMonkeys[+destTrueStr]
		monkey.destinationWhenFalse = newMonkeys[+destFalseStr]
	}

	return newMonkeys
}

function doMonkeyBussiness(monkey: Monkey) {
	let item
	while (item = monkey.items.shift()) {
		monkey.activity++

		monkey.operation(item)
		item.worry = Math.floor(item.worry / 3)

		const destination = monkey.test(item) ? monkey.destinationWhenTrue : monkey.destinationWhenFalse

		destination.items.push(item)
	}
}

function doRound(monkeys: Monkey []) {
	for (let monkey of monkeys) {
		doMonkeyBussiness(monkey)
	}
}

const input = (await readFile('./input.txt')).toString()
const blobs = input.split('\n\n').filter(e => e.length)

const partialMonkeys = blobs.map(blob => parseMonkey(blob))

const monkeys = linkMonkeys(partialMonkeys)

for (let i = 0; i < 20; i++) {
	doRound(monkeys)
}


monkeys.sort((a, b) => b.activity - a.activity)

console.log(monkeys[0].activity * monkeys[1].activity);
