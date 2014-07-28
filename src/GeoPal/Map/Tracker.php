<?php

namespace GeoPal\Map;

use Monolog\Handler\StreamHandler;
use Monolog\Logger;

/**
 * Class Tracker
 *
 * @author gabor.zelei@geopal-solutions.com
 * @package GeoPal\Map
 *
 * Main widget class for the standalone map widget
 *
 * @example
 *
 *      $config = Config::create('/path/to/config/file.php');
 *      $tracker = Tracker::create($config);
 *
 *
 *      // Render main map page
 *      $tracker->renderMap();
 *
 *      // Get rendered HTML into a variable
 *      $html = $tracker->getHTML();
 *
 *      // Print rendered page onto the screen
 *      $tracker->dumpHTML();
 *
 *
 *      // Do a REST-like call to get employee data from GeoPal (you should never have to do this manually)
 *      $response = $tracker->getData('employees', false);
 *
 */
class Tracker
{
    const MAP_PAGE_TEMPLATE = 'map.html';
    const TEMPLATES_DIRECTORY = __DIR__;

    /**
     * @var Config
     */
    private $config;

    /**
     * @var \Monolog\Logger
     */
    private $log;

    /**
     * @var string
     */
    private $mapPageHTML = '';

    /**
     * @param Config $config
     */
    public function __construct(Config $config)
    {
        $this->config = $config;

        // Set up logging
        $this->log = new Logger('GeoPalMap');
        $this->log->pushHandler(
            new StreamHandler(
                $this->config->getLogFilePath(),
                Logger::WARNING
            )
        );
    }

    /**
     * Static function to allow instance creation with fluid api
     *
     * @param Config $config
     * @return Tracker
     */
    public static function create(Config $config)
    {
        return new Tracker($config);
    }

    /**
     * Dumps rendered HTML onto the screen
     */
    public function dumpHTML()
    {
        echo $this->mapPageHTML;
    }

    /**
     * Returns the rendered HTML as a string
     *
     * @return string
     */
    public function getHTML()
    {
        return $this->mapPageHTML;
    }

    /**
     * Wrapper method to render HTML from template
     *
     * @param array $customVariables
     * @return $this
     */
    public function renderMap($customVariables = array())
    {
        try {
            $this->renderHTML($customVariables);
        } catch (\Twig_Error_Loader $loaderException) {
            $this->log->addError($loaderException->getMessage());
        } catch (\Twig_Error_Syntax $syntaxException) {
            $this->log->addError($syntaxException->getMessage());
        }
        
        return $this;
    }

    /**
     * Places a GET call against the GeoPal servers and returns or prints the returned result
     *
     * @param string|null $call
     * @param bool $printResponse
     * @return array|bool|float|int|null|string
     */
    public function getData($call = null, $printResponse = true)
    {
        if (!empty($call)) {

            try {
                $rest = new Rest($this->config);
                $response = $rest->call($call);

                if ($printResponse) {
                    echo json_encode($response);
                }

                return $response;
            } catch (\Exception $e) {
                $this->log->addError($e->getMessage());
            }
        }

        return null;
    }

    /**
     * Renders HTML from template
     *
     * @param array $customVariables
     */
    private function renderHTML($customVariables = array())
    {
        $twig = new \Twig_Environment(
            new \Twig_Loader_Filesystem(self::TEMPLATES_DIRECTORY)
        );

        $customPageTitle = $this->config->getMapPageTitle();
        $pageTitle = array('GeoPal');

        if (!empty($customPageTitle)) {
            array_unshift($pageTitle, $customPageTitle);
        }

        $this->mapPageHTML = $twig
            ->loadTemplate(self::MAP_PAGE_TEMPLATE)
            ->render(
                $customVariables + array(
                    'googleMapsAPIKey' => $this->config->getGoogleMapsAPIKey(),
                    'pageTitle' => implode(' - ', $pageTitle)
                )
            );
    }
}
