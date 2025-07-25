<?php

/**
 * Copyright © EcomDev B.V. All rights reserved.
 * See LICENSE for license details.
 */

declare(strict_types=1);

namespace EcomDev\RUMBeacon\ViewModel;

use EcomDev\RUMBeacon\State\CurrentPageInfo;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\UrlInterface;
use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Store\Model\ScopeInterface;
use Magento\Store\Model\Store;
use Magento\Store\Model\StoreManagerInterface;

readonly class BeaconInfo implements ArgumentInterface
{
    private const string CONFIG_IS_ENABLED = 'system/ecomdev_rumbeacon/enabled';
    private const string CONFIG_INGESTION_URL = 'system/ecomdev_rumbeacon/ingestion_url';

    public function __construct(
        private CurrentPageInfo $currentPageInfo,
        private ScopeConfigInterface $scopeConfig,
        private StoreManagerInterface $storeManager,
    ) {
    }

    public function ingestInfo(): array
    {
        $info = $this->currentPageInfo->info;

        $info['type'] ??= 'other';
        $info['store'] ??= $this->storeManager->getStore()->getCode();
        $isUrlCollected = match ($info['type']) {
            'product', 'category', 'cms_page', 'search' => true,
            default => false
        };
        $allowedQueryParams = [
            'q', 'p', 'product_list_order', 'product_list_mode', 'product_list_limit', 'cat'
        ];

        if (isset($info['allowedQueryParams'])) {
            $allowedQueryParams = [...$allowedQueryParams, ...$info['allowedQueryParams']];
            unset($info['allowedQueryParams']);
        }

        $allowedQueryParams = match ($info['type']) {
            'category', 'search' => array_combine(
                $allowedQueryParams,
                array_fill(0, count($allowedQueryParams), true)
            ),
            default => []
        };

        $ingestionUrl = $this->scopeConfig->getValue(self::CONFIG_INGESTION_URL, ScopeInterface::SCOPE_STORE);
        if (str_contains($ingestionUrl, Store::BASE_URL_PLACEHOLDER)) {
            $ingestionUrl = str_replace(
                Store::BASE_URL_PLACEHOLDER,
                $this->storeManager->getStore()->getBaseUrl(
                    UrlInterface::URL_TYPE_WEB,
                    true
                ),
                $ingestionUrl
            );
        }

        return [
            'pageInfo' => $info,
            'isUrlCollected' => $isUrlCollected,
            'allowedQueryParams' => $allowedQueryParams,
            'isEnabled' => $this->scopeConfig->isSetFlag(self::CONFIG_IS_ENABLED, ScopeInterface::SCOPE_STORE),
            'ingestionUrl' => $ingestionUrl,
        ];
    }

    public function ingestInfoJson(): string
    {
        return json_encode(
            $this->ingestInfo(),
            JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
        );
    }
}
