provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "clubos" {
  name     = "rg-clubos-alfaisaly-demo"
  location = "Qatar Central"
}

resource "azurerm_service_plan" "plan" {
  name                = "plan-clubos-demo"
  resource_group_name = azurerm_resource_group.clubos.name
  location            = azurerm_resource_group.clubos.location
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "app" {
  name                = "app-clubos-alfaisaly"
  resource_group_name = azurerm_resource_group.clubos.name
  location            = azurerm_service_plan.plan.location
  service_plan_id     = azurerm_service_plan.plan.id

  site_config {
    application_stack {
      dotnet_version = "10.0"
    }
  }

  app_settings = {
    "ASPNETCORE_ENVIRONMENT" = "Production"
    "WEBSITE_TIME_ZONE"      = "Arab Standard Time"
  }
}

resource "azurerm_postgresql_flexible_server" "db" {
  name                   = "db-clubos-alfaisaly"
  resource_group_name    = azurerm_resource_group.clubos.name
  location               = azurerm_resource_group.clubos.location
  version                = "14"
  administrator_login    = "psqladmin"
  administrator_password = "REPLACE_WITH_STRONG_PASSWORD" # Use KeyVault in production

  storage_mb = 32768
  sku_name   = "GP_Standard_D2s_v3"
}
