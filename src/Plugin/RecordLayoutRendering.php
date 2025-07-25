<?php

/**
 * Copyright © EcomDev B.V. All rights reserved.
 * See LICENSE for license details.
 */

declare(strict_types=1);

namespace EcomDev\RUMBeacon\Plugin;

use EcomDev\RUMBeacon\Service\MeasurementAggregator;
use Magento\Framework\View\LayoutInterface;

class RecordLayoutRendering
{
    private float $timer = 0.0;

    public function __construct(
        private readonly MeasurementAggregator $measurementStorage,
    )
    {

    }

    public function beforeGetOutput(): array
    {
        $this->timer = hrtime(true);
        return [];
    }

    public function afterGetOutput(LayoutInterface $layout, $result)
    {
        $this->measurementStorage->recordSingle(
            'layoutRender',
            hrtime(true) - $this->timer
        );

        return $result;
    }
}
