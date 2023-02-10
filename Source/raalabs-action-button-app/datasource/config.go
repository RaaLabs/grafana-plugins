package main

import (
	"fmt"
	"net"
	"net/url"

	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
)

type DataSourceConfig struct {
	Endpoints []EndpointConfig `json:"endpoints"`
}

type EndpointConfig struct {
	Id   string `json:"id"`
	Name string `json:"name"`
	URL  string `json:"url"`
}

func (dsc *DataSourceConfig) CheckEndpoints() (result bool, message string) {
	message = ""
	result = true

	seen := make(map[string]bool)

	for _, endpoint := range dsc.Endpoints {
		if parsedURL, err := url.Parse(endpoint.URL); err != nil {
			message = fmt.Sprintf("%s\nCannot parse URL '%s' for endpoint '%s'. %s.", message, endpoint.URL, endpoint.Id, err.Error())
			log.DefaultLogger.Error("Failed to parse host for endpoint", "endpoint", endpoint.Id, "url", endpoint.URL, "error", err)
			result = false
		} else {
			addrs, err := net.LookupHost(parsedURL.Hostname())
			if err != nil {
				message = fmt.Sprintf("%s\nFailed to look up host '%s' for endpoint '%s'. %s.", message, parsedURL.Hostname(), endpoint.Id, err.Error())
				log.DefaultLogger.Error("Failed to lookup hosts for endpoint", "endpoint", endpoint.Id, "host", parsedURL.Hostname(), "error", err)
				result = false
			} else if len(addrs) < 1 {
				message = fmt.Sprintf("%s\nNo addresses found for host '%s' for endpoint '%s'. %s.", message, parsedURL.Hostname(), endpoint.Id, err.Error())
				log.DefaultLogger.Error("No addresses found for endpoint", "endpoint", endpoint.Id, "host", parsedURL.Hostname())
				result = false
			} else {
				log.DefaultLogger.Info("Resolved hosts for endpoint", "endpoint", endpoint.Id, "host", parsedURL.Hostname(), "addresses", addrs)
			}
		}

		if seen[endpoint.Id] {
			message = fmt.Sprintf("%s\nEndpoint id '%s' is duplicated.", message, endpoint.Id)
			log.DefaultLogger.Error("Endpoint id is duplicated", "endpoint", endpoint.Id)
			result = false
		} else {
			seen[endpoint.Id] = true
		}
	}

	return result, message
}
