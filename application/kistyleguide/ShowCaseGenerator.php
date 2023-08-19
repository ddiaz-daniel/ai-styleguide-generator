<?php

namespace aiGenerator;

use http\Env\Request;
use Imagick;
use ImagickDraw;
use ImagickPixel;

class ShowCaseGenerator
{
    public static function removeLogoBg($logoSrc)
    {
        // create new imagick image
        $logo = new Imagick($logoSrc);
        // take color of the pixel at pos 0,0 as the color to set to transparent (hoping that this pixel will always have the bg color)
        $colorToTransparent = $logo->getImagePixelColor(0, 0);
        // set that color to be transparent
        $logo->transparentPaintImage($colorToTransparent, 0.0, 1200, false); // fuzz (currently 1200) can be adapted. is the threshold of the color to be removed, the bigger, the more 'Similar' colors will be removed. if 0 only the given color is removed.

        // save image
        $logo->setImageFormat('png');
        $filepath = 'upload/logos/' . uniqid(rand(), true) . '.png';
        $logo->writeImage($filepath); //replace original background

        $logo->destroy();

        return $filepath;
    }

    public static function genBusinessCardShowCase($logoSrc, $primaryColor, $companyName)
    {
        $overlay = new Imagick($logoSrc);
        $image = new Imagick('assets/images/mockup.png',);
        $drawBig = new ImagickDraw();
        $drawBigColored = new ImagickDraw();
        $drawNormal = new ImagickDraw();
        $drawNormalColored = new ImagickDraw();

        // make logo bg transparent
        $colorToTransparent = $overlay->getImagePixelColor(0, 0);
        $overlay->transparentPaintImage($colorToTransparent, 0.0, 1200, false);

        // add logo on lower business card
        $overlay->resizeImage(500, 500, Imagick::FILTER_CATROM, 0.9);
        $image->setImageColorspace($overlay->getImageColorspace());
        $transparent = '#00000000';
        $image->rotateImage($transparent, 2);
        $image->compositeImage($overlay, Imagick::COMPOSITE_DEFAULT, 2930, 4130);

        // add logo on upper business card
        $image->rotateImage($transparent, -2);
        $overlay->resizeImage(800, 800, Imagick::FILTER_CATROM, 0.9);
        $image->setImageColorspace($overlay->getImageColorspace());
        $image->compositeImage($overlay, Imagick::COMPOSITE_DEFAULT, 2100, 2100);

        //define Text properties
        $drawBig->setFillColor('black');
        $drawBig->setFont('assets/fonts/ProximaNova/ProximaNova-Bold.otf');
        $drawBig->setFontSize(140);

        $drawBigColored->setFillColor($primaryColor);
        $drawBigColored->setFont('assets/fonts/ProximaNova/ProximaNova-Bold.otf');
        $drawBigColored->setFontSize(200);
        $drawBigColored->setGravity(Imagick::GRAVITY_CENTER);

        $drawNormal->setFillColor('black');
        $drawNormal->setFont('assets/fonts/ProximaNova/ProximaNova-Regular.otf');
        $drawNormal->setFontSize(90);

        $drawNormalColored->setFillColor($primaryColor);
        $drawNormalColored->setFont('assets/fonts/ProximaNova/ProximaNova-Regular.otf');
        $drawNormalColored->setFontSize(70);

        // add Text lower business card
        $image->annotateImage($drawBig, 1400, 4650, -2, 'Dominique Mayer');
        $image->annotateImage($drawNormalColored, 1400, 4750, -2, 'Product Manager');
        $image->annotateImage($drawNormal, 1400, 4950, -2, '+12 (0) 1234 567-89');
        $image->annotateImage($drawNormal, 1400, 5080, -2, 'dominique.mayer@' . $companyName . '.com');
        $image->annotateImage($drawNormal, 1400, 5210, -2, 'www.' . $companyName . '.com');

        // add Text upper business card
        $image->annotateImage($drawBigColored, -220, -550, 0, $companyName);

        $image->setImageFormat('png');
        // save image
        $filepath = 'upload/logomockups/' . uniqid(rand(), true) . '.png';
        $image->writeImage($filepath); //replace original background

        $overlay->destroy();
        $image->destroy();

        return $filepath;
    }

    public static function getLogoColors($logoSrc, $numberColors)
    {
        // create new imagick image
        $imagick = new Imagick($logoSrc);
        $imagick->adaptiveResizeImage(200, 200, true);
        $imagick->quantizeImage($numberColors, Imagick::COLORSPACE_RGB, 0, true, false);
        $histogramElements = $imagick->getImageHistogram();

        $colors = [];
        //var_dump($histogramElements[0]->getColor());
        foreach ($histogramElements as $elem) {
            $colors[sprintf(
                "#%02x%02x%02x",
                $elem->getColor()['r'],
                $elem->getColor()['g'],
                $elem->getColor()['b']
            )] = $elem->getColorCount();
        }
        arsort($colors);

        return $colors;
    }
}
