import * as tc from "telemetryclient-team-services-extension";

export const settings: tc.TelemetryClientSettings = {
    key: "__InstrumentationKey__",
    extensioncontext: "build monitoring",
    disableTelemetry: "false",
    disableAjaxTracking: "false",
    enableDebug: "false"
};