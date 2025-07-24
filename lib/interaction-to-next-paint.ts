import {InteractionToNextPaint, Payload} from "./payload";
import {onINP} from "web-vitals/attribution.js";

export default function(payload: Payload) {
    onINP(metric => {
        const script = metric.attribution.longestScript;

        const inp: InteractionToNextPaint = {
            value: metric.value,
            navigationType: metric.navigationType,
            intersection: script?.intersectingDuration ?? 0,
            target: metric.attribution.interactionTarget
        }

        if (script) {
            try {
                const url = new URL(script.entry.sourceURL);
                inp.script_domain = url.host;
                inp.script_path = url.pathname;
            } catch (e) {
            }

            inp.affected_part = script.subpart;
        }

        payload.inp = inp;
    })
}
