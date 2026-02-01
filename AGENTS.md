# Apprenticeship Map - Session Handoff

## Project Status: Implementation Complete

All 23 of 24 implementation tasks are complete. The application builds successfully and is ready for deployment.

## Remaining Task: Deploy to GitHub Pages

### Step 1: Create GitHub Repository

```bash
cd "/Users/urschalupnygrunder/Desktop/1 - AI Stuff/apprenticeship-map"

# Option A: Using GitHub CLI (requires gh auth login first)
gh repo create apprenticeship-map --public --source=. --push

# Option B: Manual
# 1. Create repo at github.com
# 2. git remote add origin git@github.com:USERNAME/apprenticeship-map.git
# 3. git push -u origin main
```

### Step 2: Deploy to GitHub Pages

```bash
npm run deploy
```

This runs `npm run build` then pushes the `dist/` folder to the `gh-pages` branch.

### Step 3: Enable GitHub Pages

1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` / `root`
4. Save

### Step 4: Update Homepage URL

Edit `package.json` and replace `yourusername` with your actual GitHub username:

```json
"homepage": "https://YOURUSERNAME.github.io/apprenticeship-map"
```

Then rebuild and redeploy:
```bash
npm run deploy
```

### Step 5: Verify Deployment

```bash
gh browse
# Or visit: https://YOURUSERNAME.github.io/apprenticeship-map/
```

---

## Important Notes

### Transit Data Expiration

The GTFS data (`gtfs_fp2025.zip`) is valid from 2024-12-15 to 2025-12-18. The binary files were generated for date 2025-03-15. For accurate 2026 routing:

1. Download new GTFS data from https://data.opentransportdata.swiss
2. Regenerate binary files:
   ```bash
   npx minotor parse-gtfs scripts/NEW_GTFS.zip --output public/data -d 2026-03-15
   ```

### Binary Files Not in Git

The following large files are in `.gitignore` and must be generated locally or hosted separately:
- `public/data/timetable.bin` (34 MB)
- `public/data/stops.bin` (4.8 MB)
- `scripts/gtfs_fp2025.zip` (322 MB)

For deployment, these files need to be in `public/data/` before running `npm run build`.

### Local Development

```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

### Build

```bash
npm run build
# Output in dist/
```

---

## Completed Tasks Summary

| Phase | Tasks |
|-------|-------|
| Data Preparation | 1-6: Directory structure, geocoding script, run geocoding, GTFS download, transit build script, React init |
| Core Application | 7-19: Types, services (geocoding, routing, reachability), components (search, slider, cards, map, results), hooks, main app, cleanup |
| Build & Test | 20-21: Build transit data, test local dev |
| Deployment | 22, 24: Configure GH Pages, README |
| **Pending** | 23: Deploy to GitHub Pages |

## Key Files

```
apprenticeship-map/
├── src/
│   ├── components/     # React components
│   ├── hooks/          # useApprenticeships, useReachability
│   ├── services/       # geocoding, routing, reachability
│   ├── workers/        # routerWorker (minotor web worker)
│   ├── types/          # TypeScript interfaces
│   └── App.tsx         # Main application
├── public/data/
│   ├── apprenticeships.json  # 467 geocoded positions
│   ├── timetable.bin         # minotor timetable (34MB)
│   └── stops.bin             # minotor stops index (4.8MB)
├── scripts/
│   ├── geocode.py            # Geocoding script (run from scraper dir)
│   ├── build-transit.js      # GTFS → minotor binary
│   └── gtfs_fp2025.zip       # Swiss GTFS data (322MB)
└── package.json
```

## Related Project

The scraper that generates apprenticeship data is at:
`/Users/urschalupnygrunder/Desktop/1 - AI Stuff/28 - ECG DocCheck`

To refresh apprenticeship data:
```bash
cd "/Users/urschalupnygrunder/Desktop/1 - AI Stuff/28 - ECG DocCheck"
./venv/bin/python scrape_apprenticeships_full.py --canton NE
./venv/bin/python scripts/geocode.py
```
