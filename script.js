document.addEventListener('DOMContentLoaded', () => {
    const jobRoleInput = document.getElementById('jobRole');
    const jobTrendChart = document.getElementById('jobTrendChart').getContext('2d');
    const timeframeButtons = document.querySelectorAll('#timeframe-buttons button');
    const errorMessage = document.getElementById('error-message');
    const jobTitleVariants = document.getElementById('job-title-variants');
    const variantChips = document.getElementById('variant-chips');
    const insightSection = document.getElementById('insight-section');
    const insightContent = document.getElementById('insight-content');

    function showDataScreen() {
        document.getElementById('home-screen').classList.remove('active');
        document.getElementById('data-screen').classList.add('active');
        updateChart('1year');
    }

    async function updateChart(timeframe) {
        const jobRole = jobRoleInput.value;
        try {
            const response = await fetch(`YOUR_API_ENDPOINT?jobRole=${jobRole}&timeframe=${timeframe}`);
            const data = await response.json();

            if (data.error) {
                errorMessage.textContent = data.error;
                errorMessage.style.display = 'block';
                return;
            }

            errorMessage.style.display = 'none';

            // Update Chart
            const chartData = data.chartData;
            new Chart(jobTrendChart, {
                type: 'line',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: 'Number of Job Posts',
                        data: chartData.values,
                        borderColor: '#561EFF',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1
                    }]
                },
                options: {
                    scales: {
                        x: { type: 'time' },
                        y: { beginAtZero: true }
                    }
                }
            });

            // Update Job Title Variants
            if (data.variants && data.variants.length) {
                jobTitleVariants.style.display = 'block';
                variantChips.innerHTML = '';
                data.variants.forEach(variant => {
                    const chip = document.createElement('div');
                    chip.className = 'variant-chip';
                    chip.textContent = variant;
                    variantChips.appendChild(chip);
                });
            } else {
                jobTitleVariants.style.display = 'none';
            }

            // Update Insights
            if (data.insight) {
                insightSection.style.display = 'block';
                insightContent.textContent = data.insight;
            } else {
                insightSection.style.display = 'none';
            }

            // Update Active Tab
            timeframeButtons.forEach(button => {
                if (button.textContent.includes(timeframe)) {
                    button.style.backgroundColor = '#561EFF';
                } else {
                    button.style.backgroundColor = '';
                }
            });

        } catch (error) {
            errorMessage.textContent = 'Error fetching data';
            errorMessage.style.display = 'block';
        }
    }

    timeframeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const timeframe = button.textContent.toLowerCase().replace(' ', '');
            updateChart(timeframe);
        });
    });
});
