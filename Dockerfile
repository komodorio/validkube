ARG BUILDER_IMAGE
FROM alpine:3.14 as deps
RUN apk --no-cache add curl
RUN curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin v0.25.3

RUN wget https://github.com/instrumenta/kubeval/releases/download/v0.16.1/kubeval-linux-amd64.tar.gz
RUN tar xf kubeval-linux-amd64.tar.gz
RUN cp kubeval /usr/local/bin

RUN wget https://github.com//yannh/kubeconform/releases/download/v0.4.14/kubeconform-linux-amd64.tar.gz
RUN tar xf kubeconform-linux-amd64.tar.gz
RUN cp kubeconform /usr/local/bin

RUN wget https://github.com/FairwindsOps/polaris/releases/download/5.0.0/polaris_linux_amd64.tar.gz
RUN tar xf polaris_linux_amd64.tar.gz
RUN cp polaris /usr/local/bin

RUN curl -L https://github.com/armosec/kubescape/releases/download/v2.0.158/kubescape-ubuntu-latest -o kubescape
RUN cp kubescape /usr/local/bin/kubescape

FROM golang:1.17

ARG FUNCTION_DIR="/var/task"
RUN mkdir -p ${FUNCTION_DIR}

RUN mkdir -p /app
WORKDIR /app
COPY go.mod go.mod
COPY go.sum go.sum

COPY ./backend ./backend
RUN GOARCH=amd64 GOOS=linux go build -ldflags="-s -w" -o /var/task/lambda ./backend/endpoints/aws/lambda.go


COPY --from=deps /usr/local/bin/trivy /usr/local/bin/trivy
RUN chmod +x /usr/local/bin/trivy
COPY --from=deps /usr/local/bin/kubeval /usr/local/bin/kubeval
RUN chmod +x /usr/local/bin/kubeval
COPY --from=deps /usr/local/bin/polaris /usr/local/bin/polaris
RUN chmod +x /usr/local/bin/polaris
COPY --from=deps /usr/local/bin/kubescape /usr/local/bin/kubescape
RUN chmod +x /usr/local/bin/kubescape
COPY --from=deps /usr/local/bin/kubeconform /usr/local/bin/kubeconform
RUN chmod +x /usr/local/bin/kubeconform


# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
ENTRYPOINT [ "/var/task/lambda" ]
