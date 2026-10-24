import { ToolMetadata } from '../types';

export const TOOLS_CONFIG: ToolMetadata[] = [
  {
    id: 'resume-analyzer',
    title: 'AI Resume Analyzer',
    shortDesc: 'Evaluate resume alignment against target job descriptions with explainable scoring.',
    tagline: 'Deep talent alignment, skill gap breakdown, and high-impact rewrite suggestions.',
    category: 'Career & HR',
    icon: 'FileText',
    badge: 'Explainable Score',
    features: [
      'Explainable match score (non-ATS)',
      'Identified skill matches & gaps',
      'Seniority & domain alignment',
      'Actionable bullet rewrites',
    ],
  },
  {
    id: 'sql-assistant',
    title: 'AI SQL Assistant',
    shortDesc: 'Generate, explain, debug, and optimize queries across modern SQL dialects.',
    tagline: 'Production-ready query generation with step-by-step logic and indexing advice.',
    category: 'Database & Engineering',
    icon: 'Database',
    badge: 'Multi-Dialect',
    features: [
      'Postgres, MySQL, Snowflake, BigQuery',
      'Step-by-step query explanation',
      'Safe sandbox (zero live execution)',
      'Query optimization & indexing hints',
    ],
  },
  {
    id: 'meeting-notes',
    title: 'AI Meeting Notes Analyzer',
    shortDesc: 'Turn raw transcripts into summaries, decisions, strict action items, and email recaps.',
    tagline: 'Strict factual extraction without hallucinated owners or imaginary deadlines.',
    category: 'Productivity',
    icon: 'ListChecks',
    badge: 'Zero Hallucination',
    features: [
      'Executive summary & decisions',
      'Strict owners & deadlines tagging',
      'Unspecified assignment detection',
      'One-click follow-up team email',
    ],
  },
  {
    id: 'pdf-chatbot',
    title: 'AI PDF Chatbot',
    shortDesc: 'Ask questions grounded exclusively in uploaded PDF documents with page citations.',
    tagline: 'Multi-page document analysis with page references and truthful absence detection.',
    category: 'Document AI',
    icon: 'Bot',
    badge: 'Page Citations',
    features: [
      'Direct PDF upload or sample docs',
      'Page-anchored citations',
      'Direct quoted evidence excerpts',
      'Explicit fallback when info absent',
    ],
  },
  {
    id: 'code-review',
    title: 'AI Code Review Assistant',
    shortDesc: 'Identify bugs, security vulnerabilities, edge cases, and algorithmic complexity.',
    tagline: 'Untrusted input sandboxing with categorized findings and refactored code snippets.',
    category: 'Code Quality',
    icon: 'Code2',
    badge: 'Security & Bugs',
    features: [
      'Bugs, security, and edge cases',
      'Big-O complexity analysis',
      'Quality score and letter grade',
      'Complete refactored code snippet',
    ],
  },
  {
    id: 'data-analyst',
    title: 'AI Data Analyst',
    shortDesc: 'Upload CSV datasets for instant EDA, statistical profiles, charts, and grounded AI insights.',
    tagline: 'Deterministic mathematical calculations paired with strategic executive intelligence.',
    category: 'Analytics',
    icon: 'BarChart3',
    badge: 'Charts & EDA',
    features: [
      'CSV upload & sample datasets',
      'Summary stats & missing values',
      'Interactive distribution charts',
      'Evidence-grounded strategic insights',
    ],
  },
];

