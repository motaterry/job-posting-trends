document.addEventListener("DOMContentLoaded", () => {
    const jobRoleInput = document.getElementById('jobRole');
    const jobRoleDisplay = document.getElementById('jobRoleDisplay');
    const homeScreen = document.getElementById('home-screen');
    const dataScreen = document.getElementById('data-screen');
    const jobTitleVariants = document.getElementById('jobTitleVariants');
    const jobTrendChart = document.getElementById('jobTrendChart');
    const timeframeButtons = document.getElementById('timeframe-buttons');

    function showDataScreen() {
        const jobRole = jobRoleInput.value;
        if (!jobRole) return;

        jobRoleDisplay.textContent = jobRole;
        homeScreen.classList.remove('active');
        dataScreen.classList.add('active');

        // Fetch initial data
        updateChart('1year');
    }

    const corsProxies = [
        'https://api.allorigins.win/get?url=',
        'https://cors-anywhere.herokuapp.com/',
        'https://thingproxy.freeboard.io/fetch/'
    ];

    async function fetchJobPosts(jobTitle, timeframe) {
        const appId = '6b5d580a';
        const appKey = 'e8825cea476a7c35f4ec84faf82cdbfc';
        const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=50&what=${jobTitle}&where=USA&max_days_old=${timeframe}`;

        for (let proxy of corsProxies) {
            console.log(`Fetching data from URL: ${proxy}${encodeURIComponent(url)}`);

            try {
                const response = await fetch(`${proxy}${encodeURIComponent(url)}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched data:', data);
                    return proxy === 'https://api.allorigins.win/get?url=' ? JSON.parse(data.contents) : data;
                }
                console.warn(`Proxy failed: ${proxy}`);
            } catch (error) {
                console.error(`Fetch error with proxy ${proxy}:`, error);
            }
        }

        return null;
    }

    async function updateChart(timeframe) {
        const jobRole = jobRoleInput.value;
        const data = await fetchJobPosts(jobRole, timeframe);

        if (data) {
            // Assuming data contains arrays of dates and job counts
            const labels = data.results.map(item => item.created);
            const jobCounts = data.results.map(item => item.count);

            // Update the chart
            const ctx = jobTrendChart.getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Number of Job Posts',
                        data: jobCounts,
                        borderColor: '#561EFF',
                        backgroundColor: 'rgba(86, 30, 255, 0.2)',
                        borderWidth: 2
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'month'
                            },
                            title: {
                                display: true,
                                text: 'Time'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Number of Job Posts'
                            }
                        }
                    }
                }
            });

            // Update job title variants
            jobTitleVariants.innerHTML = data.results.map(variant => `<div class="variant-chip">${variant.title}</div>`).join('');
        } else {
            console.error('No data received');
        }
    }

    // Add event listener for the form submission
    document.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault();
        showDataScreen();
    });

    // Add event listeners for the timeframe buttons
    timeframeButtons.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            updateChart(button.getAttribute('data-timeframe'));
        });
    });
});
