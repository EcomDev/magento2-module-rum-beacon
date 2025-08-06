import {Payload, TimeToFirstByte} from "./payload";
import {onTTFB} from "web-vitals/attribution.js";

const isInteger = /^[0-9]+$/
const cacheTiming = 'cache';
const cacheHitValue = 'hit';

export default function(payload: Payload) {
    onTTFB(metric => {
         const ttfb: TimeToFirstByte = {
            value: metric.value,
            cache: metric.attribution.cacheDuration,
            dns: metric.attribution.dnsDuration,
            connection: metric.attribution.connectionDuration,
            request: metric.attribution.requestDuration,
            waiting: metric.attribution.waitingDuration,
            isCached: false,
            navigationType: metric.navigationType,
            serverTiming: {}
        }

        if (metric.attribution.navigationEntry) {
            let maxTiming = 0;
            for (const { duration, description, name } of metric.attribution.navigationEntry.serverTiming) {
                let serverTiming: number|string|boolean = true;
                if (duration > 0.0) {
                    serverTiming = duration;
                    maxTiming = Math.max(maxTiming, duration);
                } else if (duration <= 0.0 && isInteger.test(description)) {
                    serverTiming = parseInt(description);
                } else if (name === cacheTiming) {
                    serverTiming = description === cacheHitValue;
                    ttfb.isCached = <boolean>serverTiming;
                } else if (description) {
                    serverTiming = description;
                }

                ttfb.serverTiming[name] = serverTiming;
            }

            // If waiting time is less than max server metric, it is probably a cache hit
            if (ttfb.isCached === false
                && ttfb.request > 0.0
                && ttfb.request < maxTiming) {
                ttfb.isCached = true;
            }
        }

        payload.ttfb = ttfb;
        payload.pageInfo.isCached = ttfb.isCached;
    }, {
        reportAllChanges: true
    })
}

