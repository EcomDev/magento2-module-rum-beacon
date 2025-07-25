<?php

/**
 * Copyright © EcomDev B.V. All rights reserved.
 * See LICENSE for license details.
 */

declare(strict_types=1);

namespace EcomDev\RUMBeacon\Service;

class LightQueryProfiler extends \Zend_Db_Profiler_Query
{

    public static function create($query, $queryType): self
    {
        return new self($query, $queryType);
    }

    public function start()
    {
        $this->_startedMicrotime = hrtime(true);
    }

    public function end()
    {
        $this->_endedMicrotime = hrtime(true);
    }
}
