<?php

/**
 * Copyright © EcomDev B.V. All rights reserved.
 * See LICENSE for license details.
 */

declare(strict_types=1);

namespace EcomDev\RUMBeacon\Observer;

use EcomDev\RUMBeacon\State\CurrentPageInfo;
use Magento\Framework\App\Request\Http;
use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;

readonly class StoreCurrentRouteInfo implements ObserverInterface
{
    public function __construct(
        private CurrentPageInfo $currentPageInfo
    ) {
    }

    public function execute(Observer $observer)
    {
        /** @var Http $request */
        $request = $observer->getRequest();
        $controllerModule = $request->getControllerName();
        $routerName = $request->getRouteName();
        $this->currentPageInfo->info['type'] = match ($routerName) {
            'catalog' => $controllerModule,
            'catalogsearch' => 'search',
            'cms' => match ($controllerModule) {
                'index' => 'homepage',
                default => 'cms_page',
            },
            'customer', 'checkout' => $routerName . '_' . $controllerModule,
            default => 'other'
        };
    }
}
