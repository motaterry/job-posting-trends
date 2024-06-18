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
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    window.updateChart = function() {
        var jobTitle = document.getElementById('jobTitle').value;
        var errorMessage = document.getElementById('error-message');
        errorMessage.style.display = 'none'; // Hide error message before new request

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
                    var month = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0');
                    if (jobCounts[month]) {
                        jobCounts[month]++;
                    } else {
                        jobCounts[month] = 1;
                    }
                });

                var labels = Object.keys(jobCounts);
                var values = Object.values(jobCounts);

                jobTrendChart.data.labels = labels;
                jobTrendChart.data.datasets[0].data = values;
                jobTrendChart.update();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                errorMessage.textContent = 'Error fetching data: ' + error.message;
                errorMessage.style.display = 'block';
            });
    }
});
