<?php

namespace GeoPal\Map;

use GeoPal\Map\Exceptions\InvalidFileException;

/**
 * Class File
 *
 * @author gabor.zelei@geopal-solutions.com
 * @package GeoPal\Map
 *
 * File handler class
 */
class File
{
    /**
     * @var string
     */
    private $path;

    /**
     * @param string|null $filePath
     */
    public function __construct($filePath = null)
    {
        $this->path = $filePath;
    }

    /**
     * Collect garbage once we are done
     */
    public function __destruct()
    {
        gc_collect_cycles();
    }

    /**
     * @return null|string
     * @throws \Exception
     * @throws \GeoPal\Map\Exceptions\InvalidFileException
     */
    public function getContents()
    {
        try {
            return $this->readContents();
        } catch (InvalidFileException $e) {
            throw $e;
        }
    }

    /**
     * @return null|string
     */
    public function getPath()
    {
        return $this->path;
    }

    /**
     * @param string|null $filePath
     * @return bool
     */
    public static function isDirectory($filePath = null)
    {
        return (self::isReadable($filePath) && is_dir($filePath));
    }

    /**
     * @param string|null $filePath
     * @return bool
     */
    public static function isReadable($filePath = null)
    {
        return (!is_null($filePath) && file_exists($filePath) && is_readable($filePath) && (filesize($filePath) > 0));
    }

    /**
     * @param string|null $filePath
     * @return bool
     */
    public static function isWritable($filePath = null)
    {
        return (!is_null($filePath) && (is_writable($filePath) || is_writable(dirname($filePath))));
    }

    /**
     * @return string
     * @throws \GeoPal\Map\Exceptions\InvalidFileException
     */
    private function readContents()
    {
        if (self::isReadable($this->path)) {
            $phpData = @include_once($this->path);

            if (is_bool($phpData)) {
                $phpData = file_get_contents($this->path);
            }

            return $phpData;
        } else {
            throw new InvalidFileException($this->path);
        }
    }
}
