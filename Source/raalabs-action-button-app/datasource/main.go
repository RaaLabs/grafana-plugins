package main

import (
	"context"
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
	log.DefaultLogger.Warn("RAABUTTON STARTING UP")
	if err := datasource.Manage("raalabs-action-button-datasource", NewApp, datasource.ManageOpts{}); err != nil {
		log.DefaultLogger.Error(err.Error())
		os.Exit(1)
	}
}

type App struct {
	backend.CallResourceHandler
}

func NewApp(settings backend.DataSourceInstanceSettings) (instancemgmt.Instance, error) {
	app := App{}

	mux := http.NewServeMux()

	mux.HandleFunc("/call", func(w http.ResponseWriter, r *http.Request) {
		log.DefaultLogger.Info("RAABUTTON CALL")

		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		log.DefaultLogger.Info("RAABUTTON input data", "data", string(body))
		log.DefaultLogger.Info("Instance Settings", "settings", string(settings.JSONData))

		// w.Header().Add("Content-Type", "application/json")
		// if _, err := w.Write([]byte(`{"message": "ok"}`)); err != nil {
		// 	http.Error(w, err.Error(), http.StatusInternalServerError)
		// 	return
		// }
		w.WriteHeader(http.StatusOK)
	})

	app.CallResourceHandler = httpadapter.New(mux)

	log.DefaultLogger.Info("RAABUTTON NEWAPP - I AM TA DASS")

	log.DefaultLogger.Info("Instance Settings", "settings", string(settings.JSONData))

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
