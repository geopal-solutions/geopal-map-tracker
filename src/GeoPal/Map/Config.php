<?php

namespace GeoPal\Map;

use GeoPal\Map\Exceptions\InvalidConfigurationFileException;
use GeoPal\Map\Exceptions\InvalidFileException;

/**
 * Class Config
 *
 * @author gabor.zelei@geopal-solutions.com
 * @package GeoPal\Map
 *
 * Configuration class for the standalone map widget
 *
 * @method string|null  getDefaultMapCenter
 * @method int|null     getDefaultMapZoom
 * @method string|null  getGeoPalEmployeeId
 * @method string|null  getGeoPalAPIKey
 * @method string|null  getGoogleMapsAPIKey
 * @method string|null  getLogFilePath
 * @method string|null  getMapPageTitle
 */
class Config
{
    const DEFAULT_LOG_FILE_NAME = 'geopal_map_tracker_error.log';
    const GETTER_METHOD_PREFIX = 'get';
    const MSG_INVALID_CONFIG_FILE = 'Invalid configuration in file: %s';
    const MSG_INVALID_FILE = 'File is not readable: %s';

    /**
     * @var array
     */
    private $mandatoryFields = array(
        'defaultMapCenter',
        'defaultMapZoom',
        'geoPalEmployeeId',
        'geoPalAPIKey',
        'googleMapsAPIKey'
    );

    /**
     * @param string $configFilePath
     */
    public function __construct($configFilePath)
    {
        try {
            $this->getConfig($configFilePath);
        } catch (InvalidConfigurationFileException $e) {
            die(sprintf(self::MSG_INVALID_CONFIG_FILE, $e->getMessage()));
        } catch (InvalidFileException $e) {
            die(sprintf(self::MSG_INVALID_FILE, $e->getMessage()));
        }
    }

    /**
     * Magic method for automatic getters
     *
     * @example $config->getGeoPalPassword() will return the value of $this->geoPalPassword
     *
     * @param string $methodName
     * @param array $params
     * @return null
     */
    public function __call($methodName, $params = array())
    {
        // Remove prefix from the beginning of the target $methodName
        $prefixLength = strlen(self::GETTER_METHOD_PREFIX);

        if (substr($methodName, 0, $prefixLength) == self::GETTER_METHOD_PREFIX) {
            $propertyName = lcfirst(substr($methodName, $prefixLength, strlen($methodName)));
        } else {
            $propertyName = null;
        }

        // Check for corresponding property
        if (!is_null($propertyName) && !is_null($this->{$propertyName})) {
            return $this->{$propertyName};
        } else {
            return null;
        }
    }

    /**
     * Static function to allow instance creation with fluid api
     *
     * @param string|int $configFilePath
     * @return Config
     */
    public static function create($configFilePath)
    {
        return new Config($configFilePath);
    }

    /**
     * Reads configuration from the config file into dynamic class variables
     *
     * @param null $configFilePath
     * @return null|string
     * @throws Exceptions\InvalidConfigurationFileException
     * @throws Exceptions\InvalidFileException
     */
    private function getConfig($configFilePath = null)
    {
        $defaultLogFilePath = __DIR__ . DIRECTORY_SEPARATOR . self::DEFAULT_LOG_FILE_NAME;

        if (File::isReadable($configFilePath)) {
            $configFile = new File($configFilePath);
            $configData = $configFile->getContents();

            if (is_array($configData)) {

                // Check if all mandatory config values are present
                foreach ($this->mandatoryFields as $mandatoryField) {

                    if (!isset($configData[$mandatoryField])) {
                        throw new InvalidConfigurationFileException($configFilePath);
                    }

                }

                // Store config data
                foreach ($configData as $property => $value) {
                    $this->{$property} = $value;
                }

                // Make sure we have a valid log file path
                if (is_null($this->getLogFilePath())) {
                    $this->logFilePath = $defaultLogFilePath;
                }

                return $configData;
            } else {
                throw new InvalidConfigurationFileException($configFilePath);
            }

        } else {
            throw new InvalidFileException($configFilePath);
        }

    }
}
