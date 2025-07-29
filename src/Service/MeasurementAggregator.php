<?php

/**
 * Copyright © EcomDev B.V. All rights reserved.
 * See LICENSE for license details.
 */

declare(strict_types=1);

namespace EcomDev\RUMBeacon\Service;

class MeasurementAggregator
{
    private const string FORMAT_DURATION = '%s;dur=%.2f';
    private const string FORMAT_COUNTER = '%sCount;desc=%d';

    private array $timing = [];
    private array $counters = [];

    public function recordSingle(string $type, float $time): void
    {
        $this->timing[$type] = ($this->timing[$type] ?? 0) + ($time / 1e6);
    }


    public function recordAggregate(string $type, float $time): void
    {
        $this->timing[$type] = ($this->timing[$type] ?? 0) + ($time / 1e6);
        $this->counters[$type] = ($this->counters[$type] ?? 0) + 1;
    }

    public function setAggregate(string $type, float $time): void
    {
        $this->timing[$type] = $time;
    }

    public function renderTimingHeader(): string
    {
        $serverTimings = [];
        foreach ($this->timing as $type => $time) {
            if (isset($this->counters[$type])) {
                $serverTimings[] = sprintf(
                    self::FORMAT_COUNTER,
                    $type,
                    $this->counters[$type]
                );
            }

            $serverTimings[] = sprintf(
                self::FORMAT_DURATION,
                $type,
                $time
            );
        }

        $this->timing = [];
        $this->counters = [];

        return implode(", ", $serverTimings);
    }
}
