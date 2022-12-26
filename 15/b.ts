
import { readFile } from 'node:fs/promises'

interface Vec {
	x: number,
	y: number,
}

interface Sensor extends Vec {
	beacon: Vec,
	clear_radius: number,
}

interface Range {
	start: number,
	stop: number,
}

function compareRange(a: Range, b: Range) {
	if (a.start !== b.start) {
		return a.start - b.start
	}
	return a.stop - b.stop
}

function simplify_ranges(ranges: Range []) {
	ranges.sort(compareRange)

	for (let i = 0; i < ranges.length; i++) {
		const range = ranges[i]
		let toMerge  = 1
		let current_stop = range.stop

		while ((ranges[i + toMerge]?.start ?? Infinity) <= current_stop + 1) {
			const range = ranges[i + toMerge]
			current_stop = Math.max(current_stop, range.stop)

			toMerge++
		}

		if (toMerge > 1) {
			const range = ranges[i]
			ranges.splice( i, toMerge, { start: range.start, stop: current_stop })
		}
	}
}

const input = (await readFile('./input.txt')).toString()
const lines = input.split('\n').filter(e => e.length)

// Sensor at x=2300471, y=2016823: closest beacon is at x=2687171, y=2822745

const beacons: Vec [] = []

const sensors: Sensor [] = lines.map(line => {
	const x = +(/Sensor at x=(-?\d+)/.exec(line)?.[1] as string)
	const y = +(/Sensor at x=-?\d+, y=(-?\d+)/.exec(line)?.[1] as string)
	const beaconX = +(/is at x=(-?\d+)/.exec(line)?.[1] as string)
	const beaconY = +(/is at x=-?\d+, y=(-?\d+)/.exec(line)?.[1] as string)

	let beacon = beacons.find(beacon => beacon.x === beaconX && beacon.y === beaconY)

	if (!beacon) {
		beacon = {
			x: beaconX,
			y: beaconY,
		}
		beacons.push(beacon)
	}

	const clear_radius = Math.abs(x - beacon.x) + Math.abs(y - beacon.y)

	return {
		x,
		y,
		beacon,
		clear_radius
	}
})

const BOUNDING_RANGE:Range = { start: 0, stop: 4000000 }

for (let row = BOUNDING_RANGE.start; row <= BOUNDING_RANGE.stop; row++) {

	const cleared_ranges: Range [] = []

	for (let sensor of sensors) {
		const row_reach = sensor.clear_radius - Math.abs(sensor.y - row)

		if (row_reach >= 0) {
			cleared_ranges.push({
				start: sensor.x - row_reach,
				stop: sensor.x + row_reach,
			})
		}
	}

	simplify_ranges(cleared_ranges)

	const relevant_ranges = cleared_ranges.filter(range => range.start <= BOUNDING_RANGE.stop && BOUNDING_RANGE.start <= range.stop)

	if (relevant_ranges.length > 1) {
		console.log((relevant_ranges[0].stop + 1) * BOUNDING_RANGE.stop + row)
	}
}


