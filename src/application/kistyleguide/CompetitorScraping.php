<?php

namespace aiGenerator;

//  require_once 'vendor/autoload.php'; // Include Sabberworm\CSS library

use DOMDocument;
use Sabberworm\CSS\Parser;
use Sabberworm\CSS\Property\Selector;
use Sabberworm\CSS\Value\Color;
use Sabberworm\CSS\Value\RuleValueList;
use Symfony\Component\BrowserKit\HttpBrowser;
use Symfony\Component\HttpClient\HttpClient;

class CompetitorScraping
{
    private string $varPattern = '/var\(--/';
    public function __construct()
    {
        //var_dump('Test');
        //var_dump(phpinfo());
    }


    public function getStylingInformation($url)
    {
        // Retrieve the HTML code of the input website
        $browser = new HttpBrowser(HttpClient::create());

        $browser->request('GET', $url);
        $response = $browser->getResponse();

        // Extract the CSS files used in the website

        $dom = new DOMDocument();
        libxml_use_internal_errors(true); // because: https://stackoverflow.com/questions/10524300/php-domdocument-loadhtml-error
        $success = $dom->loadHTML($response);

        $links = $dom->getElementsByTagName('link');

        $css_links = array();
        foreach ($links as $link) {
            if (strpos($link->getAttribute('rel'), 'stylesheet') !== false) {
                $css_links[] = $link->getAttribute('href');
            }
        }

        // Fetch the CSS code and parse it using Sabberworm\CSS
        $font_families = array();
        $colors = array();

        foreach ($css_links as $link) {
            $browser->request('GET', $link);
            $css_code = $browser->getResponse();

            $parser = new Parser($css_code);
            try {
                $stylesheet = $parser->parse();
            } catch (\Sabberworm\CSS\Parsing\SourceException $e) {
                echo $e;
            }

            foreach ($stylesheet->getAllRuleSets() as $rule) {
                foreach ($rule->getRules() as $property) {
                    if ($property instanceof Selector) {
                        // Handle selectors
                    } elseif ($property->getRule() == 'font-family') {
                        array_push($font_families, ...preg_split("/\,/", (string)$property->getValue()));
                    } elseif ($property->getRule() == 'color' || $property->getRule() == 'background-color') {
                        array_push($colors, ...preg_split("/\,(?![^\(]*\))/", (string)$property->getValue()));
                    }
                }
            }
        }

        /* TODO if we have time, implement getting colors from variables... currently if a variable is used at the color: xxx it does not work*/
        $styleTags = $dom->getElementsByTagName('style');

        $style_tag_content = array();
        foreach ($styleTags as $tag) {
            if ($tag->nodeValue !== '') {
                $style_tag_content[] = $tag->nodeValue;
            }
        }

        $colorVariablesNames = array();
        $variablesWithContent = array();
        foreach ($style_tag_content as $css_code) {
            $parser = new Parser($css_code);
            try {
                $stylesheet = $parser->parse();
            } catch (\Sabberworm\CSS\Parsing\SourceException $e) {
                echo $e;
            }

            foreach ($stylesheet->getAllRuleSets() as $rule) {
                foreach ($rule->getRules() as $property) {
                    if ($property instanceof Selector) {
                        // Handle selectors
                    } elseif ($property->getRule() == 'font-family') {
                        array_push($font_families, ...preg_split("/\,/", (string)$property->getValue()));
                    } elseif ($property->getRule() == 'color' || $property->getRule() == 'background-color') {
                        $currentColors = preg_split("/\,(?![^\(]*\))/", (string)$property->getValue());
                        foreach ($currentColors as $c) {
                            if (preg_grep($this->varPattern, array($c))) {
                                $cVar = preg_grep($this->varPattern, array($c));
                                array_push($colorVariablesNames, str_replace(['var(', 'rgb', 'rgba(', ')'], '', $cVar[0]));
                            } else {
                                array_push($colors, $c);
                            }
                        }
                    } elseif (str_contains($property->getRule(), '--')) {
                        $variablesWithContent[$property->getRule()] = $property->getValue();
                    }
                }
            }
        }

        //var_dump($variablesWithContent);

        foreach ($colorVariablesNames as $varName) {
            if (array_key_exists($varName, $variablesWithContent)) {
                //var_dump($varName . ' is '. (string)$variablesWithContent[$varName] . '\n');
                $currentColor = (string)$variablesWithContent[$varName];
                if (preg_grep($this->varPattern, array($currentColor)) == false) {
                    if (str_contains($currentColor, ',')) {
                        $RGB = explode(",", $currentColor);
                        if (count($RGB) >= 3)
                            $currentColor = $this->rgbToHex($RGB[0], $RGB[1], $RGB[2]);
                    }
                    array_push($colors, $currentColor);
                }
            }
        }

        $font_families = array_count_values($font_families);
        arsort($font_families);
        $colors = array_count_values($colors);
        arsort($colors);

        unset($colors["inherit"]);
        unset($colors["transparent"]);
        unset($colors["currentColor"]);

        return array($colors, $font_families);
    }

    private function rgbToHex($r, $g, $b)
    {
        return sprintf("#%02x%02x%02x", $r, $g, $b);
    }

    function getStylingInformationAllCompetitors($competitorsUrls): array
    {
        $stylingInfoAllCompetitors = array();
        foreach ($competitorsUrls as $url) {
            $url = filter_var($url, FILTER_SANITIZE_URL);
            if (filter_var($url, FILTER_VALIDATE_URL)) {
                $stylingInfoAllCompetitors[$url] = $this->getStylingInformation($url);
            }
        }
        return $stylingInfoAllCompetitors;
    }
}
