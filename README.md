# Carte des Apprentissages Suisses

Interactive map showing Swiss apprenticeship positions reachable by public transport.

## Features

- Search any Swiss address
- See apprenticeships reachable within your travel time budget
- Uses real Swiss public transport timetables
- Client-side routing (no server needed)

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Data Sources

- Map tiles: [geo.admin.ch](https://geo.admin.ch)
- Transit data: [opentransportdata.swiss](https://opentransportdata.swiss)
- Apprenticeships: [orientation.ch](https://orientation.ch)

## Tech Stack

- React + TypeScript + Vite
- Leaflet + react-leaflet
- minotor (RAPTOR algorithm)
- Turf.js

## License

MIT
