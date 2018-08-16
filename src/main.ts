import * as tc from "telemetryclient-team-services-extension";
import telemetryClientSettings = require("./telemetryClientSettings");
import BuildApi = require("TFS/Build/RestClient");
import Controls = require("VSS/Controls");
import Grids = require("VSS/Controls/Grids");

function Render(WidgetHelpers, widgetSettings) {
    const projectId = VSS.getWebContext().project.id;

    const container = $("#query-info-container");
    container.empty();

    let gridOptions: Grids.IGridOptions = {
        height: "100%",
        width: "100%",
        source: function () {
          let result = [], i;
          for (i = 0; i < 100; i++) {
            result[result.length] = [i, "Column 2 text" + i, "Column 3 " + Math.random()];
          }

          return result;
          } (),
          columns: [
            { text: "Column 1", index: 0, width: 50 },
            { text: "Column 2", index: 1, width: 200, canSortBy: false },
            { text: "Column 3", index: 2, width: 450 }]
        };

        let grid = Controls.create(Grids.Grid, container, gridOptions);
        return WidgetHelpers.WidgetStatusHelper.Success();
    /*
        BuildApi.getClient().getBuilds(projectId).then(function(builds) {
        const container = $("#query-info-container");
        container.empty();

        let gridOptions: Grids.IGridOptions = {
            height: "100%",
            width: "100%",
            source: builds,
            columns: [
                { text: "Time", width: 200, index: "queueTime" },
                { text: "Definition", width: 200, index: "definition"},
                { text: "Build", width: 200, index: "buildNumber" },
                { text: "Result", width: 200, index: "result" }
            ]
        };

        Controls.create(Grids.Grid, container, gridOptions);
        return WidgetHelpers.WidgetStatusHelper.Success();

    }, function (error) {
        // Use the widget helper and return failure as Widget Status
        return WidgetHelpers.WidgetStatusHelper.Failure(error.message);
    });
    */
}

VSS.require("TFS/Dashboards/WidgetHelpers", function (WidgetHelpers) {
    WidgetHelpers.IncludeWidgetStyles();
    VSS.register("BrokenBuilds", function () {
        return {
            load: function (widgetSettings) {
                tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackPageView("BrokenBuilds.Index");

                const $title = $("h2.title");
                $title.text(widgetSettings.name);
                Render(WidgetHelpers, widgetSettings);
                return WidgetHelpers.WidgetStatusHelper.Success();
            },
            reload: function (widgetSettings) {
                const $title = $("h2.title");
                $title.text(widgetSettings.name);
                Render(WidgetHelpers, widgetSettings);
                return WidgetHelpers.WidgetStatusHelper.Success();
            }
        };
    });
    VSS.notifyLoadSucceeded();
});