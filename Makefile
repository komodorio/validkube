BIN_DIR := $(shell pwd)/bin
UNAME_M := $(shell uname -m)
UNAME_S := $(shell uname -s | tr '[:upper:]' '[:lower:]')
TFLINT_VERSION := 0.34.1
INFRACOST_VERSION := 0.9.19
TFSEC_VERSION := 1.5.0
INFRAMAP_VERSION := 0.6.7
TFLINT_EXEC := $(BIN_DIR)/tflint-$(TFLINT_VERSION)
TFSEC_EXEC := $(BIN_DIR)/tfsec-$(TFSEC_VERSION)
INFRAMAP_EXEC := $(BIN_DIR)/inframap-$(INFRAMAP_VERSION)
INFRACOST_EXEC := $(BIN_DIR)/infracost-$(INFRACOST_VERSION)

all: check build

.PHONY: check
check:
ifneq ($(UNAME_M),x86_64)
	@echo "Unsupported architecture ${UNAME_M}"
	@exit 1
endif

ifeq ($(UNAME_S),linux)
	@exit 0
else ifeq ($(UNAME_S),darwin)
	@exit 0
else
	@echo "Unsupported Operating System ${UNAME_S}"
	@exit 2
endif

$(TFLINT_EXEC): check
	$(shell wget -O- https://github.com/terraform-linters/tflint/releases/download/v${TFLINT_VERSION}/tflint_${UNAME_S}_amd64.zip | funzip > ${TFLINT_EXEC})
	@chmod +x ${TFLINT_EXEC}

$(TFSEC_EXEC): check
	$(shell wget -O- https://github.com/aquasecurity/tfsec/releases/download/v${TFSEC_VERSION}/tfsec-${UNAME_S}-amd64 > ${TFSEC_EXEC})
	@chmod +x ${TFSEC_EXEC}

$(INFRACOST_EXEC): check
	$(shell wget -O- https://github.com/infracost/infracost/releases/download/v${INFRACOST_VERSION}/infracost-${UNAME_S}-amd64.tar.gz | tar zxfO - > ${INFRACOST_EXEC})
	@chmod +x ${INFRACOST_EXEC}

$(INFRAMAP_EXEC): check
	$(shell wget -O- https://github.com/cycloidio/inframap/releases/download/v${INFRAMAP_VERSION}/inframap-${UNAME_S}-amd64.tar.gz | tar xzfO - > ${INFRAMAP_EXEC})
	@chmod +x ${INFRAMAP_EXEC}

.PHONY: deps test build clean clean-all
deps: $(TFLINT_EXEC) $(TFSEC_EXEC) $(INFRACOST_EXEC) $(INFRAMAP_EXEC)

test:
	go test -ldflags "-X github.com/gofireflyio/validiac/backend/api.TFLintExec=${TFLINT_EXEC} -X github.com/gofireflyio/validiac/backend/api.TFSecExec=${TFSEC_EXEC} -X github.com/gofireflyio/validiac/backend/api.InfraMapExec=${INFRAMAP_EXEC} -X github.com/gofireflyio/validiac/backend/api.InfraCostExec=${INFRACOST_EXEC}" ./...

lint:
	golangci-lint run ./...

build:
	CGO_ENABLED=0 go build -tags netgo -ldflags "-s -w -X github.com/gofireflyio/validiac/backend/api.TFLintExec=${TFLINT_EXEC} -X github.com/gofireflyio/validiac/backend/api.TFSecExec=${TFSEC_EXEC} -X github.com/gofireflyio/validiac/backend/api.InfraMapExec=${INFRAMAP_EXEC} -X github.com/gofireflyio/validiac/backend/api.InfraCostExec=${INFRACOST_EXEC}" -o ${BIN_DIR}/validiac backend/main.go
	${TFLINT_EXEC} --init -c ".tflint.hcl"

docker:
	docker build -t gofireflyio/validiac:latest .

clean:
	rm $(BIN_DIR)/validiac

clean-all:
	rm -rf $(BIN_DIR)/
