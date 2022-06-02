package kubeneat

import (
	"github.com/stretchr/testify/assert"

	"os"
	"testing"
)

func TestSingleManifest(t *testing.T) {
	t.Run("Test Single Manifest", func(t *testing.T) {
		manifest, err := os.ReadFile("testdata/single_manifest.yaml")
		if err != nil {
			t.Errorf("Error reading manifest file: %s", err)
		}
		expectedManifest, err := os.ReadFile("testdata/expected/single_manifest.yaml")
		if err != nil {
			t.Errorf("Error reading manifest file: %s", err)
		}
		wrapper, _, err := NeatYAMLOrJSONWrapper(manifest)
		if err != nil {
			t.Errorf("Error parsing manifest: %s", err)
		}
		assert.Equal(t, string(expectedManifest), string(wrapper))
	})
}

func TestMultiManifest(t *testing.T) {
	t.Run("Test Multi Manifest yaml", func(t *testing.T) {
		manifest, err := os.ReadFile("testdata/multi_manifest.yaml")
		if err != nil {
			t.Errorf("Error reading manifest file: %s", err)
		}
		expectedManifest, err := os.ReadFile("testdata/expected/multi_manifest.yaml")
		if err != nil {
			t.Errorf("Error reading manifest file: %s", err)
		}
		wrapper, _, err := NeatYAMLOrJSONWrapper(manifest)
		if err != nil {
			t.Errorf("Error parsing manifest: %s", err)
		}
		assert.Equal(t, string(expectedManifest), string(wrapper))
	})
}
