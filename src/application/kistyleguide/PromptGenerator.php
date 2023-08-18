<?php

namespace aiGenerator;

class PromptGenerator
{
  private $companyName;
  private $companySlogan;
  private $branch;
  private $limbicValues = array();
  private $competitors = array();
  private $competitorsSimilarity;
  private $reasoningDifferent;
  private $colorSelectors = array();
  private $minAge;
  private $maxAge;
  private $countries = array();
  private $educations = array();
  private $genders = array();
  private $minIncome;
  private $maxIncome;
  private $languages = array();
  private $maritalStatuses = array();
  private $vulnerablePeople = array();
  private $businessReason;
  private $inspirationalImageDescription;
  private $aiCreativityLvl;
  private $extraInfo;
  private $competitorInformation;
  private $logoColors;

  public function __construct($obj, $competitorInformation, $logoColors)
  {
    $this->companyName = $obj['companyName'];
    $this->companySlogan = $obj['companySlogan'];
    $this->branch = $obj['branch'];
    $this->limbicValues = $obj['limbicValues'];
    $this->competitors = $obj['competitors'];
    $this->competitorsSimilarity = $obj['competitorsSimilarity'];
    $this->reasoningDifferent = $obj['reasoningDifferent'];
    $this->colorSelectors = $obj['colorSelectors'];
    $this->minAge = $obj['minAge'];
    $this->maxAge = $obj['maxAge'];
    $this->countries = $obj['countries'];
    $this->educations = $obj['educations'];
    $this->genders = $obj['genders'];
    $this->minIncome = $obj['minIncome'];
    $this->maxIncome = $obj['maxIncome'];
    $this->languages = $obj['languages'];
    $this->maritalStatuses = $obj['maritalStatuses'];
    $this->vulnerablePeople = $obj['vulnerablePeople'];
    $this->businessReason = $obj['businessReason'];
    $this->inspirationalImageDescription = $obj['inspirationalImageDescription'];
    $this->aiCreativityLvl = $obj['aiCreativityLvl'];
    $this->extraInfo = $obj['extraInfo'];
    $this->competitorInformation = $competitorInformation;
    $this->logoColors = $logoColors;
  }

