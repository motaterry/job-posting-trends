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

    async function fetchJobPosts(jobTitle, timeframe) {
        try {
            const response = await fetch(`YOUR_API_URL?job_title=${jobTitle}&timeframe=${timeframe}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    }

    async function updateChart(timeframe) {
        const jobRole = jobRoleInput.value;
        const data = await fetchJobPosts(jobRole, timeframe);

        if (data) {
            // Update the chart with the data
            // Assume data contains arrays of dates and job counts
            const labels = data.map(item => item.date);
            const jobCounts = data.map(item => item.count);

            // If you are using Chart.js
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
            jobTitleVariants.innerHTML = data.variants.map(variant => `<div class="variant-chip">${variant}</div>`).join('');
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
