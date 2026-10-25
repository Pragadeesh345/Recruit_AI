import os
from dotenv import load_dotenv
from flask import Flask, render_template
import mysql.connector
from mysql.connector import Error
from datetime import datetime
load_dotenv()

app = Flask(__name__)

db_config = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME', 'job_tracker')
}


def get_db_connection():
    try:
        return mysql.connector.connect(**db_config)
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

@app.route('/')
def dashboard():
    conn = get_db_connection()
    jobs_data = []
    total_jobs = 0
    top_source = "Unknown"

    if conn:
        cursor = conn.cursor(dictionary=True)

        # Fetch all jobs (Updated to LEFT JOIN)
        query_jobs = """
            SELECT
                j.role, j.company, j.location,
                e.platform_source, e.final_category, e.email_date
            FROM jobs j
            LEFT JOIN email_events e ON j.message_id = e.message_id
            ORDER BY e.email_date DESC
            LIMIT 50;
        """

        query_source = """
            SELECT platform_source, COUNT(*) as count
            FROM email_events
            WHERE platform_source IS NOT NULL AND platform_source != 'other'
            GROUP BY platform_source
            ORDER BY count DESC
            LIMIT 1;
        """

        try:
            cursor.execute(query_jobs)
            raw_jobs = cursor.fetchall()

            for job in raw_jobs:
                if job['email_date']:
                    if isinstance(job['email_date'], str):
                        try:
                            clean_str = job['email_date'].replace('Z', '+00:00')
                            parsed_date = datetime.fromisoformat(clean_str)
                            job['formatted_date'] = parsed_date.strftime("%B %d, %Y — %I:%M %p")
                        except ValueError:
                            job['formatted_date'] = job['email_date']
                    else:
                        job['formatted_date'] = job['email_date'].strftime("%B %d, %Y — %I:%M %p")
                else:
                    job['formatted_date'] = "Recent"

                jobs_data.append(job)

            total_jobs = len(jobs_data)

            cursor.execute(query_source)
            source_result = cursor.fetchone()
            if source_result:
                top_source = source_result['platform_source'].upper()

        except Error as e:
            print(f"Error executing query: {e}")
        finally:
            cursor.close()
            conn.close()

    return render_template('index.html', jobs=jobs_data, total_jobs=total_jobs, top_source=top_source)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
