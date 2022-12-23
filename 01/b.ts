
import { readFile } from 'node:fs/promises'

const str = (await readFile('./input.txt')).toString()
const sums = str.split('\n').reduce((acc: number[], e) => { e === '' ? acc.push(0) : (acc[acc.length -1] += +e); return acc }, [])

const a = sums.reduce((a, b) => Math.max(a, b))
sums.splice(sums.findIndex(e => e === a), 1)

const b = sums.reduce((a, b) => Math.max(a, b))
sums.splice(sums.findIndex(e => e === b), 1)

const c = sums.reduce((a, b) => Math.max(a, b))
console.log(a + b + c)
