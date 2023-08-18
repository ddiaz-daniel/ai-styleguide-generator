<?php
require_once "../vendor/autoload.php"; // Load Composer's autoloader

require_once "./application/Generator.php";
define('SITE_ROOT', realpath(dirname(__FILE__)));


\aiGenerator\Generator::init();
