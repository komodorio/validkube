package api

var BIN_PATH = getEnv("BIN_PATH", "./bin")

func Init() ([]byte, error){
    return tflintInit()
}
