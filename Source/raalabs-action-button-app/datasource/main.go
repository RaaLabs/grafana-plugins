package main

import (
	"context"
	"net/http"
	"os"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/app"
	"github.com/grafana/grafana-plugin-sdk-go/backend/instancemgmt"
	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
	"github.com/grafana/grafana-plugin-sdk-go/backend/resource/httpadapter"
)

func main() {
	log.DefaultLogger.Warn("RAABUTTON STARTING UP")
	if err := app.Manage("raalabs-action-button-datasource", NewApp, app.ManageOpts{}); err != nil {
		log.DefaultLogger.Error(err.Error())
		os.Exit(1)
	}
}

type App struct {
	backend.CallResourceHandler
}

func NewApp(_ backend.AppInstanceSettings) (instancemgmt.Instance, error) {
	app := App{}

	mux := http.NewServeMux()

	mux.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		log.DefaultLogger.Info("RAABUTTON PING")

		w.Header().Add("Content-Type", "application/json")
		if _, err := w.Write([]byte(`{"message": "ok"}`)); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	})

	app.CallResourceHandler = httpadapter.New(mux)

	log.DefaultLogger.Info("RAABUTTON NEWAPP")

	return &app, nil
}

func (a *App) Dispose() {
	log.DefaultLogger.Info("RAABUTTON DISPOSE")
}

func (a *App) CheckHealth(_ context.Context, _ *backend.CheckHealthRequest) (*backend.CheckHealthResult, error) {
	log.DefaultLogger.Info("RAABUTTON CHECKHEALTH")
	return &backend.CheckHealthResult{
		Status:  backend.HealthStatusOk,
		Message: "ok",
	}, nil
}
