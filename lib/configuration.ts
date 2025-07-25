import { SimpleDictionary } from "./common";

interface AllowedQueryParameters {
    [Key: string]: boolean,
}

export interface BeaconConfig {
    allowedQueryParams: AllowedQueryParameters,
    isEnabled: boolean,
    isUrlCollected: boolean,
    ingestionUrl: string,
    pageInfo: SimpleDictionary
}

export function loadConfiguration(): BeaconConfig | false {
    const beaconIngestElement = document.querySelector('script[type="ecomdev/rum-beacon-ingest"]');
    if (!beaconIngestElement) {
        return false;
    }

    const beaconConfig: BeaconConfig = JSON.parse(beaconIngestElement.textContent);

    if (!beaconConfig.isEnabled || !beaconConfig.ingestionUrl || !beaconConfig.pageInfo) {
        return false;
    }

    return beaconConfig;
}
