import { describe, expect, it } from "vitest";
import collectPageInfo from "./page-info";
import { BeaconConfig } from "./configuration";

function configWithPageInfo(pageInfo: BeaconConfig["pageInfo"]): BeaconConfig {
    return {
        allowedQueryParams: {},
        isEnabled: true,
        isUrlCollected: false,
        ingestionUrl: "https://collector.example.test/rum-ingest",
        pageInfo
    };
}

describe("page info", () => {
    it("moves the identifier set by the module out of info", () => {
        const pageInfo = collectPageInfo(configWithPageInfo({
            type: "product",
            store: "default",
            identifier: "EXAMPLE-SKU-1",
            name: "Example Product"
        }));

        expect(pageInfo).toEqual({
            type: "product",
            store: "default",
            identifier: "EXAMPLE-SKU-1",
            info: {name: "Example Product"},
            isCached: false
        });
    });

    it("leaves the identifier out when the page has none", () => {
        const pageInfo = collectPageInfo(configWithPageInfo({
            type: "cms_page",
            store: "default"
        }));

        expect(pageInfo).toEqual({
            type: "cms_page",
            store: "default",
            info: {},
            isCached: false
        });
    });
});
