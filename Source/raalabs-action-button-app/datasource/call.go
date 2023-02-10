package main

import (
	"fmt"
	"net/http"
)

type CallRequestBody struct {
	Endpoint string `json:"endpoint"`
	Method   string `json:"method"`
	Path     string `json:"path,omitempty"`
}

type CallResponseBody struct {
	StatusCode int `json:"statusCode"`
}

func PerformCall(config DataSourceConfig, call CallRequestBody) (*CallResponseBody, error) {
	endpoint, found := findEndpoint(config, call.Endpoint)
	if !found {
		return nil, fmt.Errorf("endpoint '%s' not configured", call.Endpoint)
	}

	// TODO: Deal with bodies and headers etc...

	request, err := http.NewRequest(call.Method, endpoint.URL+call.Path, nil)
	if err != nil {
		return nil, err
	}

	response, err := http.DefaultClient.Do(request)
	if err != nil {
		return nil, err
	}

	return &CallResponseBody{
		StatusCode: response.StatusCode,
	}, nil
}

func findEndpoint(config DataSourceConfig, id string) (*EndpointConfig, bool) {
	for _, endpoint := range config.Endpoints {
		if endpoint.Id == id {
			return &endpoint, true
		}
	}

	return nil, false
}
