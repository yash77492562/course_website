'use client';

import { CourseHeroSection } from '@/components/features/CourseHeroSection/CourseHeroSection';
import { ProgramOutcomeSection } from '@/components/features/ProgramOutcomeSection/ProgramOutcomeSection';
import { CareerSupportSection } from '@/components/features/CareerSupportSection/CareerSupportSection';

interface CourseDetailPageProps {
  courseId?: string;
}

// Program data that matches the exact rivadata structure
const programDetails = {
  "data_analytics": {
    "badge": "Data Analytics Program",
    "headline": "Become a Job-Ready Data Analyst",
    "subheadline": "Designed to transform beginners and professionals into industry-ready Data Analysts capable of working with real-world business data and modern analytics tools.",
    "price": "£999",
    "spotsLeft": 7,
    "nextCohort": "Next batch starting soon (date TBC)",
    "checkoutUrl": "https://buy.stripe.com/8x28wR1SA3f7adedrA4sE00",
    "highlights": ["SQL", "Excel", "Power BI", "Tableau", "Python", "Azure & Databricks"],
    "outcomes": [
      "Query and analyse data using SQL",
      "Perform advanced analysis using Excel",
      "Build professional dashboards in Power BI and Tableau",
      "Automate analytics workflows using Python",
      "Understand cloud-based analytics using Azure & Databricks",
      "Build a portfolio with real-world projects",
      "Pass technical and competency-based interviews"
    ],
    "modules": [
      {
        "title": "Module 1: Foundations of Data Analytics",
        "items": [
          "Introduction to the Data Analytics lifecycle",
          "Structured vs unstructured data",
          "Data-driven decision making",
          "Data roles in modern organisations",
          "Analytics tools and workflows"
        ]
      },
      {
        "title": "Module 2: Excel for Data Analysis",
        "items": [
          "Data cleaning and transformation",
          "Advanced formulas and functions",
          "Pivot tables and pivot charts",
          "Data visualisation best practices",
          "Dashboard creation in Excel",
          "Business analytics use cases"
        ]
      },
      {
        "title": "Module 3: SQL for Data Analytics",
        "items": [
          "Database fundamentals",
          "Writing SQL queries",
          "Joins, aggregations, filtering",
          "Window functions and advanced SQL",
          "Query optimisation techniques",
          "Real-world analysis scenarios"
        ]
      },
      {
        "title": "Module 4: Data Visualisation & BI (Power BI + Tableau)",
        "items": [
          "Power BI: Modelling, Power Query, DAX, dashboards, publishing",
          "Tableau: Data sources, visual analytics, interactive dashboards, storytelling"
        ]
      },
      {
        "title": "Module 5: Python for Data Analysis",
        "items": [
          "Python fundamentals",
          "Pandas + NumPy",
          "Matplotlib (visualisation)",
          "Data cleaning & preprocessing",
          "Exploratory Data Analysis (EDA)"
        ]
      },
      {
        "title": "Module 6: Cloud Analytics (Azure & Databricks)",
        "items": [
          "Intro to cloud data platforms",
          "Data storage and pipelines",
          "Databricks processing",
          "Collaborative analytics workflows"
        ]
      },
      {
        "title": "Module 7: Real-World Analytics Projects",
        "items": [
          "Sales performance dashboard",
          "Customer segmentation analysis",
          "Marketing campaign performance analysis",
          "Financial analytics dashboard"
        ]
      },
      {
        "title": "Module 8: Career & Interview Preparation",
        "items": [
          "Resume building",
          "LinkedIn optimisation",
          "Portfolio website + GitHub",
          "Technical + competency interviews",
          "Mock interviews with feedback"
        ]
      }
    ],
    "faqs": [
      { "q": "Do I need prior experience?", "a": "No. We start from fundamentals and ramp up to job-ready skills with projects." },
      { "q": "Is this suitable for career changers?", "a": "Yes — the program is designed for reskilling and includes interview preparation." },
      { "q": "How do I secure my spot?", "a": "Click Pay Now to reserve a seat. Once payment is confirmed, we'll onboard you with the next cohort details." }
    ]
  },
  "data_engineering": {
    "badge": "Data Engineering Program",
    "headline": "Build Scalable Data Pipelines & Modern Data Platforms",
    "subheadline": "Become a modern Data Engineer capable of building production-grade data pipelines and cloud data architectures.",
    "price": "£1299",
    "spotsLeft": 6,
    "nextCohort": "Next batch starting soon (date TBC)",
    "checkoutUrl": "https://buy.stripe.com/6oUdRb1SA6rj2KMfzI4sE01",
    "highlights": ["Advanced SQL", "Python", "PySpark", "Databricks", "Delta Lake", "Medallion", "Cloud (AWS/Azure)"],
    "outcomes": [
      "Build scalable data pipelines",
      "Process large datasets using PySpark",
      "Implement Medallion (Bronze/Silver/Gold) architecture",
      "Work with Databricks and cloud platforms",
      "Design robust data platforms",
      "Apply CI/CD, testing, logging and monitoring best practices"
    ],
    "modules": [
      { "title": "Module 1: Data Engineering Fundamentals", "items": ["Role of a Data Engineer", "Modern data architecture", "Warehouses vs lakes", "ETL vs ELT", "Big data ecosystem"] },
      { "title": "Module 2: Advanced SQL for Data Engineering", "items": ["Complex joins & transformations", "Window functions", "Performance optimisation", "Data modelling", "Analytical query design"] },
      { "title": "Module 3: Python for Data Engineering", "items": ["Python fundamentals", "File handling", "APIs", "Ingestion pipelines", "Reusable scripts"] },
      { "title": "Module 4: Big Data Processing with PySpark", "items": ["Spark architecture", "DataFrames", "Distributed processing", "Performance optimisation", "Scalable workflows"] },
      { "title": "Module 5: Databricks & Modern Data Platforms", "items": ["Workspace setup", "Notebooks", "Delta Lake", "Orchestration", "Collaboration"] },
      { "title": "Module 6: Medallion Architecture", "items": ["Bronze/Silver/Gold", "Quality layers", "Governance/lineage concepts", "Scalable modelling"] },
      { "title": "Module 7: Handling Multiple Data Sources", "items": ["CSV", "JSON", "Parquet", "APIs", "Streaming sources (intro)"] },
      { "title": "Module 8: Cloud Data Engineering (AWS)", "items": ["S3 storage", "Cloud pipeline patterns", "Distributed computing concepts", "Architecture best practices"] },
      { "title": "Module 9: Engineering Best Practices", "items": ["CI/CD", "Unit testing", "Metadata-driven pipelines", "Logging/monitoring", "Quality frameworks"] },
      { "title": "Module 10: Real-World Projects", "items": ["End-to-end pipeline with Databricks", "Lakehouse implementation", "Metadata-driven ingestion", "Scalable ETL pipelines"] }
    ],
    "faqs": [
      { "q": "Is this hands-on?", "a": "Yes. You'll build production-style pipelines and a portfolio of projects." },
      { "q": "Do I need to know Spark already?", "a": "No — we teach Spark fundamentals and then move into performance patterns." },
      { "q": "How do I secure my spot?", "a": "Click Pay Now. Your seat is reserved once payment completes." }
    ]
  },
  "data_science_ai": {
    "badge": "Data Science & AI Program",
    "headline": "Build Intelligent Systems with Machine Learning & AI",
    "subheadline": "Learn modern ML, Deep Learning, LLM applications and deployment workflows used in real organisations.",
    "price": "£1499",
    "spotsLeft": 5,
    "nextCohort": "Next batch starting soon (date TBC)",
    "checkoutUrl": "https://buy.stripe.com/eVq5kF1SA5nfade73c4sE02",
    "highlights": ["Python", "Statistics", "ML", "Deep Learning", "LLM Apps", "Deployment"],
    "outcomes": [
      "Perform advanced analysis & EDA",
      "Build and evaluate machine learning models",
      "Work with deep learning fundamentals",
      "Build LLM-powered applications",
      "Deploy models and monitor performance",
      "Create capstone projects for your portfolio"
    ],
    "modules": [
      { "title": "Module 1: Python for Data Science", "items": ["Python fundamentals", "Pandas + NumPy", "Preprocessing", "EDA"] },
      { "title": "Module 2: Statistics for Data Science", "items": ["Probability", "Hypothesis testing", "Distributions", "A/B testing"] },
      { "title": "Module 3: Machine Learning Fundamentals", "items": ["Supervised & unsupervised learning", "Feature engineering", "Evaluation", "Linear/Logistic regression", "Trees, RF, Boosting"] },
      { "title": "Module 4: Advanced Machine Learning", "items": ["Clustering", "Dimensionality reduction", "Optimisation", "Hyperparameter tuning"] },
      { "title": "Module 5: Deep Learning", "items": ["Neural nets", "TensorFlow/PyTorch intro", "Computer vision basics", "NLP basics"] },
      { "title": "Module 6: AI & LLM Applications", "items": ["Generative AI", "LLMs", "Prompt engineering", "Business use cases"] },
      { "title": "Module 7: Model Deployment", "items": ["Model APIs", "Deploying ML models", "Monitoring in production"] },
      { "title": "Module 8: Capstone Projects", "items": ["Predictive analytics", "Sentiment analysis", "Recommendation system", "AI chatbot"] }
    ],
    "faqs": [
      { "q": "Is this beginner-friendly?", "a": "Yes — we start from Python + stats and ramp into ML/AI with projects." },
      { "q": "Will I build a portfolio?", "a": "Yes — capstone projects are designed to showcase skills to employers." },
      { "q": "How do I secure my spot?", "a": "Click Pay Now to reserve a seat for the next cohort." }
    ]
  }
};

