variable "cluster_name" {
  description = "Kubernetes cluster name"
  type        = string
  default     = "cloud11-cluster"
}

variable "region" {
  description = "Cloud region"
  type        = string
  default     = "us-south"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "staging"
}
