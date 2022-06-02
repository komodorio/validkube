package kubescape

// PostureReport posture scanning report structure
type KubescapeResults struct {
	Results []Result `json:"results,omitempty"`
}

type Result struct {
	ResourceID         string                      `json:"resourceID"` // <api-group>/<namespace>/<kind>/<name>
	AssociatedControls []ResourceAssociatedControl `json:"controls,omitempty"`
}

// ResourceAssociatedControl control that is associated to a resource
type ResourceAssociatedControl struct {
	ControlID               string                   `json:"controlID"`
	Name                    string                   `json:"name"`
	ResourceAssociatedRules []ResourceAssociatedRule `json:"rules,omitempty"`
}

// ResourceAssociatedRule failed rule that is associated to a resource
type ResourceAssociatedRule struct {
	Name                  string              `json:"name"` // rule name
	Status                string              `json:"status"`
	Paths                 []PosturePaths      `json:"paths,omitempty"`
	ControlConfigurations map[string][]string `json:"controlConfigurations,omitempty"`
}

type PosturePaths struct {
	// must have FailedPath or FixPath, not both
	FailedPath string  `json:"failedPath,omitempty"`
	FixPath    FixPath `json:"fixPath,omitempty"`
	FixCommand string  `json:"fixCommand,omitempty"`
}
type FixPath struct {
	Path  string `json:"path"`
	Value string `json:"value"`
}

type Display struct {
	Resources []Resource `json:"-"`
}

type Resource struct {
	ApiVersion      string    `json:"apiVersion"`
	Kind            string    `json:"kind"`
	Name            string    `json:"name"`
	Namespace       string    `json:"namespace,omitempty"`
	Summary         Summary   `json:"summary,omitempty"` // TODO - support summary
	ControlsSummary []Control `json:"controls"`
}

type Control struct {
	ControlName string   `json:"controlName"`
	Docs        string   `json:"docs"`
	Paths       []string `json:"paths,omitempty"`
	// Remediation string `json:"remediation,omitempty"` // TODO - support remediation
	// Severity    string `json:"severity,omitempty"` // TODO - support severity
	// Status      string `json:"status,omitempty"` // TODO - support status
}

type Summary struct {
	Failed int `json:"failed"`
	Passed int `json:"passed"`
	All    int `json:"all"`
}
