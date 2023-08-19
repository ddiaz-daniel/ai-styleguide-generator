<?php

namespace aiGenerator;

class AIGenerationVariables
{
    public $aiCreativityLvl;
    public $useIntegratedAIs;
    public $genLogos;
    public $companyName;
    public $logo;

    public function __construct($obj, $files)
    {
        $this->aiCreativityLvl = $obj['aiCreativityLvl'];
        $this->useIntegratedAIs = isset($obj['useIntegratedAIs']);
        $this->genLogos = isset($obj['genLogos']);
        $this->companyName = $obj['companyName'];
        if ($files['logo']["size"] != 0 && $this->imageUploadValid($files['logo']))
            $this->logo = ShowCaseGenerator::removeLogoBg($files['logo']["tmp_name"]);
        else
            $this->logo = '';
    }

    public function getTemperature()
    {
        return $this->aiCreativityLvl / 100;
    }

    public function getUseIntegratedAIs()
    {
        return $this->useIntegratedAIs;
    }

    public function getGenLogos()
    {
        return $this->genLogos;
    }

    public function getCompanyName()
    {
        return $this->companyName;
    }

    public function setCompanyName($companyName)
    {
        $this->companyName = $companyName;
    }

    public function imageUploadValid($image)
    {
        $extension = strtolower(pathinfo($image['name'], PATHINFO_EXTENSION));

        //Überprüfung der Dateiendung
        $allowed_extensions = [
            'png',
            'jpg',
            'jpeg',
            'gif',
            'svg'
        ];
        if (!in_array($extension, $allowed_extensions)) {
            return false;
        }

        //Überprüfung der Dateigröße
        $max_size = 150 * 1024 * 1024; //150MB
        if ($image['size'] > $max_size) {
            return false;
        }


        if (!($extension === 'svg')) {
            //Überprüfung dass das Bild keine Fehler enthält
            if (function_exists('exif_imagetype')) { //Die exif_imagetype-Funktion erfordert die exif-Erweiterung auf dem Server
                $allowed_types = array(IMAGETYPE_PNG, IMAGETYPE_JPEG, IMAGETYPE_GIF);
                $detected_type = exif_imagetype($image['tmp_name']);
                if (!in_array($detected_type, $allowed_types)) {
                    return false;
                }
            }
        }

        return true;
    }

    private function storeImage($image)
    {
        $newName = uniqid(rand(), true) . '.' . strtolower(pathinfo($image['name'], PATHINFO_EXTENSION));
        $filepath = 'upload/logos/';
        move_uploaded_file($image['tmp_name'], $filepath . $newName);
        return $filepath . $newName;
    }
}
