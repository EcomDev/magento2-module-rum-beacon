import {Payload} from "./payload";
import {onLCP} from "web-vitals/attribution.js";

export default function(payload: Payload) {
    onLCP(metric => {
        payload.lcp = {
            value: metric.value,
            navigationType: metric.navigationType,
            load: metric.attribution.resourceLoadDuration,
            loadDelay: metric.attribution.resourceLoadDelay,
            renderDelay: metric.attribution.elementRenderDelay,
            ttfb: metric.attribution.timeToFirstByte,
            target: metric.attribution.target ?? '',
            url: metric.attribution.url ?? ''
        }
    })
}
