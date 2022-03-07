FROM golang:1.17 AS builder
ARG OS="linux"
ARG ARCH="amd64"

WORKDIR /go/src/app
COPY go.mod go.sum Makefile ./
COPY backend ./
RUN go mod download
COPY . .
RUN SINGLE_TARGET=true make deps
RUN SINGLE_TARGET=true make build

FROM alpine:3.13

ARG OS="linux"
ARG ARCH="amd64"

WORKDIR /app
COPY --from=builder /go/src/app/bin/validiac /bin/validiac
RUN chmod +x /bin/validiac
ENTRYPOINT ["/bin/validiac"]
