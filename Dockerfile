ARG BUILDER_IMAGE
FROM alpine:3.14 as deps
RUN apk --no-cache add curl
RUN curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin v0.22.0
RUN wget https://github.com/instrumenta/kubeval/releases/latest/download/kubeval-linux-amd64.tar.gz
RUN tar xf kubeval-linux-amd64.tar.gz
RUN cp kubeval /usr/local/bin

FROM golang:1.17

ARG FUNCTION_DIR="/var/task"
RUN mkdir -p ${FUNCTION_DIR}

COPY /bin/lambda ${FUNCTION_DIR}


COPY --from=deps /usr/local/bin/trivy /usr/local/bin/trivy
RUN chmod +x /usr/local/bin/trivy
COPY --from=deps /usr/local/bin/kubeval /usr/local/bin/kubeval
RUN chmod +x /usr/local/bin/kubeval


# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "/var/task/lambda" ]