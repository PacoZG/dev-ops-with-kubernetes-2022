# Google Cloud SQL DBaaS

## Pros

- Automatically maintained
  - Can create a new instance with a click of a button
  - Can easily setup backups
- If you are working in a team where most people do not have experience with k8s, the simplicity can help out a lot
- With one vCPU, 1 GB Storage and 1 GB Memory, the cost would be around 38$ for a month.
  - Hourly price for Finland servers:
    - $0.0454 per vCPU
    - $0.0077 per GB Memory
  - $0.088 per GB/month for backups (used)

## Cons

- Less freedom in how to setup your database
  - You are depending more on Google with security and privacy. Although, I assume Google probably handles security better than I would

# Hosting a database in GKE DIY style

## Pros

- A lot of control over how the database is hosted

## Cons

- Need to maintain it yourself
  - Configure and deploy resources for k8s
  - Need to setup backups yourself
    - Dump them to a volume?
- If working in a team with people that do not have experience with k8s, they will have a harder time to understand how the database is set up
- With one vCPU, 1 GB of Memory and 1 GB of Storage, the cost would be around 40$ for a month.
  - Hourly price for Finland servers
    - $0.0490 per Autopilot vCPU
    - $0.0054202 per GB of Autopilot Pod Memory
    - $0.0000603 per GB or Autopilot Ephermal Storage (Could use this for backups)
