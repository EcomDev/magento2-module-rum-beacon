<?php

/**
 * Copyright © EcomDev B.V. All rights reserved.
 * See LICENSE for license details.
 */

declare(strict_types=1);

namespace EcomDev\RUMBeacon\Observer;

use EcomDev\RUMBeacon\State\CurrentPageInfo;
use Magento\Catalog\Api\Data\CategoryInterface;
use Magento\Catalog\Api\Data\ProductInterface;
use Magento\Framework\App\Request\Http;
use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;

readonly class StoreCurrentCategoryInfo implements ObserverInterface
{
    public function __construct(
        private CurrentPageInfo $currentPageInfo
    ) {
    }

    public function execute(Observer $observer)
    {
        /** @var CategoryInterface $category */
        $category = $observer->getCategory();
        $this->currentPageInfo->info['identifier'] = $category->getPath();
        $this->currentPageInfo->info['name'] = $category->getName();
    }
}
