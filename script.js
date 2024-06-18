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
        fetch(`https://jobs.github.com/positions.json?description=${jobTitle}`)
            .then(response => response.json())
            .then(data => {
                var jobCounts = {};
                data.forEach(job => {
                    var date = new Date(job.created_at);
                    var month = date.getFullYear() + '-' + (date.getMonth() + 1);
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
            });
    }
});
