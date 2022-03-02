package api

import (
	"testing"

	"github.com/jgroeneveld/trial/assert"
)

func TestTFLint(t *testing.T) {
	for _, test := range []apiTest{
		{
			in: []byte(`variable "access_key" {}
variable "secret_key" {}

provider "aws" {
  access_key = var.access_key
  secret_key = var.secret_key
  region     = "us-east-1"
}

resource "null_resource" "null_resource_provisioner" {
  provisioner "local-exec" {
    command = "echo null resources are now provisioned"
  }
}`),
		},
	} {
		out, err := TFLint(test.in)
		if test.err == nil {
			assert.Equal(t, string(test.out), string(out), "out must match")
		} else {
			assert.Equal(t, test.err, err, "err must match")
		}
	}
}
