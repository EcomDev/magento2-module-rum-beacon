<?php

/**
 * Copyright © EcomDev B.V. All rights reserved.
 * See LICENSE for license details.
 */

declare(strict_types=1);

namespace EcomDev\RUMBeacon\Observer;

use EcomDev\RUMBeacon\State\CurrentPageInfo;
use Magento\Catalog\Api\Data\ProductInterface;
use Magento\Framework\App\Request\Http;
use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;

readonly class StoreCurrentProductInfo implements ObserverInterface
{
    public function __construct(
        private CurrentPageInfo $currentPageInfo
    ) {
    }

    public function execute(Observer $observer)
    {
        /** @var ProductInterface $request */
        $product = $observer->getProduct();
        $this->currentPageInfo->info['name'] = $product->getName();
        $this->currentPageInfo->info['identifier'] = $product->getSku();
        $this->currentPageInfo->info['type_id'] = $product->getTypeId();
    }
}
