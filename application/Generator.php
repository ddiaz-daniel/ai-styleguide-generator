<?php

namespace aiGenerator;

use AltoRouter;
use Twig\TwigFunction;
use Twig\TwigFilter;
use Twig\Extension\DebugExtension;

class Generator
{
    private static $config = [], $twig;
    public static $router;

    public static function init()
    {
        $_SESSION["selectedLanguage"] = 'en';
        $lang = $_SESSION['selectedLanguage'];
        if ($lang == 'en') {
            $hreflang = 'de';
            $otherlanghref = str_replace('/en', '', $_SERVER['REQUEST_URI']);
        } else {
            $hreflang = 'en';
            $otherlanghref = '/en' . $_SERVER['REQUEST_URI'];
        }
        self::initLanguage();
        self::initRouting();
        self::initTemplating(
            realpath(__DIR__ . '/../templates'),
            [
                "lang" => $_SESSION['selectedLanguage'],
                "hreflang" => $hreflang,
                "otherlanghref" => $otherlanghref,
                "pathImage" => "/assets/images",
                "i18n" => self::$config["i18n"],
                //"message" => @$_GET['message'],
                //"error" => @$_GET['error'],
                "meta_title" => "Your fast and easy online style guide generator",
                "meta_description" => "",
            ]
        );
        self::handle();
    }

    private static function initLanguage()
    {

        $lang_routes = [
            "/",
            "",
            "/en",
            "/en/",

            "/features",
            "/en/features",

            "/dos-donts",
            "/en/dos-donts",

            "/faqs",
            "/en/faqs",

            "/pro",
            "/en/pro",

            "/tacs",
            "/en/tacs",

            "/data-protection",
            "/en/data-protection",

            "/imprint",
            "/en/imprint",

            "/feedback",
            "/en/feedback",

            "/register_thanks",
            "/en/register_thanks",

            "/logout",
            "/en/logout",
        ];

        if (isset($_GET["lang"]) && $_GET["lang"] === "de") {
            $selectedLanguage = "de";
            $_SESSION["selectedLanguage"] = 'de';
        }
        if (isset($_GET["lang"]) && $_GET["lang"] === "en") {
            $selectedLanguage = "en";
            $_SESSION["selectedLanguage"] = 'en';
        }

        if (in_array(explode('?', $_SERVER['REQUEST_URI'])[0], $lang_routes)) {
            if (strpos($_SERVER['REQUEST_URI'], '/en') === false && @$selectedLanguage == 'en') {
                $_SESSION["selectedLanguage"] = 'en';
                Generator::redirect("/en" . $_SERVER['REQUEST_URI']);
            }
            if (strpos($_SERVER['REQUEST_URI'], '/en') !== false && @$selectedLanguage == 'de') {
                $_SESSION["selectedLanguage"] = 'de';
                Generator::redirect(str_replace('/en', '', $_SERVER['REQUEST_URI']));
            }
        }


        if (empty($selectedLanguage)) {
            if (empty($selectedLanguage)) {
                if (isset($_SESSION) && is_array($_SESSION) && array_key_exists("selectedLanguage", $_SESSION) && !empty($_SESSION["selectedLanguage"])) {
                    $selectedLanguage = $_SESSION["selectedLanguage"];
                }
                if (in_array(explode('?', $_SERVER['REQUEST_URI'])[0], $lang_routes)) {
                    if (in_array(explode('?', $_SERVER['REQUEST_URI'])[0], $lang_routes)) {
                        if (strpos($_SERVER['REQUEST_URI'], '/en') === false && @$selectedLanguage == 'en') {
                            $_SESSION["selectedLanguage"] = 'en';
                            Generator::redirect("/en" . $_SERVER['REQUEST_URI']);
                        }
                        if (strpos($_SERVER['REQUEST_URI'], '/en') !== false && @$selectedLanguage == 'de') {
                            $_SESSION["selectedLanguage"] = 'de';
                            Generator::redirect(str_replace('/en', '', $_SERVER['REQUEST_URI']));
                        }
                    }
                }
            }

            if (empty($selectedLanguage)) {
                if (strpos($_SERVER['REQUEST_URI'], '/en') !== false) {
                    $selectedLanguage = 'en';
                    $_SESSION["selectedLanguage"] = 'en';
                }
            }


            if (empty($selectedLanguage)) {
                $clientLanguages = preg_split("/(,|;)/", @$_SERVER['HTTP_ACCEPT_LANGUAGE']);

                $_supportedLanguages = scandir("./assets/lang/");
                $supportedLanguages = [];
                foreach ($_supportedLanguages as $supportedLanguage) {
                    if (strlen($supportedLanguage) === 6) {
                        $supportedLanguages[] = substr($supportedLanguage, 0, 2);
                    }
                }

                $found = false;
                foreach ($clientLanguages as $clientLanguage) {
                    if (!$found) {
                        foreach ($supportedLanguages as $supportedLanguage) {
                            if ($supportedLanguage === $clientLanguage) {
                                $found = true;
                                $selectedLanguage = $supportedLanguage;
                                $_SESSION['selectedLanguage'] = $selectedLanguage;
                                break;
                            }
                        }
                    }
                }
            }

            if (empty($selectedLanguage)) {
                $_SESSION['selectedLanguage'] = 'en';
            }

            include_once("./application/assets/lang/$selectedLanguage.php");
        }
    }

    private static function initRouting()
    {
        self::$router = new AltoRouter(); // Initialize the router object

        self::$router->setBasePath("/");
        self::$router->addMatchTypes(['a' => '[0-9A-Za-z_]++']);

        // Require other routing-related files if needed
        require_once "./application/routing.php";
    }

    private static function initTemplating($templateFolder, $globals = [])
    {
        $loader = new \Twig\Loader\FilesystemLoader($templateFolder);
        self::$twig = new \Twig\Environment($loader);

        foreach ($globals as $key => $val) {
            self::$twig->addGlobal($key, $val);
        }

        self::$twig->addFunction(new TwigFunction("svg", function ($path) {
            if (file_exists(SITE_ROOT . $path)) {
                echo file_get_contents(SITE_ROOT . $path);
            }
            return "";
        }));

        self::$twig->addFilter(new TwigFilter('is_current_url', function ($link) {
            return ("$_SERVER[REQUEST_URI]" == $link) ? true : false;
        }));
        self::$twig->addExtension(new DebugExtension());
    }



    private static function handle()
    {
        $currentRoute = self::$router->match();

        if ($currentRoute) {
            $currentRoute["target"]($currentRoute["params"]);
        } else {
            http_response_code(404);
            self::renderPublic("page/404");
        }
    }

    public static function renderPublic($template, $params = array())
    {
        self::$twig->display("$template.twig", $params);
    }

    public static function render($template, $params = array())
    {
        $params['noindex'] = true;
        self::renderPublic($template, $params);
    }


    public static function redirect($path)
    {
        header("$_SERVER[SERVER_PROTOCOL] 301 Moved Permanently");
        header("Location: $path");
        exit;
    }

    public static function config($_config)
    {
        self::$config = array_merge(self::$config, $_config);
    }
}
