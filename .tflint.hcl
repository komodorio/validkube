plugin "aws" {
    enabled = true
    version = "0.12.0"
    source  = "github.com/terraform-linters/tflint-ruleset-aws"
}

plugin "google" {
    enabled = true
    version = "0.15.0"
    source  = "github.com/terraform-linters/tflint-ruleset-google"
}

plugin "azurerm" {
    enabled = true
    version = "0.14.0"
    source  = "github.com/terraform-linters/tflint-ruleset-azurerm"
}
