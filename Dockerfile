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
RUN ls -lr ./
RUN make -e build && make -e test
RUN chmod +x ./bin/validiac

FROM scratch
COPY --from=0 /validiac/bin/* /validiac/bin/
ENTRYPOINT ["/validiac/bin/validiac"]