// Sample 1: Resume Analyzer
export const SAMPLE_RESUME = `Alex Chen
Senior Software Engineer
San Francisco, CA • alex.chen@example.com • linkedin.com/in/alexchen • github.com/alexchen

PROFESSIONAL SUMMARY
Results-driven software engineer with 6+ years of experience building high-scale distributed backend systems and full-stack web applications. Expert in TypeScript, Node.js, React, and PostgreSQL. Passionate about API reliability, database performance tuning, and developer tooling.

WORK EXPERIENCE
Senior Backend Engineer | FinScale Technologies (2022 - Present)
• Architected and launched high-throughput payment transaction pipeline handling 15,000 requests/sec with p99 latency < 65ms using Node.js, Express, and PostgreSQL.
• Reduced database query response times by 42% by redesigning relational indexes, optimizing partitioning keys, and implementing Redis caching layers.
• Led team of 5 engineers in migrating monolithic billing service to modular microservices deployed with Docker on AWS ECS.
• Built internal developer dashboard in React and Tailwind CSS that lowered incident investigation mean-time-to-resolution (MTTR) by 28%.

Software Engineer | CloudMatrix Solutions (2019 - 2022)
• Developed REST and GraphQL APIs using TypeScript, Node.js, and PostgreSQL powering customer-facing enterprise CRM.
• Implemented automated CI/CD pipelines with GitHub Actions, increasing test coverage from 64% to 91%.
• Collaborated with product managers to deliver user authentication and RBAC system supporting 250,000 active users.

TECHNICAL SKILLS
• Languages: TypeScript, JavaScript, SQL, Python (intermediate), HTML/CSS
• Frameworks & Libraries: Node.js, Express, NestJS, React, Next.js, Jest, Tailwind CSS
• Databases & Storage: PostgreSQL, MySQL, Redis, AWS DynamoDB
• Infrastructure & Tools: Docker, AWS (ECS, S3, RDS), Git, GitHub Actions, Linux
• Methodologies: RESTful APIs, Microservices, Agile/Scrum, Distributed Systems

EDUCATION
B.S. in Computer Science | University of California, Davis (2015 - 2019)`;

export const SAMPLE_JOB_DESCRIPTION = `Job Title: Senior Platform Engineer
Company: Apex FinTech Core
Location: San Francisco, CA / Remote

About The Role:
Apex FinTech Core is seeking a Senior Platform Engineer to scale our mission-critical transaction settlement engine. You will design, build, and maintain our high-concurrency event-driven infrastructure.

Key Responsibilities:
• Architect resilient microservices handling millions of financial ledger entries daily.
• Build distributed messaging pipelines using Apache Kafka and Go / Golang.
• Manage container orchestration and deployments across Kubernetes (EKS) clusters.
• Enforce strict security, audit logging, and PCI-DSS compliance standards.
• Optimize PostgreSQL and time-series database clusters for zero-downtime scale.

Required Qualifications:
• 5+ years of experience in backend or platform engineering.
• Strong proficiency in Go (Golang) or modern concurrent backend languages.
• Hands-on production experience with Apache Kafka or RabbitMQ event streaming.
• Strong production experience with Kubernetes, Docker, and Terraform (IaC).
• Deep knowledge of PostgreSQL internals, locking, transactions, and indexing.
• Familiarity with financial compliance, PCI-DSS, or high-security architectures.

Nice to Have:
• Experience with TypeScript / React for internal engineering observability dashboards.
• Experience with Prometheus, Grafana, and OpenTelemetry distributed tracing.`;

// Sample 2: SQL Assistant
export const SAMPLE_SQL_QUESTIONS = [
  {
    title: 'Customer Lifetime Value & Churn Risk',
    question: 'Find the top 5 customers with the highest total spend who have made at least 3 orders. Include their total order count, average order value, date of their most recent purchase, and how many days have elapsed since their last purchase.',
    dialect: 'PostgreSQL' as const,
    schema: `CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  order_date TIMESTAMP,
  total_amount NUMERIC(10, 2),
  status VARCHAR(20) -- 'completed', 'cancelled', 'refunded'
);`,
  },
  {
    title: 'Monthly Recurring Revenue Growth by Tier',
    question: 'Calculate Monthly Recurring Revenue (MRR) by subscription plan tier for each month in 2024, along with month-over-month growth rate percentage using window functions.',
    dialect: 'Snowflake' as const,
    schema: `CREATE TABLE subscriptions (
  subscription_id VARCHAR PRIMARY KEY,
  customer_id VARCHAR,
  plan_tier VARCHAR, -- 'Basic', 'Pro', 'Enterprise'
  monthly_price NUMBER(10,2),
  started_at DATE,
  ended_at DATE,
  status VARCHAR
);`,
  },
];

