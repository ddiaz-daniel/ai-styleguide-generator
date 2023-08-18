<?php

// Set the appropriate timezone
date_default_timezone_set("Europe/Vienna");

// Load Composer's autoloader
require_once("../../../../vendor/autoload.php");

use ScssPhp\ScssPhp\Compiler;

// Get the requested SCSS file path
$pathInfo = isset($_SERVER['PATH_INFO']) ? $_SERVER['PATH_INFO'] : '';
$scssFilePath = realpath("./src" . $pathInfo);

// Check if the SCSS file exists
if (file_exists($scssFilePath)) {
    // Initialize the SCSS compiler
    $scss = new Compiler();

    // Compile the SCSS into CSS
    $compiledCss = $scss->compileString(file_get_contents($scssFilePath))->getCss(); // Get compiled CSS content

    // Set the appropriate content type for CSS
    header("Content-type: text/css; charset: UTF-8");

    // Output the compiled CSS
    echo $compiledCss;
} else {
    // Return a 404 header if the SCSS file doesn't exist
    header("HTTP/1.0 404 Not Found");
    echo "Not Found";
}
