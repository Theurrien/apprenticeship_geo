#!/usr/bin/env node
/**
 * Parse Swiss GTFS data and generate minotor binary files.
 *
 * Usage: node build-transit.js <gtfs-file.zip>
 * Output: ../public/data/timetable.bin, ../public/data/stops.bin
 */

import { GtfsParser, chGtfsProfile } from 'minotor/parser';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const gtfsPath = process.argv[2];

  if (!gtfsPath) {
    console.error('Usage: node build-transit.js <gtfs-file.zip>');
    process.exit(1);
  }

  const outputDir = join(__dirname, '..', 'public', 'data');
  mkdirSync(outputDir, { recursive: true });

  console.log(`Parsing GTFS from: ${gtfsPath}`);
  console.log('This may take several minutes...\n');

  const parser = new GtfsParser(gtfsPath, chGtfsProfile);
  const { timetable, stopsIndex } = await parser.parse(new Date());

  console.log('\nSerialized data:');

  // Serialize timetable
  const timetableData = timetable.serialize();
  const timetablePath = join(outputDir, 'timetable.bin');
  writeFileSync(timetablePath, Buffer.from(timetableData));
  console.log(`  Timetable: ${timetablePath} (${(timetableData.byteLength / 1024 / 1024).toFixed(1)} MB)`);

  // Serialize stops index
  const stopsData = stopsIndex.serialize();
  const stopsPath = join(outputDir, 'stops.bin');
  writeFileSync(stopsPath, Buffer.from(stopsData));
  console.log(`  Stops: ${stopsPath} (${(stopsData.byteLength / 1024 / 1024).toFixed(1)} MB)`);

  console.log('\nDone! Transit data ready for use.');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
