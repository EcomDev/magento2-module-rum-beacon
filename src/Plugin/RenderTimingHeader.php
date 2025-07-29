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
        if (\class_exists('Tideways\Profiler', false)
            && \method_exists('Tideways\Profiler', 'getLayerMetrics')) {
            foreach (\Tideways\Profiler::getLayerMetrics() as $metric) {
                $name = match ($metric->name) {
                    'rdbms' => 'db',
                    default => $metric->name,
                };

                $this->measurementAggregator->setAggregate($name, $metric->wallTimeMicroseconds / 1e3);
            }
        }

        $timingHeader = $this->measurementAggregator->renderTimingHeader();
        if ($timingHeader) {
            $response->setHeader('Server-Timing', $timingHeader, true);
        }
        return $output;
    }
}
