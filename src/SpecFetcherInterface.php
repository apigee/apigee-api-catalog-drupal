<?php

/*
 * Copyright 2019 Google Inc.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * version 2 as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 */

namespace Drupal\apigee_api_catalog;

use Drupal\Core\Messenger\MessengerInterface;
use Drupal\node\NodeInterface;
use Psr\Log\LogLevel;

/**
 * Interface SpecFetcherInterface.
 */
interface SpecFetcherInterface {

  /**
   * The value of "spec_file_source" when it uses a file as source.
   *
   * @var string
   */
  public const SPEC_AS_FILE = 'file';

  /**
   * The value of "spec_file_source" when it uses a URL as source.
   *
   * @var string
   */
  public const SPEC_AS_URL = 'url';

  public const LOG_LEVEL_MAP = [
    LogLevel::ALERT => MessengerInterface::TYPE_WARNING,
    LogLevel::WARNING => MessengerInterface::TYPE_WARNING,
    LogLevel::NOTICE => MessengerInterface::TYPE_STATUS,
    LogLevel::INFO => MessengerInterface::TYPE_STATUS,
    LogLevel::DEBUG => MessengerInterface::TYPE_STATUS,
  ];

  /**
   * The status when an error happened during the fetch operation.
   *
   * @var string
   */
  public const STATUS_ERROR = 'status_error';

  /**
   * The status when a spec update completed successfully.
   *
   * @var string
   */
  public const STATUS_UPDATED = 'status_updated';

  /**
   * The status when a spec update finds the remote file unchanged.
   *
   * @var string
   */
  public const STATUS_UNCHANGED = 'status_unchanged';

  /**
   * Fetch OpenAPI specification file from URL.
   *
   * Takes care of updating an ApiDoc file entity with the updated spec file. If
   * "spec_file_source" uses a URL, it will fetch the specified file and put it
   * in the "spec" file field. If it uses a "file", it won't change it.
   * This method only updates the file entity if it completed without error (if
   * it returns STATUS_UPDATED or STATUS_UNCHANGED), it does not save
   * the ApiDoc entity.
   *
   * @param \Drupal\node\NodeInterface $apidoc
   *   The ApiDoc entity.
   *
   * @return string
   *   Returns the status of the operation. If it is STATUS_UPDATED or
   *   STATUS_UNCHANGED, the ApiDoc entity will need to be saved to store the
   *   changes.
   */
  public function fetchSpec(NodeInterface $apidoc): string;

}
