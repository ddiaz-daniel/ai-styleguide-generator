<?php

namespace aiGenerator;

class LogoGenerator
{
    private $url;
    private $headers;
    private $prompt;

    public function __construct($prompt)
    {
        $this->url = 'https://api.openai.com/v1/images/generations';
        $this->headers = array(
            'Content-Type: application/json',
            'Authorization: Bearer ' . $_ENV['OPENAI_API_KEY']
        );
        $this->prompt = $prompt;
    }

    public function generateLogo()
    {
        $data = array(
            'prompt' => $this->prompt,
            'n' => 4,
            'size' => "256x256",
        );

        return $this->makeRequest($data);
    }

    private function makeRequest($data)
    {
        $ch = curl_init($this->url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $this->headers);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        curl_close($ch);
        return $response;
    }
}
