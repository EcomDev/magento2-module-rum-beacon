import {SimpleDictionary} from "./common";
import {BeaconConfig} from "./configuration";

export interface QueryParameters {
    [Key: string]: string,
}

export interface PageInfo {
    type: string,
    store: string,
    identifier?: string,
    request_uri?: string,
    request_query?: QueryParameters,
    isCached: boolean,
    info: SimpleDictionary
}

export interface Payload {
    ttfb?: TimeToFirstByte,
    fcp?: FirstContentfulPaint,
    lcp?: LargestContentfulPaint,
    cls?: ComulativeLayoutShift,
    inp?: InteractionToNextPaint,
    pageInfo: PageInfo
}

interface Metric {
    value: number,
    navigationType: string,
}

export interface TimeToFirstByte extends Metric {
    waiting: number,
    cache: number,
    connection: number,
    request: number,
    isCached: boolean,
    serverTiming: SimpleDictionary
}

export interface FirstContentfulPaint extends Metric {
    ttfb: number,
    renderDelay: number,
}

export interface LargestContentfulPaint extends FirstContentfulPaint {
    load: number,
    loadDelay: number,
    url: string,
    target: string,
}

export interface ComulativeLayoutShift extends Metric {
    time: number,
    target: string,
}

export interface InteractionToNextPaint extends Metric {
    target: string,
    script_path?: string,
    script_domain?: string,
    affected_part?: string,
    intersection: number
}

export function canSend(payload: Payload): boolean {
    return !!payload.ttfb || !!payload.fcp || !!payload.lcp || !!payload.cls || !!payload.inp;
}

export function send(config: BeaconConfig, payload: Payload) {
    const requestBody = JSON.stringify(payload);
    navigator.sendBeacon(
        config.ingestionUrl,
        requestBody
    );

    delete payload.ttfb;
    delete payload.fcp;
    delete payload.lcp;
    delete payload.cls;
    delete payload.inp;
}
