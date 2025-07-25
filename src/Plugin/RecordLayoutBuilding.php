<?php

/**
 * Copyright © EcomDev B.V. All rights reserved.
 * See LICENSE for license details.
 */

declare(strict_types=1);

namespace EcomDev\RUMBeacon\Plugin;

use EcomDev\RUMBeacon\Service\MeasurementAggregator;
use Magento\Framework\View\Layout\BuilderInterface;

class RecordLayoutBuilding
{
    private float $timer = 0.0;

    public function __construct(
        private readonly MeasurementAggregator $measurementStorage,
    )
    {

    }

    public function beforeBuild(BuilderInterface $subject): array
    {
        $this->timer = hrtime(true);
        return [];
    }

    public function afterBuild(BuilderInterface $subject, $result)
    {
        $this->measurementStorage->recordSingle(
            'layoutBuild',
            hrtime(true) - $this->timer
        );
        return $result;
    }
}
