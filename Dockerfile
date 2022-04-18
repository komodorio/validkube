FROM golang:1.17
RUN apt-get update && apt-get install unzip
ENV BIN_DIR="/validiac/bin"
RUN mkdir -p ${BIN_DIR}
ENV GOOS=linux
ENV GOARCH=amd64
WORKDIR /validiac
COPY go.mod go.sum Makefile .tflint.hcl ./
RUN go mod download
RUN make -e deps
COPY backend/ ./backend/
RUN ls -lr ./
RUN make -e build && make -e test
RUN chmod +x ./bin/validiac

FROM alpine:3.14
RUN apk add -u ca-certificates git graphviz msttcorefonts-installer
RUN update-ms-fonts && fc-cache -f
COPY --from=0 /validiac/bin/* /validiac/bin/
ENV HOME="/validiac/bin/"
ENV BIN_PATH="/validiac/bin/"
RUN /validiac/bin/tflint --init -c /validiac/bin/.tflint.hcl
ENV XDG_CACHE_HOME="/tmp/.cache"
ENV XDG_DATA_HOME="/tmp/.data"
ENTRYPOINT ["/validiac/bin/validiac"]
