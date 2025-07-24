<?php

/**
 * Copyright © EcomDev B.V. All rights reserved.
 * See LICENSE for license details.
 */

declare(strict_types=1);

namespace EcomDev\RUMBeacon\State;

use Magento\Framework\ObjectManager\ResetAfterRequestInterface;

class CurrentPageInfo implements ResetAfterRequestInterface
{
    public function __construct(
        public array $info = [],
    ) {
    }

    public function _resetState(): void
    {
        $this->info = [];
    }
}
