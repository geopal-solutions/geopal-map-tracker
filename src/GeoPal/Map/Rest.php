<?php

namespace GeoPal\Map;

use Geopal\Geopal;

/**
 * Class Rest
 *
 * @author gabor.zelei@geopal-solutions.com
 * @package GeoPal\Map
 *
 * REST emulator library for the standalone map widget
 */
class Rest
{
    /**
     * @var Config
     */
    private $config;

    /**
     * @var Geopal
     */
    private $geoPalClient;

    /**
     * @var array
     */
    private $statusLabels = array(
        0 => 'green',
        1 => 'yellow',
        2 => 'red'
    );

    /**
     * Constructor
     *
     * @param Config $config
     */
    public function __construct(Config $config)
    {
        $this->config = $config;
    }

    /**
     * Public interface method
     *
     * @param string|null $callId
     * @return string|null
     */
    public function call($callId = null)
    {
        switch ($callId) {
            case 'mapCenter':
                $response = $this->getCenterLatLng();
                break;
            case 'employees':
                $response = $this->getEmployeesList();
                break;
            case 'employeePositions':
                $response = $this->getEmployeePositions();
                break;
            default:
                $response = array('success' => false);
                break;
        }

        return $response;
    }

    /**
     * Returns an instance of the GeoPal API client library
     *
     * @return Geopal
     */
    private function getGeoPalClient()
    {
        if (is_null($this->geoPalClient)) {
            $this->geoPalClient = new Geopal(
                $this->config->getGeoPalEmployeeId(),
                $this->config->getGeoPalAPIKey()
            );
        }

        return $this->geoPalClient;
    }

    /**
     * Returns the configured default center lat, lng and zoom
     *
     * @return array
     */
    private function getCenterLatLng()
    {
        $latLng = explode(',', $this->config->getDefaultMapCenter());
        $response = array(
            'latitude' => (float)trim($latLng[0]),
            'longitude' => (float)trim($latLng[1]),
            'zoom' => (int)$this->config->getDefaultMapZoom(),
            'success' => true
        );

        return $response;
    }

    /**
     * Returns a list of all employees
     *
     * @return array
     */
    private function getEmployeesList()
    {
        $data = $this->getGeoPalClient()->getEmployeesList();
        $response = array();

        foreach ($data as $record) {
            $response[] = array(
                'Id' => $record['id'],
                'Identifier' => $record['identifier'],
                'FirstName' => $record['first_name'],
                'LastName' => $record['last_name'],
                'Status' => $record['status']
            );
        }

        return $response;
    }

    /**
     * Returns a list of all employees with location and status data
     * (Employees with no valid location data will not be listed)
     *
     * @return array
     */
    private function getEmployeePositions()
    {
        $data = $this->getGeoPalClient()->getEmployeesList();
        $response = array();

        foreach ($data as $record) {

            if (isset($record['lat']) && isset($record['lng'])) {
                $response[] = array(
                    'Id' => $record['id'],
                    'Identifier' => $record['identifier'],
                    'FirstName' => $record['first_name'],
                    'LastName' => $record['last_name'],
                    'Lat' => $record['lat'],
                    'Lng' => $record['lng'],
                    'Address' => $record['address'],
                    'LastUpdated' => $record['last_updated_on'],
                    'StatusTxt' => $this->statusLabels[(int)$record['status']]
                );
            }
        }

        return $response;
    }
}
