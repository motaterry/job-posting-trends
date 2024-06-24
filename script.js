document.addEventListener('DOMContentLoaded', () => {
    const homeScreen = document.getElementById('home-screen');
    const dataScreen = document.getElementById('data-screen');
    const jobRoleInput = document.getElementById('jobRole');
    const jobRoleDisplay = document.getElementById('jobRoleDisplay');
    const jobVariantsDiv = document.getElementById('job-variants');
    const errorMessage = document.getElementById('error-message');

    async function fetchJobData(jobRole, timeframe) {
        try {
            const response = await fetch(`YOUR_API_ENDPOINT?role=${jobRole}&timeframe=${timeframe}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching job data:', error);
            errorMessage.textContent = 'Failed to fetch data. Please try again later.';
            errorMessage.style.display = 'block';
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
        const data = await fetchJobData(jobRole, timeframe);

        if (data) {
            // Update job variants
            const jobVariants = data.variants.slice(0, 10);
            jobVariantsDiv.innerHTML = jobVariants.map(variant => `<div class="chip">${variant}</div>`).join('');
            if (data.variants.length > 10) {
                jobVariantsDiv.innerHTML += '<button onclick="showMoreVariants()">Show more</button>';
            }

            // Update chart
            const ctx = document.getElementById('jobTrendChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.trend.map(item => item.date),
                    datasets: [{
                        label: 'Number of Job Posts',
                        data: data.trend.map(item => item.count),
                        borderColor: '#561EFF',
                        fill: false,
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'month'
                            }
                        }
                    }
                }
            });
        }
    }

    function showMoreVariants() {
        const jobRole = jobRoleInput.value;
        const timeframe = '1year';
        fetchJobData(jobRole, timeframe).then(data => {
            const jobVariants = data.variants;
            jobVariantsDiv.innerHTML = jobVariants.map(variant => `<div class="chip">${variant}</div>`).join('');
            jobVariantsDiv.innerHTML += '<button onclick="showLessVariants()">Show less</button>';
        });
    }

    function showLessVariants() {
        updateChart('1year');
    }

    document.querySelector('form').addEventListener('submit', showDataScreen);

    document.querySelectorAll('#timeframe-buttons button').forEach(button => {
        button.addEventListener('click', () => {
            const timeframe = button.textContent.toLowerCase().replace(' ', '');
            updateChart(timeframe);
        });
    });
});
