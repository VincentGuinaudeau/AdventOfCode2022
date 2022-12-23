
import { readFile } from 'node:fs/promises'

const str = (await readFile('./input.txt')).toString()
const sums = str.split('\n').reduce((acc: number[], e) => { e === '' ? acc.push(0) : (acc[acc.length -1] += +e); return acc }, [])

console.log(sums.reduce((a, b) => Math.max(a, b)))
