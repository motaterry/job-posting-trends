document.addEventListener("DOMContentLoaded", function() {
    var ctx = document.getElementById('jobTrendChart').getContext('2d');
    var jobTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // This will be updated dynamically
            datasets: [{
                label: 'Number of Job Posts',
                data: [], // This will be updated dynamically
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2
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

    window.updateChart = function() {
        var jobTitle = document.getElementById('jobTitle').value;
        var timeframe = document.getElementById('timeframe').value;
        var errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'none'; // Hide error message before new request

        // Calculate the start date based on the selected timeframe
        var endDate = new Date();
        var startDate = new Date();
        switch (timeframe) {
            case '1month':
                startDate.setMonth(endDate.getMonth() - 1);
                break;
            case '3months':
                startDate.setMonth(endDate.getMonth() - 3);
                break;
            case '6months':
                startDate.setMonth(endDate.getMonth() - 6);
                break;
            case '12months':
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
            case '5years':
                startDate.setFullYear(endDate.getFullYear() - 5);
                break;
            case '10years':
                startDate.setFullYear(endDate.getFullYear() - 10);
                break;
        }

        // Format dates to match the GitHub Jobs API expected format
        var startDateStr = startDate.toISOString().split('T')[0];
        var endDateStr = endDate.toISOString().split('T')[0];

        // Using cors-anywhere proxy for testing to handle CORS issues
        var proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        var apiUrl = `https://jobs.github.com/positions.json?description=${jobTitle}`;

        fetch(proxyUrl + apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                var jobCounts = {};
                data.forEach(job => {
                    var date = new Date(job.created_at);
                    if (date >= startDate && date <= endDate) {
                        var month = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0');
                        if (jobCounts[month]) {
                            jobCounts[month]++;
                        } else {
                            jobCounts[month] = 1;
                        }
                    }
                });

                var labels = Object.keys(jobCounts);
                var values = Object.values(jobCounts);

                if (labels.length === 0) {
                    throw new Error('No data available for the selected timeframe and job title.');
                }

                jobTrendChart.data.labels = labels;
                jobTrendChart.data.datasets[0].data = values;
                jobTrendChart.update();

                document.getElementById('grid-container').style.display = 'none';
                document.getElementById('jobTrendChart').style.display = 'block';
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                errorMessage.textContent = 'Error fetching data: ' + error.message;
                errorMessage.style.display = 'block';
            });
    }
});
