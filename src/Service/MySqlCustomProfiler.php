<?php

/**
 * Copyright © EcomDev B.V. All rights reserved.
 * See LICENSE for license details.
 */

declare(strict_types=1);

namespace EcomDev\RUMBeacon\Service;

use Magento\Framework\DB\Profiler;
use Zend_Db_Profiler_Query;

class MySqlCustomProfiler extends Profiler
{
    private float $timing;
    private null|int|string $lastQueryId = null;

    public function __construct(
        private readonly MeasurementAggregator $aggregator
    ) {
        parent::__construct(true);
    }

    public function queryClone(Zend_Db_Profiler_Query $query)
    {
        return parent::queryClone($query);
    }

    public function queryStart($queryText, $queryType = null)
    {
        $queryId = count($this->_queryProfiles) + 1;

        if ($queryType === null) {
            $queryType = $this->detectQueryType((string)$queryText);
        }

        $this->_queryProfiles[$queryId] = LightQueryProfiler::create($queryText, $queryType);

        $this->lastQueryId = $queryId;
        return $queryId;
    }

    private function detectQueryType($queryText): int
    {
        if (!is_string($queryText) || strlen($queryText) < 6) {
            return self::QUERY;
        }

        $firstKeyword = substr(ltrim($queryText), 0, 6);

        return match ($firstKeyword) {
            'select' => self::SELECT,
            'insert' => self::INSERT,
            'update' => self::UPDATE,
            'delete' => self::DELETE,
            default => self::QUERY,
        };
    }

    public function queryEnd($queryId)
    {
        $profile = $this->_queryProfiles[$queryId];
        $result = parent::queryEnd($queryId);

        match ($profile->getQueryType()) {
            self::CONNECT, self::TRANSACTION => $this->aggregator->recordSingle(
                'db',
                $profile->getElapsedSecs()
            ),
            default => $this->aggregator->recordAggregate(
                'db',
                $profile->getElapsedSecs()
            ),
        };

        return $result;
    }

    public function queryEndLast()
    {
        if ($this->lastQueryId !== null) {
            return $this->queryEnd($this->lastQueryId);
        }

        return self::IGNORED;
    }
}
