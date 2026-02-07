# Carte des Apprentissages Suisses

An interactive map that helps young people in Switzerland find apprenticeship positions reachable by public transport. Enter your address, set a maximum travel time, and instantly see which apprenticeships you can reach.

**[View the live app](https://theurrien.github.io/apprenticeship_geo/)**

<!-- Uncomment and update paths once screenshots are added:
![Map overview](docs/screenshots/map-overview.png)
![Selected apprenticeship](docs/screenshots/selected-card.png)
-->

## Features

- **Address search** with autocomplete powered by the Swiss federal geoportal
- **Travel time filter** — adjust the slider to see apprenticeships within your commute budget
- **Real timetable routing** — uses actual Swiss public transport schedules, not estimates
- **Bidirectional selection** — click a dot on the map to highlight and scroll to its card, or click a card to pan the map
- **Isochrone visualization** — see the reachable area as a shaded polygon on the map
- **Fully client-side** — no backend server needed, everything runs in your browser

## Services & Data Sources

| Service | Purpose | Link |
|---------|---------|------|
| **orientation.ch** | Apprenticeship listings — scraped with Playwright | [orientation.ch](https://www.orientation.ch) |
| **opentransportdata.swiss** | Swiss GTFS public transport timetables (2026) | [opentransportdata.swiss](https://opentransportdata.swiss) |
| **swisstopo** | High-quality Swiss map tiles | [geo.admin.ch](https://www.geo.admin.ch) |
| **geo.admin.ch API** | Address search and geocoding | [api3.geo.admin.ch](https://api3.geo.admin.ch) |

## Tech Stack

| Technology | Role |
|------------|------|
| **React + TypeScript** | UI framework |
| **Vite** | Build tool and dev server |
| **Leaflet + react-leaflet** | Interactive map rendering |
| **minotor** | Client-side RAPTOR algorithm for public transport routing |
| **Turf.js** | Geospatial calculations (distances, isochrones) |
| **Web Workers** | Offloads heavy routing computation from the main thread |
| **Playwright** | Headless browser scraping of apprenticeship data |

## How It Works

1. User enters a Swiss address
2. The app finds the nearest public transport stop
3. The RAPTOR algorithm computes all reachable stops within the time budget using real timetable data
4. Apprenticeships near reachable stops (within 400m walking distance) are displayed on the map and in a scrollable list
5. Clicking a marker or a card highlights and syncs both views

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### Rebuilding transit data

If you need to update the GTFS timetable data:

```bash
# Download fresh GTFS data from opentransportdata.swiss
# Place the zip in scripts/

# Build binary transit files
node scripts/build-transit.js scripts/gtfs_fp2026_*.zip
```

### Updating apprenticeship data

The scraper lives in a separate repository. After scraping, run the geocoding script to produce `apprenticeships.json`:

```bash
cd ../28\ -\ ECG\ DocCheck
python scripts/geocode.py
```

## License

MIT
