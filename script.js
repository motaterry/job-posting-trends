function showDataScreen() {
    var jobRole = document.getElementById('jobRole').value;
    document.getElementById('jobRoleDisplay').value = jobRole;

    document.getElementById('home-screen').classList.remove('active');
    document.getElementById('data-screen').classList.add('active');

    updateChart('1year'); // Default to past year
}

document.addEventListener("DOMContentLoaded", function() {
    var ctx = document.getElementById('jobTrendChart').getContext('2d');
    var jobTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // This will be updated dynamically
            datasets: [{
                label: 'Number of Job Posts',
                data: [], // This will be updated dynamically
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
                tension: 0.1
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
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Job Posts'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Date: ${context.label}, ${context.raw} job posts`;
                        }
                    }
                }
            }
        }
    });

    window.updateChart = function(timeframe) {
        // Fetch data and update chart based on timeframe
        var jobRole = document.getElementById('jobRoleDisplay').value;
        var errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'none'; // Hide error message before new request

        // Here we should replace this with a real data fetching logic
        var data = generateMockData(timeframe); // Mock data for demonstration purposes

        jobTrendChart.data.labels = data.labels;
        jobTrendChart.data.datasets[0].data = data.values;
        jobTrendChart.update();
    }

    function generateMockData(timeframe) {
        // Generate mock data based on the timeframe
        var now = new Date();
        var labels = [];
        var values = [];
        var startDate;

        switch(timeframe) {
            case '10years':
                startDate = new Date(now.setFullYear(now.getFullYear() - 10));
                break;
            case '5years':
                startDate = new Date(now.setFullYear(now.getFullYear() - 5));
                break;
            case '1year':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            case '6months':
                startDate = new Date(now.setMonth(now.getMonth() - 6));
                break;
            case '3months':
                startDate = new Date(now.setMonth(now.getMonth() - 3));
                break;
            case '30days':
                startDate = new Date(now.setDate(now.getDate() - 30));
                break;
        }

        while (startDate <= now) {
            labels.push(new Date(startDate));
            values.push(Math.floor(Math.random() * 1000)); // Random values for demonstration
            startDate.setMonth(startDate.getMonth() + 1);
        }

        return { labels: labels, values: values };
    }
});
