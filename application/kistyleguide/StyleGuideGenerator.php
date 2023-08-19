<?php

namespace aiGenerator;

use Serializable;

class StyleGuideGenerator implements Serializable
{
  private $url;
  private $headers;
  private $instructionsTemplate;

  public function __construct($instructionsTemplate)
  {
    $this->url = 'https://api.openai.com/v1/chat/completions';
    $this->headers = array(
      'Content-Type: application/json',
      'Authorization: Bearer ' . $_ENV['OPENAI_API_KEY']
    );
    $this->instructionsTemplate = $instructionsTemplate;
  }

  private function generateMockUpResponse()
  {
    return '{
  "names": ["Pawland", "Paw Pals", "Pet Haven"],
  "colors": {
    "primaryColor": "rgb(255, 196, 0)",
    "secondaryColor": "rgb(210, 105, 30)",
    "tertiaryColor": "rgb(0, 128, 128)",
    "note": "The suggested colors represent the warmth and excitement of owning a pet, while also showcasing the chic and modern side"
  },
  "typography": {
    "fonts": {
      "mainFont": "Montserrat",
      "secondaryFont": "Open Sans"
    },
    "logoSpacing": "80px",
    "fontSize": {
      "normalText": 16,
      "h1": 42,
      "h2": 32,
      "h3": 24,
      "callToAction": 28
    },
    "fontWeight": {
      "normalText": 400,
      "h1": 700,
      "h2": 600,
      "h3": 500,
      "callToAction": 700
    },
    "anyOtherFontRelatedInfo": "The suggested fonts are modern, chic, but also easy to read at any age!"
  },
  "writingStyle": "The writing style should reflect the love and connection we have with our pets. Writing should be personalized and fun while remaining professional",
  "slogan": "Experience the unconditional love of having a furry friend by your side",
  "brandPosition": {
    "brandValues": ["Compassion", "Friendliness", "Professionalism"],
    "statements": "We strive to provide the best service possible, bringing pets and their owners closer with top-notch products and services tailored to all your pets needs"
  },
  "imagery": {
    "logo": "perfectly symmetrical minimalistic paw logo, balanced, centered, warm colors, aesthetic, white background -- no text",
    "backgroundImage": "A cozy pet bed nestled in an adorable pet house surrounded by greenery",
    "illustrations": "An illustration of a happy owner and a pet playing or lounging together"
  },
  "layout": {
    "containerWidth": "1200px",
    "gridColumns": 12,
    "spacing": {
      "small": "8px",
      "medium": "16px",
      "large": "24px"
    }
  },
  "components": ["Product Gallery", "Pet Shop Locator", "Pet Care Guide"],
  "accessibility": {
    "contrastRatio": "4.5:1",
    "textSize": {
      "minimum": "16px",
      "maximum": "22px"
    }
  }
}
';
  }

  private function doOpenAIRequest($prompt, $temperature)
  {
    // The actual API request
    $body = array(
      'model' => 'gpt-3.5-turbo',
      'messages' => array(
        array(
          'role' => 'system',
          'content' => $this->instructionsTemplate
        ),
        array(
          'role' => 'user',
          'content' => $prompt
        ),
      ),
      'max_tokens' => 2000, //TODO : increased from 1000 to 2000 is this a problem???
      'temperature' => $temperature,
    );

    $ch = curl_init($this->url);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $this->headers);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    curl_close($ch);

    return $response;
  }

  public function generateStyleGuide($prompt, $temperature, $useMockup = false)
  {

    $response = '{response: default response}';
    if ($useMockup) {
      $response = $this->generateMockUpResponse();
    } else {
      $response = $this->doOpenAIRequest($prompt, $temperature);
    }

    return $response;
  }

  // serialize is necessary to store object in the php session
  public function serialize()
  {
    return serialize([$this->url, $this->headers, $this->companyInfoForm]);
  }
  public function unserialize($data)
  {
    list(
      $this->url,
      $this->headers,
      $this->companyInfoForm
    ) = unserialize($data);
  }
}
