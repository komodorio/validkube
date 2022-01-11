package utils

import (
	"encoding/json"
	"fmt"
)

func dumpMap(space string, m map[string]interface{}) {
	for _, v := range m {
		if mv, ok := v.(map[string]interface{}); ok {
			dumpMap(space+"\t", mv)
		}
	}
}

func InterfaceToBytes(inter interface{}) []byte {
	return []byte(fmt.Sprintf("%v", inter))
}

func JsonToMap(jsonData []byte) (map[string]interface{}, error) {
	jsonMap := make(map[string]interface{})
	err := json.Unmarshal(jsonData, &jsonMap)
	if err != nil {
		return jsonMap, nil
	}
	dumpMap("", jsonMap)
	return jsonMap, nil
}
