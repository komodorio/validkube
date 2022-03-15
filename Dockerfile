FROM golang:1.17
RUN apt-get update && apt-get install unzip
ENV BIN_DIR="/validiac/bin"
RUN mkdir -p ${BIN_DIR}
ENV GOOS=linux
ENV GOARCH=amd64
WORKDIR /validiac
COPY go.mod go.sum Makefile ./
RUN go mod download
RUN make -e deps
COPY backend/ ./backend/
COPY .tflint.hcl ./
RUN ls -lr ./
RUN make -e build && make -e test
RUN chmod +x ./bin/validiac

FROM alpine:3.14
RUN apk add -u ca-certificates git
COPY --from=0 /validiac/bin/* /validiac/bin/

#RUN tflint --init
COPY .tflint.hcl validiac/.tflint.hcl
ENV HOME="/validiac/bin/"
WORKDIR /validiac
RUN ./bin/tflint-* --init

WORKDIR /
ENTRYPOINT ["/bin/sh", "-c", "'/validiac/bin/validiac'"]