  public function generatePrompt()
  {
    $prompt = "1. Type of business: " . $this->branch . "\n";

    // Include the company name if available
    if ($this->companyName && strlen($this->companyName) > 0) {
      $prompt = "For the company " . $this->companyName . ", " . $prompt;
    }
    if ($this->limbicValues && count($this->limbicValues) > 0) {
      $prompt .= "2. Limbic Map: " . implode(', ', $this->limbicValues) . "\n\n";
    }
    if (isset($this->minAge) && isset($this->maxAge)) {
      $prompt .= "3. Target Age: " . $this->minAge . " - " . $this->maxAge . "\n\n";
    }
    if ($this->countries && count($this->countries) > 0) {
      $prompt .= "4. Target Countries: " . implode(', ', $this->countries) . "\n\n";
    }
    if ($this->educations && count($this->educations) > 0) {
      $prompt .= "5. Target Educations: " . implode(', ', $this->educations) . "\n\n";
    }
    if ($this->genders && count($this->genders) > 0) {
      //TODO : Why added when genders is empty
      $prompt .= "6. Target Genders: " . implode(', ', $this->genders) . "\n\n";
    }
    if (isset($this->minIncome) && isset($this->maxIncome)) {
      $prompt .= "7. Target Income: €" . $this->minIncome . " - €" . $this->maxIncome . "\n\n";
    }
    if ($this->languages && count($this->languages) > 0) {
      $prompt .= "8. Target Languages: " . implode(', ', $this->languages) . "\n\n";
    }
    if ($this->maritalStatuses && count($this->maritalStatuses) > 0) {
      $prompt .= "9. Target Marital Statuses: " . implode(', ', $this->maritalStatuses) . "\n\n";
    }
    if ($this->vulnerablePeople && count($this->vulnerablePeople) > 0) {
      $prompt .= "10. Target Vulnerable People: " . implode(', ', $this->vulnerablePeople) . "\n\n";
    }
    if ($this->competitors && count($this->competitors) > 0 && count($this->competitorInformation) > 0) {
      $prompt .= "11. Competitors: " . implode(', ', $this->competitors) . "\n\n";
      //TODO Daniel, check if this is fine for you
      $prompt .= $this->getCompetitorStylingInformation();
      $prompt .= 'Use the given competitors styles to ' . $this->competitorsSimilarity . '% as an inspiration for the new styleguide, to get inspiration into what direction the color could go or what fonts to use. Do not use the exact same colors!';
    }
    if ($this->inspirationalImageDescription && strlen($this->inspirationalImageDescription) > 0) {
      $prompt .= "12. Feeling displayed: " . $this->inspirationalImageDescription . "\n\n";
    }
    if ($this->colorSelectors && count($this->colorSelectors)) {
      $colors = [];
      foreach ($this->colorSelectors as $selector) {
        $colors[] = json_encode(["color" => $selector]);
      }
      $prompt .= "- Colors: " . implode(', ', $colors) . "\n";
    }
    if ($this->logoColors && count($this->logoColors)) {
      $logoColorsString = '';
      foreach ($this->logoColors as $color => $occurance) {
        $logoColorsString .= $occurance . 'x ' . $color . ', ';
      }
      $prompt .= "- Colors used in the companies logo (including their frequency): " . $logoColorsString . " (consider them when generating the styleguide, do not use all, pick some that are fitting for the company and add other colors that go well with them)\n";
    }
    if ($this->reasoningDifferent && strlen($this->reasoningDifferent) > 0) {
      $prompt .= "- Reasoning Different: " . $this->reasoningDifferent . "\n";
    }
    if ($this->businessReason && strlen($this->businessReason) > 0) {
      $prompt .= "- Business Reason different than money: " . $this->businessReason . "\n";
    }
    if ($this->companySlogan && strlen($this->companySlogan) > 0) {
      $prompt .= "- Slogan: " . $this->companySlogan . "\n";
    }
    if ($this->extraInfo && strlen($this->extraInfo) > 0) {
      $prompt .= "- Extra comments for the request: " . $this->extraInfo . "\n";
    }
    return $prompt;
  }

