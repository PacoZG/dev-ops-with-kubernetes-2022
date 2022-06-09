# Prerequisites

1. Install [gcloud SDK](https://cloud.google.com/sdk/docs/install)
2. Create new project in GCP
3. Run `gcloud auth login`
4. Run `gcloud config set project <YOUR_PROJECT_NAME>`

# Create cluster

Run `gcloud container clusters create <YOUR_CLUSTER_NAME> --zone=europe-north1-b --cluster-version=1.22`

- [Full list of zones](https://cloud.google.com/about/locations/). `europe-north1-b` is Finland
- [gke versions](https://cloud.google.com/kubernetes-engine/docs/release-schedule)

# Remove cluster

Run `gcloud container clusters delete <YOUR_CLUSTER_NAME> --zone=europe-north1-b`