export const SAMPLE_SQL_DEBUG = {
  question: 'Fix this slow query and resolve syntax errors. It is supposed to count distinct buyers per category who spent over $500 in 2024, but it throws GROUP BY errors and takes over 30 seconds.',
  dialect: 'PostgreSQL' as const,
  existingSql: `SELECT 
  c.category_name,
  o.customer_id,
  SUM(o.amount) as total_spent,
  COUNT(DISTINCT o.customer_id)
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
LEFT JOIN order_items oi ON oi.product_id = p.id
LEFT JOIN orders o ON o.id = oi.order_id
WHERE o.order_date >= '2024-01-01'
HAVING SUM(o.amount) > 500
ORDER BY total_spent DESC`,
  schema: `categories (id, category_name)
products (id, category_id, product_name, price)
order_items (id, order_id, product_id, quantity, unit_price)
orders (id, customer_id, order_date, amount, status)`,
};

// Sample 3: Meeting Notes
export const SAMPLE_MEETING_NOTES = `Meeting: Q4 Product Launch & Payment Gateway Architecture Sync
Date: October 21, 2024 | 10:00 AM - 11:00 AM PST
Attendees: Maria (VP Engineering), Dave (Lead Architect), Sarah (Backend Senior Dev), Kenji (Product Manager), Rachel (QA Lead)

[10:00] Maria: Welcome everyone. Today we must lock in the final cutover timeline for Stripe v3 integration, review load testing bottlenecks, and agree on rollback procedures.

[10:05] Dave: Quick architecture update. The dual-write adapter between Stripe and our legacy vault passed integration tests. However, during 10x peak load simulations, we observed connection pool exhaustion on the replica database. We need to bump max_connections from 200 to 500 and tune PgBouncer pool mode to transaction.

[10:15] Maria: Let's make an official decision. Do we approve moving PgBouncer to transaction mode?
Dave: Yes, I recommend it. It eliminates the idle thread overhead.
Maria: Decision confirmed: Approved switching PgBouncer to transaction pool mode.

[10:22] Sarah: I am running the follow-up stress test. Maria, I will complete the new load testing runs and post the benchmark report to #eng-alerts by this Friday at 4:00 PM.
Maria: Great, thanks Sarah.

[10:28] Kenji: From the product side, we need the updated payment failure error messages translated to Spanish and French before European rollout.
Rachel: We also noticed that Safari mobile has an issue rendering the 3D Secure modal popup.
Kenji: Who is taking the Safari bug?
(Dave: Someone on frontend should investigate the Safari rendering glitch soon, before the end of the sprint).

[10:35] Maria: What about the customer communication plan if rollback is triggered?
Kenji: I will draft the customer incident advisory template and have it approved by legal by Monday, October 28th.

[10:42] Rachel: We must also conduct a regression test on legacy PayPal webhooks. We should make sure legacy webhooks still fire correctly.
Maria: Agreed, that's crucial.

[10:50] Dave: Main risk: If Stripe's webhook delivery is delayed during Black Friday spike, order status might stay pending. Mitigation: We implemented an idempotent polling cron job that reconciles pending orders every 5 minutes.

[10:55] Maria: To wrap up:
- PgBouncer transaction mode is approved.
- Cutover date tentatively set for November 4th, pending Sarah's benchmark pass.
- Everyone please review the risk register. Thanks team!`;

