<?php

/**
 * Copyright © EcomDev B.V. All rights reserved.
 * See LICENSE for license details.
 */

declare(strict_types=1);

namespace EcomDev\RUMBeacon\Plugin;

use EcomDev\RUMBeacon\Service\MySqlCustomProfilerFactory;
use Magento\Framework\DB\Adapter\Pdo\Mysql;
use Magento\Framework\DB\Adapter\Pdo\MysqlFactory;

readonly class InjectCustomProfiler
{
    public function __construct(
        private MySqlCustomProfilerFactory $mySqlCustomProfiler,
    )
    {

    }

    public function afterCreate(MysqlFactory $subject, Mysql $result): Mysql
    {
        $profiler = $this->mySqlCustomProfiler->create(
            ['originalProfiler' => $result->getProfiler()],
        );

        $result->setProfiler($profiler);
        return $result;
    }
}
