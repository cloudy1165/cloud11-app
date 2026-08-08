output "staging_namespace" {
  value = kubernetes_namespace.staging.metadata[0].name
}

output "production_namespace" {
  value = kubernetes_namespace.production.metadata[0].name
}

output "nginx_ingress_ip" {
  value = helm_release.nginx_ingress.status[0].public_ipv4_address
}
