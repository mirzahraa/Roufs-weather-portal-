# Er. Rouf's Weather Portal

A worldwide weather portal with:
- Current temperature and conditions
- 7-day forecast
- Search any location
- Browser GPS / "Use My Location"
- Configurable temperature, rain-probability and wind alarms
- Browser notifications
- Express API endpoints

## Run
1. Install Node.js 18+.
2. In this folder run `npm install`.
3. Run `npm start`.
4. Open `http://localhost:3000`.

## API
`GET /api/geocode?q=Pahalgam`
`GET /api/weather?latitude=34.0167&longitude=75.3150`

Weather data: Open-Meteo. The portal is intended for non-commercial use unless you arrange the appropriate commercial terms.
