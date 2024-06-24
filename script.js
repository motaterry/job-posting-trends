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
        var jobRole = document.getElementById('jobRoleDisplay').value;
        var errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'none'; // Hide error message before new request

        // Fetch data from the CSV file
        d3.csv("job_posts.csv").then(function(data) {
            // Filter and format the data based on the selected timeframe
            var filteredData = filterDataByTimeframe(data, timeframe);

            var labels = filteredData.map(d => new Date(d.date_posted));
            var values = filteredData.map(d => d.number_of_posts);

            jobTrendChart.data.labels = labels;
            jobTrendChart.data.datasets[0].data = values;
            jobTrendChart.update();
        }).catch(function(error) {
            errorMessage.textContent = "Error fetching data: " + error.message;
            errorMessage.style.display = 'block';
        });
    }

    function filterDataByTimeframe(data, timeframe) {
        var now = new Date();
        var filteredData;

        switch(timeframe) {
            case '10years':
                var tenYearsAgo = new Date(now.setFullYear(now.getFullYear() - 10));
                filteredData = data.filter(d => new Date(d.date_posted) >= tenYearsAgo);
                break;
            case '5years':
                var fiveYearsAgo = new Date(now.setFullYear(now.getFullYear() - 5));
                filteredData = data.filter(d => new Date(d.date_posted) >= fiveYearsAgo);
                break;
            case '1year':
                var oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
                filteredData = data.filter(d => new Date(d.date_posted) >= oneYearAgo);
                break;
            case '6months':
                var sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
                filteredData = data.filter(d => new Date(d.date_posted) >= sixMonthsAgo);
                break;
            case '3months':
                var threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
                filteredData = data.filter(d => new Date(d.date_posted) >= threeMonthsAgo);
                break;
            case '30days':
                var thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
                filteredData = data.filter(d => new Date(d.date_posted) >= thirtyDaysAgo);
                break;
        }

        return filteredData;
    }
});
