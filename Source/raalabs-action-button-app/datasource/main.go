package main

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/datasource"
	"github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/backend/resource/httpadapter"
)

func main() {
	if err := datasource.Manage("raalabs-action-button-datasource", NewApp, datasource.ManageOpts{}); err != nil {
		log.DefaultLogger.Error(err.Error())
		os.Exit(1)
	}
}

type App struct {
	backend.CallResourceHandler
	config DataSourceConfig
}

func NewApp(settings backend.DataSourceInstanceSettings) (instancemgmt.Instance, error) {
	config := DataSourceConfig{}
	if err := json.Unmarshal(settings.JSONData, &config); err != nil {
		return nil, err
	}

	app := App{
		config: config,
	}

	mux := http.NewServeMux()

	mux.HandleFunc("/call", func(w http.ResponseWriter, r *http.Request) {
		log.DefaultLogger.Info("Handling /call resources request")

		contentType := r.Header["Content-Type"]
		if len(contentType) != 1 || contentType[0] != "application/json" {
			http.Error(w, "Only 'application/json' is supported", http.StatusBadRequest)
			log.DefaultLogger.Error("Received /call request with non-json content", "content-type", contentType)
			return
		}

		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			log.DefaultLogger.Error("Failed to read request body", "error", err)
			return
		}

		request := CallRequestBody{}
		if err := json.Unmarshal(body, &request); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			log.DefaultLogger.Error("Failed to parse request body", "error", err)
			return
		}

		response, err := PerformCall(app.config, request)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			log.DefaultLogger.Error("Failed to perform call", "error", err)
			return
		}

		body, err = json.Marshal(response)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			log.DefaultLogger.Error("Failed to encode response", "error", err)
			return
		}

		log.DefaultLogger.Debug("Call performed", "request", request, "response", response)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, err = w.Write(body)

		if err != nil {
			log.DefaultLogger.Error("Failed to write response body", "error", err)
			return
		}
	})

	app.CallResourceHandler = httpadapter.New(mux)

	return &app, nil
}

func (a *App) Dispose() {
	log.DefaultLogger.Info("RAABUTTON DISPOSE")
}

func (a *App) CheckHealth(_ context.Context, _ *backend.CheckHealthRequest) (*backend.CheckHealthResult, error) {
	log.DefaultLogger.Debug("Checking health")

	ok, message := a.config.CheckEndpoints()
	if !ok {
		log.DefaultLogger.Error("Config is not healthy")
		return &backend.CheckHealthResult{
			Status:  backend.HealthStatusError,
			Message: message,
		}, nil
	}

	return &backend.CheckHealthResult{
		Status:  backend.HealthStatusOk,
		Message: "Endpoints are ready!",
	}, nil
}
