output "persona_queue_url" {
  value = aws_sqs_queue.persona_events.url
}

output "postgres_endpoint" {
  value = aws_db_instance.postgres.endpoint
}

output "redis_primary_endpoint" {
  value = aws_elasticache_replication_group.redis.primary_endpoint_address
}

