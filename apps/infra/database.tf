module "mongodb_cluster" {
  source = "./modules/mongodb-cluster"

  project_id = var.mongodb_atlas_project_id
  db_name    = local.name_prefix
}
