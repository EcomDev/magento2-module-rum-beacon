<?php

/**
 * Copyright © EcomDev B.V. All rights reserved.
 * See LICENSE for license details.
 */

declare(strict_types=1);

namespace EcomDev\RUMBeacon\Plugin;

use EcomDev\RUMBeacon\Service\MeasurementAggregator;
use Magento\Framework\App\ResponseInterface;
use Magento\Framework\Controller\ResultInterface;

readonly class RenderTimingHeader
{
    public function __construct(
        private MeasurementAggregator $measurementAggregator,
    ) {
    }


    public function afterRenderResult(ResultInterface $subject, $output, ResponseInterface $response)
    {
        $timingHeader = $this->measurementAggregator->renderTimingHeader();
        if ($timingHeader) {
            $response->setHeader('Server-Timing', $timingHeader, true);
        }
        return $output;
    }
}
