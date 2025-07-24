import { BeaconConfig } from "./configuration";
import { PageInfo } from "./payload";

/**
 * Collects request URI by filtering out query parameters that are not in allowed list
 *
 * It is important to only include known safe parameters to prevent
 * any PII information leaking into storage
 */
export default function(
    config: BeaconConfig
): PageInfo {
    const pageInfo: PageInfo = {
        type: <string>config.pageInfo.type,
        store: <string>config.pageInfo.store,
        info: Object.assign({}, config.pageInfo),
        isCached: false
    };

    if (pageInfo.info.identifer) {
        pageInfo.identifier = <string>pageInfo.info.identifer;
    }

    delete pageInfo.info.type;
    delete pageInfo.info.identifer;
    delete pageInfo.info.store;

    if (!config.isUrlCollected) {
        return pageInfo;
    }

    pageInfo.request_uri = location.pathname;
    pageInfo.request_query = {};

    if (location.search) {
        const params = new URLSearchParams(location.search);
        params.forEach((value, key) => {
            if (!config.allowedQueryParams[key]) {
                return;
            }
            pageInfo.request_query[key] = value;
        });
    }

    return pageInfo;
}
