import requests
from bs4 import BeautifulSoup
import pandas as pd
import datetime
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def fetch_job_posts(job_title, location):
    app_id = os.getenv('ADZUNA_APP_ID')
    app_key = os.getenv('ADZUNA_APP_KEY')
    
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
        job_data.append({
            'title': job.get('title'),
            'company': job.get('company', {}).get('display_name'),
            'location': job.get('location', {}).get('display_name'),
            'date_posted': job.get('created'),
            'scraped_date': datetime.datetime.now().strftime('%Y-%m-%d')
        })

    print(f"Fetched job data: {job_data}")
    return job_data

# Example use
job_posts = fetch_job_posts("UX Designer", "San Francisco, CA")
if job_posts:
    df = pd.DataFrame(job_posts)
    df.to_csv('job_posts.csv', mode='w', index=False)
    print("CSV file has been created successfully.")
else:
    print("No job posts found.")
