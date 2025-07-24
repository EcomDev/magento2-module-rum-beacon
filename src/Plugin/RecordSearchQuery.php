<?php

/**
 * Copyright © EcomDev B.V. All rights reserved.
 * See LICENSE for license details.
 */

declare(strict_types=1);

namespace EcomDev\RUMBeacon\Plugin;

use EcomDev\RUMBeacon\Service\MeasurementAggregator;
use EcomDev\RUMBeacon\State\CurrentPageInfo;
use Magento\Framework\Search\RequestInterface;
use Magento\Framework\Search\ResponseInterface;
use Magento\Framework\Search\SearchEngineInterface;
use Magento\Framework\View\Layout\BuilderInterface;
use Magento\Search\Api\SearchInterface;

class RecordSearchQuery
{
    private float $timer = 0.0;

    public function __construct(
        private readonly MeasurementAggregator $measurementStorage,
        private readonly CurrentPageInfo $currentPageInfo,
    )
    {

    }

    public function beforeSearch(SearchEngineInterface $searchEngine, RequestInterface $request): array
    {
        $this->timer = hrtime(true);
        return [$request];
    }

    public function afterSearch(SearchEngineInterface $searchEngine, ResponseInterface $result)
    {
        $this->measurementStorage->recordAggregate(
            'search',
            hrtime(true) - $this->timer
        );

        foreach ($result->getAggregations()->getBuckets() as $bucket) {
            if (!$bucket->getValues()) {
                continue;
            }

            if (!str_ends_with($bucket->getName(), '_bucket')) {
                continue;
            }

            $attributeCode = substr($bucket->getName(), 0, -7);
            if ($attributeCode === 'category') {
                continue;
            }

            $this->currentPageInfo->info['allowedQueryParams'][] = $attributeCode;
        }

        return $result;
    }
}
