document.addEventListener("DOMContentLoaded", function() {
    const jobRoleDisplay = document.getElementById("jobRoleDisplay");
    const jobTrendChart = document.getElementById("jobTrendChart");
    const variantsList = document.getElementById("variants-list");
    const showMoreButton = document.getElementById("showMoreButton");
    const insightSection = document.getElementById("insight-section");
    const insightsContent = document.getElementById("insights-content");

    if (!jobRoleDisplay || !jobTrendChart || !variantsList || !showMoreButton || !insightSection || !insightsContent) {
        console.error("Required elements are not found in the DOM");
        return;
    }

    const ctx = jobTrendChart.getContext('2d');
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Number of Job Posts',
                borderColor: '#561EFF',
                backgroundColor: 'rgba(86, 30, 255, 0.1)',
                data: []
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'month'
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    function updateChart(timeframe) {
        const jobRole = jobRoleDisplay.value;
        if (!jobRole) {
            console.error("Job role input is empty");
            return;
        }

        // Fetch and update the chart data based on the jobRole and timeframe
        fetchJobData(jobRole, timeframe).then(data => {
            chart.data.datasets[0].data = data.chartData;
            chart.update();
            updateVariants(data.variants);
            updateInsights(data.insights);
        }).catch(error => {
            console.error("Error fetching job data:", error);
        });
    }

    async function fetchJobData(jobRole, timeframe) {
        // Your API call logic to fetch job data
    }

    function updateVariants(variants) {
        variantsList.innerHTML = '';
        variants.forEach(variant => {
            let variantElement = document.createElement('div');
            variantElement.textContent = variant;
            variantsList.appendChild(variantElement);
        });
        if (variants.length > 10) {
            showMoreButton.classList.remove('hidden');
        }
        document.getElementById('jobTitleVariants').classList.remove('hidden');
    }

    function toggleVariants() {
        const isExpanded = variantsList.classList.toggle('expanded');
        showMoreButton.textContent = isExpanded ? 'Show less' : 'Show more';
    }

    function updateInsights(insights) {
        insightsContent.textContent = insights;
        insightSection.classList.remove('hidden');
    }

    document.getElementById("searchForm").addEventListener("submit", function(event) {
        event.preventDefault();
        updateChart('1year');
    });

    document.querySelectorAll("#timeframe-buttons button").forEach(button => {
        button.addEventListener("click", function() {
            updateChart(this.textContent);
        });
    });
});
