# 🤖 RecruitAI — AI-Powered Job Tracking & Recruitment Intelligence

![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python\&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-Web%20Framework-black?logo=flask)
![n8n](https://img.shields.io/badge/n8n-Workflow%20Automation-FF6C37?logo=n8n)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql\&logoColor=white)
![LLM](https://img.shields.io/badge/AI-LLM%20Integration-6C63FF)
![Status](https://img.shields.io/badge/Status-Development-orange)

## 📌 Overview

RecruitAI is an AI-powered job tracking system that automates the processing of recruitment-related emails and organizes extracted job information in a web dashboard.

Job alerts, newsletters, and promotional emails can make it difficult to identify relevant hiring opportunities. RecruitAI addresses this problem by combining **LLM-based email classification, hiring-intent validation, structured information extraction, and workflow automation**.

The system uses n8n to orchestrate the processing pipeline, MySQL to store structured data, and Flask to present the results through an interactive dashboard.

## ✨ Key Features

* **Automated Email Processing:** Uses a configured Gmail trigger to initiate the workflow for incoming emails.
* **AI-Based Classification:** Categorizes emails into predefined groups, such as job alerts, newsletters, and interview invitations.
* **Hiring-Intent Validation:** Applies a separate validation step to distinguish relevant hiring opportunities from unrelated content.
* **Structured Job Extraction:** Extracts job roles, company names, and locations from recruitment emails.
* **Relational Database Storage:** Stores processed email metadata and extracted job information in MySQL.
* **Interactive Dashboard:** Displays stored job information using a Flask web application.
* **Live Search and Filtering:** Filters displayed jobs by role, company, and location using JavaScript.
* **Discord Notifications:** Supports sending job-related notifications through a configured Discord webhook.

## 🏗️ System Architecture

The project consists of three main components.

### 1. AI Automation Pipeline — n8n

The n8n workflow orchestrates the processing of recruitment emails.

1. **Email Ingestion:** Receives email data through the configured Gmail trigger.
2. **Text Cleaning:** Extracts readable content from email messages.
3. **Email Classification:** Uses an LLM to classify the email into a predefined category.
4. **Hiring Validation:** Evaluates whether the email contains a relevant hiring opportunity.
5. **Conditional Routing:** Passes valid hiring-related emails to the extraction stage.
6. **Job Information Extraction:** Extracts structured information, including role, company, and location.
7. **Item Splitting:** Processes multiple extracted jobs as separate records.
8. **Database Storage:** Writes email metadata and job information to MySQL.
9. **Notifications:** Sends notifications through Discord when configured.

### 2. Database Layer — MySQL

The database separates email metadata from extracted job records.

* **`email_events`:** Stores email identifiers, source platforms, categories, and processing timestamps.
* **`jobs`:** Stores extracted job roles, company names, locations, and associated email identifiers.

This relational structure allows a single email to be associated with multiple extracted job records.

### 3. Web Dashboard — Flask

The Flask application retrieves stored information from MySQL and presents it through a web interface.

Dashboard capabilities include:

* Viewing extracted job information.
* Searching and filtering job records.
* Viewing summary metrics and source-platform statistics.
* Inspecting available job and email details.

## 🔄 Processing Workflow

```text
Incoming Email
      |
      v
Email Text Cleaning
      |
      v
LLM Classification
      |
      v
Hiring-Intent Validation
      |
      v
Conditional Routing
      |
      v
Job Information Extraction
      |
      v
Split Extracted Job Records
      |
      v
MySQL Database
      |
      +-------------------+
      |                   |
      v                   v
Flask Dashboard     Discord Notification
```

## 🛠️ Technology Stack

| Component              | Technologies                        |
| ---------------------- | ----------------------------------- |
| Programming Language   | Python                              |
| Workflow Automation    | n8n                                 |
| AI and Language Models | LLM API integration                 |
| Backend Framework      | Flask                               |
| Database               | MySQL                               |
| Frontend               | HTML, CSS, JavaScript, Tailwind CSS |
| Notifications          | Discord Webhooks                    |
| Configuration          | Python dotenv                       |
| Version Control        | Git and GitHub                      |

## 🚀 Run Locally

### Prerequisites

Install or configure the following:

* Python 3.12 or a compatible supported version.
* MySQL Server.
* Git.
* n8n, if you want to run the automation workflow.

### 1. Clone the Repository

```bash
git clone https://github.com/pragadeesh345/RecruitAI.git
cd RecruitAI
```

Replace `YOUR-USERNAME` with your GitHub username.

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

Activate it on Windows:

```cmd
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure MySQL

Create the database using the same name specified by `DB_NAME` in your environment configuration.

For example:

```sql
CREATE DATABASE job_tracker;
USE job_tracker;
```

Create the email metadata table:

```sql
CREATE TABLE email_events (
    message_id VARCHAR(255) PRIMARY KEY,
    platform_source VARCHAR(100),
    final_category VARCHAR(100),
    email_date DATETIME,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Create the extracted jobs table:

```sql
CREATE TABLE jobs (
    job_id INT AUTO_INCREMENT PRIMARY KEY,
    message_id VARCHAR(255),
    role VARCHAR(255),
    company VARCHAR(255),
    location VARCHAR(255),
    FOREIGN KEY (message_id)
        REFERENCES email_events(message_id)
);
```

Ensure the database schema matches the queries and column names expected by the application and workflow.

### 5. Configure Environment Variables

Create your local `.env` file from the provided example:

```cmd
copy .env.example .env
```

Update `.env` with your local MySQL credentials:

```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=job_tracker
```

Use your actual local database settings. Never commit `.env` or publish database passwords, API keys, or webhook URLs.

### 6. Start the Dashboard

Run:

```bash
python app.py
```

Open your browser at:

**http://127.0.0.1:5000**

The dashboard requires a working MySQL connection and appropriate database tables.

### 7. Configure the n8n Workflow

To enable email processing:

1. Import `Recruit_AI-public.json` into your n8n instance.
2. Configure the required Gmail, LLM, MySQL, and Discord credentials as applicable.
3. Verify the database settings and workflow configuration.
4. Test the workflow with sample emails before activating it.

The public workflow contains placeholders for configuration. It does not include your private credentials.

## 📁 Project Structure

```text
RecruitAI/
│
├── app.py                  # Flask application
├── requirements.txt        # Python dependencies
├── .env.example            # Environment configuration template
├── .gitignore              # Excluded files and secrets
├── README.md               # Project documentation
├── Recruit_AI-public.json  # Sanitized n8n workflow export
│
├── static/
│   ├── css/
│   │   └── style.css       # Dashboard styling
│   └── js/
│       └── main.js         # Client-side interactions
│
└── templates/
    └── index.html          # Dashboard interface
```

## 🧪 Testing and Validation

Before using the system with a live inbox, test the workflow with representative examples:

* A recruitment email containing a job role and company.
* An interview invitation.
* A general newsletter that mentions jobs but contains no actionable opportunity.
* An email containing multiple job listings.
* An email with incomplete or ambiguous job information.

Check that the classification, validation, extraction, database writes, and dashboard display behave as expected.

Quantitative accuracy and reliability should be reported only after testing against a labeled evaluation dataset.

## 🔮 Future Improvements

* **Resume-to-Job Matching:** Compare extracted job descriptions against a resume to estimate relevance.
* **Duplicate Detection:** Identify duplicate job listings received through different emails.
* **Application Tracking:** Track application status and interview progress.
* **Advanced Analytics:** Add filters, trends, and job-source statistics.
* **Automated Reply Drafting:** Generate suggested responses to interview invitations for user review.

## 👨‍💻 Project Purpose

RecruitAI demonstrates the integration of workflow automation, LLM-based text processing, relational database design, and web application development to address a practical recruitment-information management problem.

The project brings together AI-assisted information extraction and a Python-based dashboard in a single workflow.

---

**Note:** The public workflow is provided for configuration and experimentation. Configure your own credentials and verify its execution before using it with a live inbox.
