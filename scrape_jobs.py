import requests
import pandas as pd
import datetime

def fetch_job_posts(job_title, location):
    app_id = '6b5d580a'  # Replace with your Adzuna App ID
    app_key = 'e8825cea476a7c35f4ec84faf82cdbfc'  # Replace with your Adzuna App Key

    url = f"https://api.adzuna.com/v1/api/jobs/us/search/1?app_id={app_id}&app_key={app_key}&results_per_page=50&what={job_title}&where={location}"
    response = requests.get(url)
    print(f"Request URL: {url}")
    print(f"Response Status Code: {response.status_code}")
    
    if response.status_code != 200:
        print("Failed to retrieve data")
        return []

    job_data = []
    results = response.json().get('results', [])
    
    for job in results:
        date_posted = job.get('created')
        date_posted = datetime.datetime.strptime(date_posted, '%Y-%m-%dT%H:%M:%SZ').strftime('%Y-%m-%d')  # Format the date

        job_data.append({
            'date_posted': date_posted,
            'number_of_posts': 1  # Each job post is counted as 1
        })

    # Aggregate data by date
    df = pd.DataFrame(job_data)
    aggregated_data = df.groupby('date_posted').size().reset_index(name='number_of_posts')
    
    print(f"Fetched and aggregated job data: {aggregated_data}")
    return aggregated_data

# Example use
job_posts = fetch_job_posts("UX Designer", "San Francisco, CA")
if not job_posts.empty:
    job_posts.to_csv('job_posts.csv', mode='w', index=False)
    print("CSV file has been created successfully.")
else:
    print("No job posts found.")
