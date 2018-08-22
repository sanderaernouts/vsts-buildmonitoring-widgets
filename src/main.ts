import * as tc from "telemetryclient-team-services-extension";
import telemetryClientSettings = require("./telemetryClientSettings");
import BuildApi = require("TFS/Build/RestClient");
import Contracts = require("TFS/Build/Contracts");
import Controls = require("VSS/Controls");
import Grids = require("VSS/Controls/Grids");

export class Row {
    QueueTime: Date;
    Definition: string;
    BuildNumber: string;
    Result: string;
}

function Map(build: Contracts.Build) {
    let row = new Row();
    row.QueueTime = build.queueTime;
    row.Definition = build.definition.name;
    row.BuildNumber = build.buildNumber;

    switch (build.result) {
        case Contracts.BuildResult.Succeeded:
        row.Result = "succeeded";
        break;

        case Contracts.BuildResult.PartiallySucceeded:
        row.Result = "partially succeeded";
        break;

        case Contracts.BuildResult.Failed:
        row.Result = "failed";
        break;

        case Contracts.BuildResult.Canceled:
        row.Result = "canceled";
        break;

        case Contracts.BuildResult.None:
        row.Result = "none";
        break;

        default:
        row.Result = "unkown";
        break;
    }

    return row;
}

function Render(WidgetHelpers, widgetSettings) {
    const projectId = VSS.getWebContext().project.id;

    const container = $("#query-info-container");
    container.empty();

    BuildApi.getClient().getBuilds(
        projectId,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        Contracts.BuildStatus.Completed,
        Contracts.BuildResult.Failed | Contracts.BuildResult.PartiallySucceeded,
        undefined,
        undefined,
        undefined,
        undefined,
        1,
        Contracts.QueryDeletedOption.ExcludeDeleted ,
        Contracts.BuildQueryOrder.FinishTimeDescending
    ).then(builds  => {
    const container = $("#query-info-container");
    container.empty();

    let rows = builds.map(x => Map(x));

    let gridOptions: Grids.IGridOptions = {
        height: "100%",
        width: "100%",
        source: rows,
        columns: [
            { text: "Time", width: 200, index: "QueueTime" },
            { text: "Definition", width: 200, index: "Definition"},
            { text: "Build", width: 200, index: "BuildNumber" },
            { text: "Result", width: 200, index: "Result" }
        ]
    };

    Controls.create(Grids.Grid, container, gridOptions);
    return WidgetHelpers.WidgetStatusHelper.Success();

    }, function (error) {
        // Use the widget helper and return failure as Widget Status
        return WidgetHelpers.WidgetStatusHelper.Failure(error.message);
    });
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