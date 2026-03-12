provider "aws" {
  region = var.aws_region
}

locals {
  name = "${var.project_name}-${var.environment}"
  tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

resource "aws_sqs_queue" "persona_events" {
  name                      = "${local.name}-persona-events"
  message_retention_seconds = 345600
  visibility_timeout_seconds = 60
  tags                      = local.tags
}

resource "aws_secretsmanager_secret" "app" {
  name = "${local.name}-app-secrets"
  tags = local.tags
}

resource "aws_db_subnet_group" "main" {
  name       = "${local.name}-db-subnets"
  subnet_ids = ["subnet-12345678", "subnet-23456789"]
  tags       = local.tags
}

resource "aws_db_instance" "postgres" {
  identifier             = "${local.name}-postgres"
  allocated_storage      = 20
  engine                 = "postgres"
  engine_version         = "16.3"
  instance_class         = "db.t4g.micro"
  username               = "postgres"
  password               = "replace-me"
  db_subnet_group_name   = aws_db_subnet_group.main.name
  skip_final_snapshot    = true
  publicly_accessible    = false
  backup_retention_period = 7
  tags                   = local.tags
}

resource "aws_elasticache_subnet_group" "redis" {
  name       = "${local.name}-redis-subnets"
  subnet_ids = ["subnet-12345678", "subnet-23456789"]
}

resource "aws_elasticache_replication_group" "redis" {
  replication_group_id       = "${replace(local.name, "-", "")}redis"
  description                = "Redis cache for ${local.name}"
  node_type                  = "cache.t4g.micro"
  num_cache_clusters         = 1
  parameter_group_name       = "default.redis7"
  subnet_group_name          = aws_elasticache_subnet_group.redis.name
  automatic_failover_enabled = false
  tags                       = local.tags
}

resource "aws_ecs_cluster" "main" {
  name = "${local.name}-cluster"
  tags = local.tags
}

resource "aws_cloudwatch_log_group" "api" {
  name              = "/ecs/${local.name}/api"
  retention_in_days = 30
  tags              = local.tags
}

resource "aws_cloudwatch_log_group" "worker" {
  name              = "/ecs/${local.name}/worker"
  retention_in_days = 30
  tags              = local.tags
}

