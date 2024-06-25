const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/api/job-posts', async (req, res) => {
    const { jobTitle, timeframe } = req.query;
    const appId = '6b5d580a';
    const appKey = 'e8825cea476a7c35f4ec84faf82cdbfc';
    const apiUrl = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=50&what=${jobTitle}&where=USA&max_days_old=${timeframe}`;

    try {
        const fetch = (await import('node-fetch')).default;
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
