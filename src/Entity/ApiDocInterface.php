<?php

/**
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

namespace Drupal\apigee_api_catalog\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\Core\Entity\EntityPublishedInterface;

/**
 * Provides an interface for defining API Doc entities.
 *
 * @deprecated in 2.x and is removed from 3.x. Use the node "apidoc" bundle instead.
 * @see https://github.com/apigee/apigee-api-catalog-drupal/pull/84
 */
interface ApiDocInterface extends ContentEntityInterface, EntityChangedInterface, EntityPublishedInterface {

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

  /**
   * Gets the API Doc name.
   *
   * @return string
   *   Name of the API Doc.
   */
  public function getName(): string;

  /**
   * Sets the API Doc name.
   *
   * @param string $name
   *   The API Doc name.
   *
   * @return \Drupal\apigee_api_catalog\Entity\ApiDocInterface
   *   The called API Doc entity.
   */
  public function setName(string $name): self;

  /**
   * Gets the description.
   *
   * @return null|string
   *   The API Doc description.
   */
  public function getDescription(): string;

  /**
   * Sets the description.
   *
   * @param string $description
   *   Description of the API Doc.
   *
   * @return \Drupal\apigee_api_catalog\Entity\ApiDocInterface
   *   The API Doc entity.
   */
  public function setDescription(string $description): self;

  /**
   * Gets the API Doc creation timestamp.
   *
   * @return int
   *   Creation timestamp of the API Doc.
   */
  public function getCreatedTime(): int;

  /**
   * Sets the API Doc creation timestamp.
   *
   * @param int $timestamp
   *   The API Doc creation timestamp.
   *
   * @return \Drupal\apigee_api_catalog\Entity\ApiDocInterface
   *   The called API Doc entity.
   */
  public function setCreatedTime(int $timestamp): self;

}
