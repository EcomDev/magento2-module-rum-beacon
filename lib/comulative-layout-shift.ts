import {Payload} from "./payload";
import {onCLS} from "web-vitals/attribution.js";

export default function (payload: Payload) {
    onCLS(metric => {
        payload.cls = {
            value: metric.value,
            navigationType: metric.navigationType,
            target: metric.attribution.largestShiftTarget ?? '',
            time: metric.attribution.largestShiftTime ?? 0
        }
    })
}