// Sample 4: PDF Chatbot Document Text
export const SAMPLE_PDF_DOCUMENT = `================================================================================
DOCUMENT: NOVA DISTRIBUTED VECTOR DATABASE - ARCHITECTURE WHITE PAPER
Version: 3.4-Enterprise | Published: September 2025 | Document ID: NOVA-WP-2025-V3
================================================================================

[Page 1] - EXECUTIVE SUMMARY & SYSTEM OVERVIEW
Nova is an enterprise-grade, distributed vector database engineered for millisecond semantic similarity search at billion-scale embeddings. Built on an asynchronous Raft consensus engine in Rust, Nova decouples index compute nodes from durable object storage layers (S3/GCS). 
Nova utilizes an optimized Hierarchical Navigable Small World (HNSW) graph index with product quantization (PQ-8 and PQ-16). Index construction occurs asynchronously across ephemeral worker pools, preventing query degradation during streaming data ingest. Nova integrates natively with Kubernetes operators and provides bi-directional replication across multiple cloud regions.

[Page 2] - PERFORMANCE BENCHMARKS & LATENCY SLA
All benchmarks were conducted using 128-dimensional OpenAI text-embedding-3-small vectors across a 50,000,000 vector corpus deployed on 8x AWS c6i.4xlarge compute instances.
• Read Latency SLA: 99.0th percentile (p99) query latency is guaranteed at <= 8.5 milliseconds for top-k=10 nearest neighbor search under 10,000 concurrent Queries Per Second (QPS).
• 99.9th percentile (p99.9) query latency for batch inference operations is guaranteed under 24.0 milliseconds.
• Ingestion Throughput: Nova supports sustained ingestion of 75,000 vector embeddings per second per cluster node with real-time index visibility within 500 milliseconds.
• Memory Efficiency: Product quantization (PQ-8) achieves a 78% RAM reduction compared to uncompressed FP32 storage with less than 1.4% recall loss at recall@10.

[Page 3] - SECURITY, ENCRYPTION & DISASTER RECOVERY
Nova adheres to SOC2 Type II, ISO 27001, and HIPAA compliance mandates.
• Encryption at Rest: All vector embeddings, metadata payloads, and WAL logs are encrypted using AES-256-GCM with customer-managed encryption keys (CMEK) via AWS KMS or HashiCorp Vault.
• Encryption in Transit: Mandatory TLS 1.3 encryption across all client-to-node and inter-node gRPC channels with strict mTLS authentication.
• Disaster Recovery & RPO/RTO: Cluster state snapshots are asynchronously streamed to immutable object storage every 60 seconds. Guaranteed Recovery Point Objective (RPO) is < 60 seconds, and Recovery Time Objective (RTO) is < 4 minutes for complete cluster rebuilds.

[Page 4] - LICENSING, PRICING TIERS & LIMITS
Nova offers two commercial editions:
1. Developer Cloud: Free tier up to 500,000 vector embeddings, shared compute, community Discord support.
2. Enterprise Dedicated: $0.18 per million query requests + $450/month per dedicated compute node. Includes 24/7/365 15-minute SLA phone support, multi-region active-active replication, CMEK, and dedicated solutions architect.
Enterprise agreements include 99.99% uptime availability financial service credit guarantees.`;

export const SAMPLE_PDF_QUESTIONS = [
  'What is the 99.9th percentile query latency SLA for batch inference?',
  'What encryption standard is enforced for data at rest and how are keys managed?',
  'Does Nova support blockchain smart contract auditing and Ethereum verification?',
];

// Sample 5: Code Review
export const SAMPLE_CODE_SNIPPET = `# Data processing worker for ingestion queue
# Submitted for code review
import os
import psycopg2
import json

def process_batch_orders(raw_payload, customer_id):
    # Connect to database
    conn = psycopg2.connect(
        dbname="prod_db",
        user="admin",
        password=os.environ.get("DB_PASS"),
        host="10.0.4.12"
    )
    cursor = conn.cursor()
    
    # Parse payload
    orders = json.loads(raw_payload)
    results = []
    
    # Process orders
    for i in range(len(orders) + 1): # loop through orders
        order = orders[i]
        order_id = order['id']
        amount = order['amount']
        
        # Query existing transaction
        # Direct string concatenation
        query = f"SELECT status FROM orders WHERE id = '{order_id}' AND customer_id = '{customer_id}'"
        cursor.execute(query)
        record = cursor.fetchone()
        
        if record is None:
            # Insert new order
            insert_sql = f"INSERT INTO orders (id, customer_id, amount, status) VALUES ('{order_id}', '{customer_id}', {amount}, 'PENDING')"
            cursor.execute(insert_sql)
            results.append({"id": order_id, "status": "CREATED"})
        else:
            results.append({"id": order_id, "status": record[0]})
            
    conn.commit()
    return results`;

