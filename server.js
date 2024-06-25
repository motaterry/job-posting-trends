import express from 'express';
import fetch from 'node-fetch';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Serve the main HTML file for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/job-posts', async (req, res) => {
    const { jobTitle, timeframe } = req.query;
    const appId = '6b5d580a';
    const appKey = 'e8825cea476a7c35f4ec84faf82cdbfc';
    const apiUrl = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=50&what=${jobTitle}&where=USA&max_days_old=${timeframe}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
