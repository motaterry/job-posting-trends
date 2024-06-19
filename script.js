document.getElementById('fetchButton').addEventListener('click', updateChart);

async function updateChart() {
    const jobTitle = document.getElementById('jobTitle').value;
    const response = await fetch(`job_posts.csv`);
    const data = await response.text();
    const parsedData = Papa.parse(data, { header: true }).data;

    const filteredData = parsedData.filter(post => post.title.includes(jobTitle));

    const jobTitles = [...new Set(filteredData.map(post => post.title))];
    const popularJobTitlesContainer = document.getElementById('popular-job-titles');
    popularJobTitlesContainer.innerHTML = `<p>Here are the most popular Job Title Variations Included in this result:</p>` + jobTitles.map(title => `<button>${title}</button>`).join('');

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
                        unit: 'year'
                    }
                },
                y: {
                    beginAtZero: true
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
}