// Sample 6: Data Analyst CSV Datasets
export const SAMPLE_SAAS_CSV = `customer_id,company_name,plan_tier,monthly_arr_usd,usage_hours_monthly,support_tickets,nps_score,churned
CUST-001,Acme Corp,Enterprise,4500,420,1,9,No
CUST-002,Global Logistics,Pro,1200,180,4,7,No
CUST-003,Starlight Media,Basic,350,45,7,4,Yes
CUST-004,FinEdge Partners,Enterprise,5200,510,0,10,No
CUST-005,NextGen Robotics,Pro,1500,210,2,8,No
CUST-006,BlueSky Analytics,Enterprise,4800,490,3,9,No
CUST-007,Urban Retailers,Basic,350,30,8,3,Yes
CUST-008,Apex Health,Pro,1800,260,1,9,No
CUST-009,Silverline Design,Basic,400,60,5,5,Yes
CUST-010,Vanguard Security,Enterprise,6500,640,2,10,No
CUST-011,Omni Tech,Pro,1200,195,3,7,No
CUST-012,Zenith Consulting,Basic,350,50,9,2,Yes
CUST-013,Beacon Labs,Enterprise,5000,480,1,9,No
CUST-014,Solaris Energy,Pro,1650,230,2,8,No
CUST-015,Alpha Logistics,Enterprise,4200,390,4,8,No
CUST-016,Pinnacle Bio,Basic,400,55,6,4,Yes
CUST-017,Horizon Media,Pro,1400,215,2,8,No
CUST-018,Summit Financial,Enterprise,5800,570,0,10,No
CUST-019,Crest Dynamics,Basic,350,40,7,3,Yes
CUST-020,Vertex AI Labs,Enterprise,7200,690,1,10,No`;

export const SAMPLE_ECOMMERCE_CSV = `order_id,category,quantity,unit_price_usd,discount_pct,region,delivery_days,customer_satisfaction
ORD-101,Electronics,1,850.00,0.05,North America,3,5
ORD-102,Home & Kitchen,3,45.00,0.10,Europe,5,4
ORD-103,Electronics,2,320.00,0.15,Asia-Pacific,7,3
ORD-104,Apparel,4,28.50,0.00,North America,2,5
ORD-105,Books & Media,5,18.00,0.20,Europe,4,4
ORD-106,Electronics,1,1200.00,0.00,North America,2,5
ORD-107,Home & Kitchen,2,85.00,0.10,Latin America,9,2
ORD-108,Apparel,2,75.00,0.05,Europe,3,4
ORD-109,Electronics,1,450.00,0.10,Asia-Pacific,6,3
ORD-110,Books & Media,3,22.00,0.00,North America,3,5
ORD-111,Home & Kitchen,1,210.00,0.15,Europe,4,4
ORD-112,Apparel,3,42.00,0.25,Asia-Pacific,8,2
ORD-113,Electronics,2,650.00,0.05,North America,2,5
ORD-114,Books & Media,6,15.50,0.30,Latin America,11,1
ORD-115,Home & Kitchen,4,35.00,0.00,North America,3,5
ORD-116,Electronics,1,990.00,0.08,Europe,4,4
ORD-117,Apparel,1,110.00,0.00,Europe,3,5
ORD-118,Books & Media,2,30.00,0.10,Asia-Pacific,5,4
ORD-119,Home & Kitchen,2,125.00,0.05,North America,2,5
ORD-120,Electronics,3,280.00,0.12,Latin America,10,2`;
