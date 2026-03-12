variable "project_name" {
  type        = string
  description = "Base name for Expert Portal infrastructure."
  default     = "expert-portal-mvp"
}

variable "aws_region" {
  type        = string
  description = "AWS region for the stack."
  default     = "us-east-1"
}

variable "environment" {
  type        = string
  description = "Deployment environment."
  default     = "staging"
}

variable "app_image" {
  type        = string
  description = "Container image for the API service."
  default     = "public.ecr.aws/docker/library/node:22-alpine"
}

variable "worker_image" {
  type        = string
  description = "Container image for the worker service."
  default     = "public.ecr.aws/docker/library/node:22-alpine"
}

