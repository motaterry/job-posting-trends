document.addEventListener("DOMContentLoaded", () => {
    const jobRoleInput = document.getElementById("jobRoleDisplay");
    const jobTitleVariants = document.getElementById("jobTitleVariants");
    const variantsContainer = document.getElementById("variantsContainer");
    const jobTrendChart = document.getElementById("jobTrendChart");
    const errorMessage = document.getElementById("error-message");
    const insightSection = document.getElementById("insightSection");
    const insights = document.getElementById("insights");
    const timeframeButtons = document.querySelectorAll("#timeframe-buttons button");

    let chart;

    async function fetchJobPosts(jobTitle, timeframe) {
        const appId = '6b5d580a'; // Replace with your Adzuna App ID
        const appKey = 'e8825cea476a7c35f4ec84faf82cdbfc'; // Replace with your Adzuna App Key
        const url = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=50&what=${jobTitle}`;
        const response = await fetch(url);

        if (!response.ok) {
            errorMessage.textContent = "Failed to retrieve data";
            errorMessage.style.display = "block";
            return null;
        }

        const data = await response.json();
        return data.results;
    }

    async function updateChart(timeframe) {
        if (!jobRoleInput.value) {
            errorMessage.textContent = "Please enter a job role";
            errorMessage.style.display = "block";
            return;
        }

        errorMessage.style.display = "none";
        const jobPosts = await fetchJobPosts(jobRoleInput.value, timeframe);

        if (!jobPosts || jobPosts.length === 0) {
            errorMessage.textContent = "No job posts found";
            errorMessage.style.display = "block";
            return;
        }

        const dates = jobPosts.map(job => new Date(job.created));
        const counts = jobPosts.map(() => 1);

        const ctx = jobTrendChart.getContext("2d");

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Number of Job Posts',
                    data: counts,
                    borderColor: '#561EFF',
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
                        title: {
                            display: true,
                            text: 'Number of Job Posts'
                        }
                    }
                }
            }
        });

        jobTitleVariants.style.display = "block";
        const uniqueJobTitles = [...new Set(jobPosts.map(job => job.title))];
        variantsContainer.innerHTML = uniqueJobTitles.slice(0, 10).map(title => `<div class="variant">${title}</div>`).join("");
        if (uniqueJobTitles.length > 10) {
            variantsContainer.innerHTML += `<button onclick="showMoreVariants()">Show more</button>`;
        }

        insightSection.style.display = "block";
        insights.textContent = "Some insightful data about the job market.";
    }

    function showMoreVariants() {
        const allJobTitles = [...new Set(jobPosts.map(job => job.title))];
        variantsContainer.innerHTML = allJobTitles.map(title => `<div class="variant">${title}</div>`).join("");
        variantsContainer.innerHTML += `<button onclick="showLessVariants()">Show less</button>`;
    }

    function showLessVariants() {
        const uniqueJobTitles = [...new Set(jobPosts.map(job => job.title))];
        variantsContainer.innerHTML = uniqueJobTitles.slice(0, 10).map(title => `<div class="variant">${title}</div>`).join("");
        if (uniqueJobTitles.length > 10) {
            variantsContainer.innerHTML += `<button onclick="showMoreVariants()">Show more</button>`;
       
