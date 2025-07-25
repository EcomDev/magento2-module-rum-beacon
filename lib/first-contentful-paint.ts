import {Payload} from "./payload";
import {onFCP} from "web-vitals/attribution.js";

export default function(payload: Payload) {
    onFCP(metric => {
        payload.fcp = {
            value: metric.value,
            navigationType: metric.navigationType,
            renderDelay: metric.attribution.firstByteToFCP,
            ttfb: metric.attribution.timeToFirstByte
        }
    })
}