  public function getInstructionsTemplate()
  {
    return 'You are a modern styleguide generator. Your purpose is to assist freshly started companies in establishing a comprehensive styleguide that reflects their brand identity and design principles. 
                        Follow these rules for the styleguide generation RULES:
                        1.  Dont provide any extra description or comments in the output.
                        2.  Consider the comments as notes that modify the field in front of them.
                        3.  Fill all the fields.
                        
                        4.  Do not use the company name in the output.
                        6.  Follow the format of the output as described below.
                        Step-by-step instructions:
                        1.  Generate a styleguide proposal based on the given input.
                        2.  Validate the JSON
                        3.  Display the output
                        

{
  "names": ["user name or suggested name 1", "suggested name 2", "suggested name 3", "suggested name 4"], // suggest some names for the company. 
  "slogan": "string", // Use the user input for this field, however if it is not given, create a catchy and memorable phrase that encapsulates the brands essence or key message. 
  "colors": // Suggestions for the color scheme should be accordingly the type of company industry. Do not repeat the same color in the primary and secondary palette.
  {
    "primaryPalette": [
      {
        "hex": "string", //should be the most prominent color also used in logo
        "rgb": "string",
        "cmyk": "string",
        "pantone": "string"
      },
      {
        "hex": "string", //should be a color that gives an accent to the primary color
        "rgb": "string",
        "cmyk": "string",
        "pantone": "string"
      },
      {
        "hex": "string",  //should be a neutral color that fits well with the first primaryPalette color as a background color
        "rgb": "string",
        "cmyk": "string",
        "pantone": "string"
      }
    ],
    "secondaryPalette": [
      {
        "hex": "string", //should be a color supplementary to the primaryPalette colors
        "rgb": "string",
        "cmyk": "string",
        "pantone": "string"
      },
      {
        "hex": "string",  //should be a neutral color that fits well with the first secondaryPalette color as a background color
        "rgb": "string",
        "cmyk": "string",
        "pantone": "string"
      },
      {
        "hex": "string", //should be a neutral color that fits well with the first secondaryPalette color as a background color
        "rgb": "string",
        "cmyk": "string",
        "pantone": "string"
      }
    ],
    "note": "string" // tell how the colors merge together and how can they be used in the design. No more than 50 words. dont mention color codes. just names
  },
  "typography": { // Provide suggestion mostly based on the limbic map and target audience
    "fonts":  {
      "primary": { //primary font family
        "name": "string",
        "weight": {
          "light": "number",
          "regular": "number",
          "bold": "number"
        },
        "size": {
          "h1": "number",
          "h2": "number",
          "h3": "number",
          "p": "number"
        }
      },
      "secondary": { //secondary font family
        "name": "string",
        "weight": {
          "light": "number",
          "regular": "number",
          "bold": "number"
        },
        "size": {
          "h1": "number",
          "h2": "number",
          "h3": "number",
          "p": "number"
        }
      },
    },
    "sampleText": { 
          "heading": "string", // Provide a sample text for the heading.
          "paragraph": "string" // Provide a sample text for the paragraph.
        }
    "note": "string" // Tell how the fonts merge together and how can they be used in the design. No more than 50 words
  },
  "communication": {
  "tone": "Confident and Engaging",
  "sampleText": {   // Provide a sample text for the tone of voice and language style for each the communication methods, keep them simple, no more that 80 words. 
    "email": "string", // Instead of giving a name use the word customer, use minimum 40 words
    "verbally": "string", //At least complete a sentence
    "ads": "string" 
  },
  "promotionMethods": ["string", "string", "string"], // Provide a list of promotion methods that the company can use
  "promotionalSlogans": ["string", "string", "string"] // Provide a list of promotional slogans that the company can use. Maximum 3 slogans 20 words each
}
  "brandPosition": {
    "brandValues": [ // Provide a list of brand values as many as you consider, give a big consideration to the limbic map
      {"name": "string",
        "description":  "string"}
    ],
    "statements": "string" // Describe the unique selling points and positioning statements for the brand.
  },
  "competitors": [ // Provide a list of competitors, that you know exist in the same industry. Add the competitors that the user provided in the prompt, if you do not know accurate information about them, just leave the field empty
    {
      "name": "string",
      "website": "string",
      "communication": "string", // Let me how do they talk with the audience, what is their tone of voice
      "engage": "string", // Let me know how do they engage with the audience
      "description": "string" // Describe the competitors and how they are different from the proposed company
    }
  ],
  "imagery": {
    "logo" :"string", // evey prompt should include the following, just modify the {value} based on the user input: "perfectly symmetrical minimalistic {"simple item related to branch} logo, balanced, centered, {color name or gradient} deep colors, aesthetic, {black or white} background -- no text
  },
}';
  }

  function getCompetitorStylingInformation()
  {
    $maxItemsToConsiderColor = 15;
    $maxItemsToConsiderFont = 10;

    $competitorStyleString = '';

    foreach ($this->competitorInformation as $name => $competitorStyles) {
      $competitorStyleString .= "The competitor with the url " . $name . " uses the following colors ('amount of times used'x 'color'): \n";

      $lengthColors = count($competitorStyles[0]) > $maxItemsToConsiderColor ? $maxItemsToConsiderColor : count($competitorStyles[0]);
      foreach (array_slice($competitorStyles[0], 0, $lengthColors) as $color => $amount) {
        $competitorStyleString .= $amount . 'x ' . $color . "\n";
      }

      $competitorStyleString .= "And the following font families ('amount of times used'x ' font family'): \n";

      $lengthFonts = count($competitorStyles[0]) > $maxItemsToConsiderFont ? $maxItemsToConsiderFont : count($competitorStyles[0]);
      foreach (array_slice($competitorStyles[1], 0, $lengthFonts) as $font => $amount) {
        $competitorStyleString .= $amount . 'x ' . $font . "\n";
      }
    }

    return $competitorStyleString;
  }
}