export function CourseDetailPage({ courseId = '1' }: CourseDetailPageProps) {
  // Map courseId to program key
  const getProgramKey = (id: string) => {
    switch(id) {
      case '1': return 'data_analytics';
      case '2': return 'data_engineering';  
      case '3': return 'data_science_ai';
      default: return 'data_analytics';
    }
  };

  const programKey = getProgramKey(courseId);
  const p = programDetails[programKey as keyof typeof programDetails];

  if (!p) {
    return (
      <div style={{ padding: '120px 5vw', textAlign: 'center' }}>
        <h1 className="section-title">Program not found</h1>
        <p className="section-sub">Please go back to the home page.</p>
        <a className="btn-primary" href="/">Back to home</a>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '0px' }}>
      {/* 1. Course Program Hero Section */}
      <CourseHeroSection 
        programData={{
          badge: p.badge,
          headline: p.headline,
          subheadline: p.subheadline,
          price: p.price,
          spotsLeft: p.spotsLeft,
          nextCohort: p.nextCohort,
          checkoutUrl: p.checkoutUrl,
          highlights: p.highlights
        }}
      />

      {/* 2. Program Outcome & Curriculum Section */}
      <ProgramOutcomeSection 
        outcomes={p.outcomes}
        modules={p.modules}
      />

      {/* 3. Career Support & FAQs Section */}
      <CareerSupportSection 
        faqs={p.faqs}
      />
    </div>
  );
}

export default CourseDetailPage;