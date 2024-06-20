document.getElementById('fetchButton').addEventListener('click', updateChart);

async function updateChart(timeframe = '1year') {
    const jobTitle = document.getElementById('jobTitle').value;
    const response = await fetch(`job_posts.csv`);
    const data = await response.text();
    const parsedData = Papa.parse(data, { header: true }).data;

    // Filter data by job title
    const filteredData = parsedData.filter(post => post.title.includes(jobTitle));

    if (filteredData.length === 0) {
        document.getElementById('error-message').textContent = 'No results found';
        document.getElementById('error-message').style.display = 'block';
        return;
    }

    document.getElementById('error-message').style.display = 'none';

    // Display Job Title Variants Section
    const jobTitles = [...new Set(filteredData.map(post => post.title))];
    const popularJobTitlesContainer = document.getElementById('popular-job-titles');
    popularJobTitlesContainer.innerHTML = `<p>Here are the most popular Job Title Variations Included in this result:</p>` + jobTitles.slice(0, 10).map(title => `<button>${title}</button>`).join('');
    if (jobTitles.length > 10) {
        popularJobTitlesContainer.innerHTML += `<button id="show-more">Show more</button>`;
        popularJobTitlesContainer.innerHTML += `<button id="show-less" style="display: none;">Show less</button>`;
        
        document.getElementById('show-more').addEventListener('click', () => {
            popularJobTitlesContainer.innerHTML = `<p>Here are the most popular Job Title Variations Included in this result:</p>` + jobTitles.map(title => `<button>${title}</button>`).join('');
            document.getElementById('show-more').style.display = 'none';
            document.getElementById('show-less').style.display = 'block';
        });
        
        document.getElementById('show-less').addEventListener('click', () => {
            popularJobTitlesContainer.innerHTML = `<p>Here are the most popular Job Title Variations Included in this result:</p>` + jobTitles.slice(0, 10).map(title => `<button>${title}</button>`).join('');
            document.getElementById('show-more').style.display = 'block';
            document.getElementById('show-less').style.display = 'none';
        });
    }

    // Display Graph Section
    const chartData = filteredData.map(post => ({
        x: new Date(post.date_posted),
        y: 1
    }));

    const ctx = document.getElementById('jobTrendChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Number of Job Posts',
                data: chartData,
                borderColor: '#561EFF',
                backgroundColor: '#561EFF',
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: timeframe
                    },
                    grid: {
                        color: '#444'
                    },
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#444'
                    },
                    title: {
                        display: true,
                        text: 'Number of Job Posts'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Date: ${context.label}, ${context.raw.y} job posts`;
                        }
                    }
                }
            }
        }
    });

    // Update active tab background color
    document.querySelectorAll('#timeframe-buttons button').forEach(button => {
        button.style.backgroundColor = button.textContent.includes(timeframe) ? '#561EFF' : '#444';
    });

    // Display Insight Section
    document.getElementById('insight-section').innerHTML = `<p>Based on current trends, it's recommended to focus on...</p>`;
    document.getElementById('insight-section').style.display = 'block';
}
