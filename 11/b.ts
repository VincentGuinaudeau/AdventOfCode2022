
import { readFile } from 'node:fs/promises'

interface Item {
	worry: bigint,
}

interface MonkeyParsingInprogress {
	text: string,
	id: string,
	items: Item [],
	operation: (item: Item) => void,
	divideBy: bigint,
	activity: number,
}

interface Monkey extends MonkeyParsingInprogress {
	destinationWhenTrue: Monkey,
	destinationWhenFalse: Monkey,
}

function parseMonkey(text: string): MonkeyParsingInprogress {
	const monkeyNum = /Monkey (\d+)/.exec(text)?.[1]
	const itemsList = /Starting items: ([\d, ]+)\n/.exec(text)?.[1].split(', ').map(e => +e)
	let operationStr = /Operation: ([^\n]+)/.exec(text)?.[1]
	const divideByStr = /divisible by (\d+)/.exec(text)?.[1]


	if (!monkeyNum || !itemsList || !operationStr || !divideByStr) {
		throw new Error('cannot parse monkey')
	}

	operationStr = operationStr.replace(/\d+/, (str) => str + 'n')
	const divideBy = BigInt(divideByStr);

	return {
		text,
		id: monkeyNum,
		items: itemsList.map(num => ({ worry: BigInt(num) })),
		operation: eval(`(item) => { const old = item.worry; const _${operationStr}; item.worry = _new }`),
		divideBy,
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
		const destination = item.worry % monkey.divideBy === 0n ?
			monkey.destinationWhenTrue :
			monkey.destinationWhenFalse

		destination.items.push(item)
	}
}

function simplifyWorries(monkeys: Monkey [], sinplifyFactor: bigint) {
	for (let monkey of monkeys) {
		for (let item of monkey.items) {
			item.worry %= sinplifyFactor;
		}
	}
}

function computeWorrySiplifier(monkeys: Monkey []): bigint {
	return monkeys.reduce((acc, monkey) => acc * monkey.divideBy, 1n)
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
const sinplifyFactor = computeWorrySiplifier(monkeys)

for (let i = 0; i < 10000; i++) {
	doRound(monkeys)
	simplifyWorries(monkeys, sinplifyFactor)
}


monkeys.sort((a, b) => b.activity - a.activity)

console.log(monkeys[0].activity * monkeys[1].activity);
