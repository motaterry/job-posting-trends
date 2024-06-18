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

        // Dummy data for demonstration. Replace this with actual data fetching logic.
        var data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            data: [10, 15, 20, 25, 30, 35]
        };

        jobTrendChart.data.labels = data.labels;
        jobTrendChart.data.datasets[0].data = data.data;
        jobTrendChart.update();
    }
});
