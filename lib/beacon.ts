import {loadConfiguration} from "./configuration";
import collectPageData from "./page-info";
import {canSend, Payload, send} from "./payload";
import timeToFirstByte from "./time-to-first-byte";
import firstContentfulPaint from "./first-contentful-paint";
import largestContentfulPaint from "./largest-contentful-paint";
import comulativeLayoutShift from "./comulative-layout-shift";
import interactionToNextPaint from "./interaction-to-next-paint";


/**
 * Main beacon routine
 *
 * Sets up event handers and send data to external service when page visibility changes
 */
function initializeIngestor() {
    const config = loadConfiguration();

    if (config === false) {
        return;
    }

    const payload: Payload = {
        pageInfo: collectPageData(config)
    };

    timeToFirstByte(payload);
    firstContentfulPaint(payload);
    largestContentfulPaint(payload);
    comulativeLayoutShift(payload);
    interactionToNextPaint(payload);

    addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            if (canSend(payload)) {
                send(config, payload)
            }
        }
    });
}

// Make sure we don't block main thread on load
setTimeout(initializeIngestor);
