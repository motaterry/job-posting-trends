document.addEventListener('DOMContentLoaded', () => {
    const homeScreen = document.getElementById('home-screen');
    const dataScreen = document.getElementById('data-screen');
    const jobRoleInput = document.getElementById('jobRole');
    const jobRoleDisplay = document.getElementById('jobRoleDisplay');
    const jobTitleVariants = document.getElementById('jobTitleVariants');
    const jobTrendChart = document.getElementById('jobTrendChart').getContext('2d');
    let chart;

    async function fetchJobPosts(jobTitle, timeframe) {
        const appId = '6b5d580a';
        const appKey = 'e8825cea476a7c35f4ec84faf82cdbfc';
        const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=50&what=${jobTitle}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // Process and return the data in the format required by your application
            return data.results.map(job => ({
                date: job.created,
                count: 1,
                variants: job.title
            }));
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    }

    function showDataScreen() {
        const jobRole = jobRoleInput.value;
        if (!jobRole) return;

        jobRoleDisplay.textContent = jobRole;
        homeScreen.classList.remove('active');
        dataScreen.classList.add('active');

        // Fetch initial data
        updateChart('1year');
    }

    async function updateChart(timeframe) {
        const jobRole = jobRoleInput.value;
        const data = await fetchJobPosts(jobRole, timeframe);

        if (data) {
            const labels = data.map(item => item.date);
            const jobCounts = data.map(item => item.count);

            // Destroy existing chart if it exists
            if (chart) {
                chart.destroy();
            }

            // Create new chart
            chart = new Chart(jobTrendChart, {
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
            jobTitleVariants.innerHTML = data.variants.map(variant => `<div class="variant-chip">${variant}</div>`).join('');
        } else {
            console.error('No data received');
        }
    }

    window.showDataScreen = showDataScreen;
});
