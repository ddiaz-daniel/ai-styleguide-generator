<?php

namespace aiGenerator;

/*
* ------------------------------------------- KI Styleguide -------------------------------------------
*/

Generator::$router->map("GET", "kiGettingStarted", function () {
    $meta_title = "Erstellen Sie Ihren KI-Styleguide.";
    $meta_description = "Erstellen Sie Ihre eigene Marken-Bibliothek, teilen Sie Ihre Guidelines und Dateien mit Agenturen, Druckereien oder internationalen Partnern.";

    Generator::renderPublic("page/kistyleguide/ki_getting_started/kiGettingStarted", ["register" => true, "meta_title" => $meta_title, "meta_description" => $meta_description]);
}, "kiGettingStarted");

Generator::$router->map("GET", "kiStyleguide", function () {
    $meta_title = "Erstellen Sie Ihren KI-Styleguide.";
    $meta_description = "Erstellen Sie Ihre eigene Marken-Bibliothek, teilen Sie Ihre Guidelines und Dateien mit Agenturen, Druckereien oder internationalen Partnern.";

    if (!session_id())
        session_start();
    // always set new styleguide generator instance when the initial form is shown, as this means a new round
    $_SESSION['aiStyleguideCompanyInfoFromForm'] = '';

    Generator::renderPublic("page/kistyleguide/ki_style_guide/kiStyleguide", ["register" => true, "meta_title" => $meta_title, "meta_description" => $meta_description]);
}, "kiStyleguide");

include("kistyleguide/PromptGenerator.php");
include("kistyleguide/StyleGuideGenerator.php");
include("kistyleguide/AIGenerationVariables.php");
include("kistyleguide/CompetitorScraping.php");
include("kistyleguide/LogoGenerator.php");
include("kistyleguide/NameInstructionsGenerator.php");
include("kistyleguide/LogoInstructionsGenerator.php");
include("kistyleguide/RegenInstructionsGenerator.php");

Generator::$router->map("POST", "kiGenerateStyleguide", function () {

    // get competitor information
    $competitorScraper = new CompetitorScraping();
    $competitorInformation = $competitorScraper->getStylingInformationAllCompetitors($_POST['competitors']);

    $aiGenVariables = new AIGenerationVariables($_POST, $_FILES);
    // get logo colors
    $topLogoColors = [];
    if ($aiGenVariables->logo != '')
        $topLogoColors = ShowCaseGenerator::getLogoColors($aiGenVariables->logo, 10);

    // create prompt
    $promptGen = new PromptGenerator($_POST, $competitorInformation, $topLogoColors);


    $prompt = $promptGen->generatePrompt();

    if (!session_id())
        session_start();
    // store given company info in session
    $_SESSION['aiStyleguideCompanyInfoFromForm'] = $prompt;

    $prompt = "Generate a styleguide proposal by following the manual based on:\n\n" . $prompt;
    $instructionsTemplate = $promptGen->getInstructionsTemplate();
    //var_dump($aiGenVariables->logo);


    // TODO why is that here?
    sleep(2);

    $meta_title = "Erstellen Sie Ihren KI-Styleguide.";
    $meta_description = "Erstellen Sie Ihre eigene Marken-Bibliothek, teilen Sie Ihre Guidelines und Dateien mit Agenturen, Druckereien oder internationalen Partnern.";

    if ($aiGenVariables->getUseIntegratedAIs()) {
        $generator = new StyleGuideGenerator($instructionsTemplate);
        $temperature = $aiGenVariables->getTemperature();
        $genStyleguide = $generator->generateStyleGuide($prompt, $temperature, $useMockup = false);
        $decodedGenStyleGuide = json_decode(json_decode($genStyleguide)->choices[0]->message->content, true);

        $companyNameWasGiven = isset($inputVariables["companyName"]) && strlen($inputVariables["companyName"]) > 0;
        $companyLogoWasGiven = isset($inputVariables["logo"]) && strlen($inputVariables["logo"]) > 0;
        // if logo and name were given redirect to review page, dont need to show generated names and logos
        if ($companyNameWasGiven && ($companyLogoWasGiven || !$aiGenVariables->getGenLogos())) {
            header("Location: /generatedStyleguideReview", true, 307);
            exit;
        } else {
            // if CompanyName is given remove suggestions from styleguide
            $companyName = $aiGenVariables->getCompanyName();
            if (isset($companyName) && strlen($companyName) > 0) {
                $decodedGenStyleGuide["names"] = [];
            }

            // if logo is given dont generate new logos
            $logo = $aiGenVariables->logo;
            $logos = [];
            if (isset($logo) && strlen($logo) > 0) {
                $logos = [];
            } else {
                //Gen logos with AI
                //var_dump($inputVariables["genLogos"]);
                if ($aiGenVariables->getGenLogos()) {
                    //var_dump('generate logos');
                    //Gen Logos
                    $logoPrompt = $decodedGenStyleGuide["imagery"]["logo"];
                    $logoGen = new LogoGenerator($logoPrompt);
                    $logoData = $logoGen->generateLogo();
                    $logos = json_decode($logoData)->data;

                    //TODO : This if statement is entirely for Debug
                    if (empty($logos)) {
                        $logos = [
                            "https://seeklogo.com/images/P/pepsi-logo-94D7DEF922-seeklogo.com.png",
                            "https://seeklogo.com/images/L/looney-tunes-logo-9A71DBE317-seeklogo.com.png",
                            "https://seeklogo.com/images/P/pokemon-go-logo-6A54081537-seeklogo.com.png"
                        ];
                    }
                }
            }
            $decodedGenStyleGuide["logos"] = $logos;

            Generator::renderPublic("page/kistyleguide/ki_name_selection/kiNameSelection", [
                "register" => true, "meta_title" => $meta_title,
                "meta_description" => $meta_description, "kiStyleguide" => ($decodedGenStyleGuide), "inputVariables" => json_encode($aiGenVariables)
            ]);
        }
    } else {
        Generator::renderPublic("page/kistyleguide/prompt_view/promptView", [
            "register" => true, "meta_title" => $meta_title,
            "meta_description" => $meta_description, "instructionsTemplate" => $instructionsTemplate, "prompt" => $prompt, "inputVariables" => json_encode($aiGenVariables)
        ]);
    }
}, "kiGenerateStyleguide");

Generator::$router->map("POST", "kiNameSelection", function () {
    $meta_title = "Erstellen Sie Ihren KI-Styleguide.";
    $meta_description = "Erstellen Sie Ihre eigene Marken-Bibliothek, teilen Sie Ihre Guidelines und Dateien mit Agenturen, Druckereien oder internationalen Partnern.";
    $decodedGenStyleGuide = json_decode($_POST["kiStyleguide"], true);
    $inputVariables = json_decode($_POST["inputVariables"], true);
    $companyNameWasGiven = isset($inputVariables["companyName"]) && strlen($inputVariables["companyName"]) > 0;
    $companyLogoWasGiven = isset($inputVariables["logo"]) && strlen($inputVariables["logo"]) > 0;

    // if logo and name were given redirect to review page, dont need to show generated names and logos
    if ($companyNameWasGiven && ($companyLogoWasGiven || !$inputVariables["genLogos"])) {
        header("Location: /generatedStyleguideReview", true, 307);
        exit;
    } else {
        // if CompanyName is given remove suggestions from styleguide
        $companyName = $inputVariables["companyName"];
        if (isset($companyName) && strlen($companyName) > 0) {
            $decodedGenStyleGuide["names"] = [];
        }

        // if logo is given dont generate new logos
        $logo = $inputVariables["logo"];
        $logos = [];
        if (isset($logo) && strlen($logo) > 0) {
            $logos = [];
        } else {
            //Gen logos with AI
            //var_dump($inputVariables["genLogos"]);
            if ($inputVariables["genLogos"]) {
                //var_dump('generate logos');
                //Gen Logos
                $logoPrompt = $decodedGenStyleGuide["imagery"]["logo"];
                $logoGen = new LogoGenerator($logoPrompt);
                $logoData = $logoGen->generateLogo();
                $logos = json_decode($logoData)->data;

                //TODO : This if statement is entirely for Debug
                if (empty($logos)) {
                    $logos = [
                        "https://seeklogo.com/images/P/pepsi-logo-94D7DEF922-seeklogo.com.png",
                        "https://seeklogo.com/images/L/looney-tunes-logo-9A71DBE317-seeklogo.com.png",
                        "https://seeklogo.com/images/P/pokemon-go-logo-6A54081537-seeklogo.com.png"
                    ];
                }
            }
        }
        $decodedGenStyleGuide["logos"] = $logos;

        Generator::renderPublic("page/kistyleguide/ki_name_selection/kiNameSelection", [
            "register" => true, "meta_title" => $meta_title,
            "meta_description" => $meta_description, "kiStyleguide" => $decodedGenStyleGuide, "inputVariables" => json_encode($inputVariables)
        ]);
    }
}, "kiNameSelection");

Generator::$router->map("POST", "regenerateNames", function () {
    $meta_title = "Erstellen Sie Ihren KI-Styleguide.";
    $meta_description = "Erstellen Sie Ihre eigene Marken-Bibliothek, teilen Sie Ihre Guidelines und Dateien mit Agenturen, Druckereien oder internationalen Partnern.";

    $decodedGenStyleGuide = json_decode($_POST["kiStyleguide"], true);
    $inputVariables = json_decode($_POST["inputVariables"], true);

    // get company information that was provided in the form from the session
    if (!session_id())
        session_start();
    $companyInfo = $_SESSION['aiStyleguideCompanyInfoFromForm'];

    // create prompt
    $instructionsGen = new NameInstructionsGenerator();
    $nameGen = new StyleGuideGenerator($instructionsGen->getInstructionsTemplate());
    $prompt = "Generate new names by following the manual based on:\n\n" . $companyInfo;
    $prompt .= "The following names were already provided. " . json_encode($decodedGenStyleGuide['names']) . "The company does not like them and wants other options. ";

    // send request
    $temperature = $inputVariables["aiCreativityLvl"] / 100;
    $names = $nameGen->generateStyleGuide($prompt, $temperature);

    // use answer
    $decodedNames = json_decode(json_decode($names)->choices[0]->message->content)->names;
    $decodedGenStyleGuide["names"] = []; // TODO currently all previous names are removed, idk if that is smart... but i see no point in displaying the names the user already saw again...
    foreach ($decodedNames as $name) {
        $decodedGenStyleGuide["names"][] = $name;
    }

    Generator::renderPublic("page/kistyleguide/ki_name_selection/kiNameSelection", [
        "register" => true, "meta_title" => $meta_title,
        "meta_description" => $meta_description, "kiStyleguide" => $decodedGenStyleGuide, "inputVariables" => json_encode($inputVariables)
    ]);
}, "regenerateNames");

Generator::$router->map("POST", "regenerateLogos", function () {
    $meta_title = "Erstellen Sie Ihren KI-Styleguide.";
    $meta_description = "Erstellen Sie Ihre eigene Marken-Bibliothek, teilen Sie Ihre Guidelines und Dateien mit Agenturen, Druckereien oder internationalen Partnern.";

    $decodedGenStyleGuide = json_decode($_POST["kiStyleguide"], true);
    $inputVariables = json_decode($_POST["inputVariables"], true);

    //TODO : Gen and Add new logos - test if this would work
    $logoPrompt = $decodedGenStyleGuide["imagery"]["logo"];
    $logoGen = new LogoGenerator($logoPrompt);
    $logoData = $logoGen->generateLogo();
    $logos = json_decode($logoData)->data;
    foreach ($logos as $logo) {
        $decodedGenStyleGuide["logos"][] = $logo;
    }

    Generator::renderPublic("page/kistyleguide/ki_name_selection/kiNameSelection", [
        "register" => true, "meta_title" => $meta_title,
        "meta_description" => $meta_description, "kiStyleguide" => $decodedGenStyleGuide, "inputVariables" => json_encode($inputVariables)
    ]);
}, "regenerateLogos");

Generator::$router->map("POST", "generatedStyleguideReview", function () {
    $meta_title = "Erstellen Sie Ihren KI-Styleguide.";
    $meta_description = "Erstellen Sie Ihre eigene Marken-Bibliothek, teilen Sie Ihre Guidelines und Dateien mit Agenturen, Druckereien oder internationalen Partnern.";

    $inputVariables = json_decode($_POST["inputVariables"], true);
    $styleguide = json_decode($_POST["kiStyleguide"], true);
    $selectedName = $inputVariables["companyName"] == '' ? $_POST["selectedName"] : $inputVariables["companyName"];
    $selectedLogo = $inputVariables["logo"] == '' && isset($_POST["selectedLogo"]) && $_POST["selectedLogo"] != "" ? ShowCaseGenerator::removeLogoBg($_POST["selectedLogo"]) : $inputVariables["logo"];
    $styleguide["names"] = $selectedName;

    //var_dump($selectedLogo);
    //var_dump("POST");
    //var_dump($_POST);
    //    $kiLogos = json_decode($_POST['kiLogos'], true);
    //var_dump($_POST['inputVariables']);

    // create mockup with logo
    $primaryColor = '#ffffff';
    try {
        $primaryColor = $styleguide["colors"]["primaryPalette"][0]["hex"];
    } catch (\Exception $e) {
        var_dump($e);
    }
    $mockupImgPath = isset($_POST["mockupImgPath"]) && $_POST["kiStyleguide"] != '' ? $_POST["mockupImgPath"] : '';
    if ($selectedLogo && $mockupImgPath == '')
        $mockupImgPath = ShowCaseGenerator::genBusinessCardShowCase($selectedLogo, $primaryColor, $selectedName);

    Generator::renderPublic("page/kistyleguide/review/generatedStyleguideReview", [
        "register" => true, "meta_title" => $meta_title,
        "meta_description" => $meta_description, "kiStyleguide" => $styleguide, "selectedName" => $selectedName, "selectedLogo" => $selectedLogo, "mockupImgPath" => $mockupImgPath, "inputVariables" => json_encode($inputVariables)
    ]);
}, "generatedStyleguideReview");

Generator::$router->map("POST", "kiRegenerateStyleguide", function () {

    $aiGenVariables = json_decode($_POST["inputVariables"], true);
    $reviewInputValues = $_POST['reviewInputValues'];
    $styleguide = $_POST["kiStyleguide"];

    $styleguide = json_decode($_POST["kiStyleguide"], true);
    $styleguide['logos'] = [];
    $styleguide = json_encode($styleguide);

    // create prompt
    $instructionsGen = new RegenInstructionsGenerator;
    //$nameGen = new StyleGuideGenerator($instructionsGen->getInstructionsTemplate());
    $instructionsTemplate = ($instructionsGen->getInstructionsTemplate());
    $instructionsTemplate .= "\n\n" . $styleguide;
    var_dump($reviewInputValues);
    $prompt = "\n\nModify the current styleguide format based on the user input:" . $reviewInputValues;


    $meta_title = "Erstellen Sie Ihren KI-Styleguide.";
    $meta_description = "Erstellen Sie Ihre eigene Marken-Bibliothek, teilen Sie Ihre Guidelines und Dateien mit Agenturen, Druckereien oder internationalen Partnern.";

    if ($aiGenVariables['useIntegratedAIs']) {
        $generator = new StyleGuideGenerator($instructionsTemplate);
        $temperature = $aiGenVariables['aiCreativityLvl'] / 100;
        //var_dump('generate with ai');
        //var_dump($instructionsTemplate);
        //var_dump($prompt);
        $genStyleguide = $generator->generateStyleGuide($prompt, $temperature, $useMockup = false);
        $decodedGenStyleGuide = json_decode(json_decode($genStyleguide)->choices[0]->message->content, true);
        //var_dump($genStyleguide);
        Generator::renderPublic("page/kistyleguide/review/generatedStyleguideReview", [
            "register" => true, "meta_title" => $meta_title,
            "meta_description" => $meta_description,
            "kiStyleguide" => $decodedGenStyleGuide,
            "selectedName" => $_POST["selectedName"],
            "selectedLogo" => $_POST["selectedLogo"],
            "mockupImgPath" => $_POST["mockupImgPath"],
            "inputVariables" => json_encode($aiGenVariables)
        ]);
    } else {
        Generator::renderPublic("page/kistyleguide/ki_regenerate/kiRegenerate", [
            "register" => true,
            "meta_title" => $meta_title,
            "meta_description" => $meta_description,
            "instructionsTemplate" => $instructionsTemplate,
            "prompt" => $prompt,
            "inputVariables" => json_encode($aiGenVariables),
            "reviewInputVariables" => json_encode($reviewInputValues),
            "selectedName" => $_POST["selectedName"],
            "selectedLogo" => $_POST["selectedLogo"],
            "mockupImgPath" => $_POST["mockupImgPath"],
        ]);
    }
}, "kiRegenerateStyleguide");

Generator::$router->map("POST", "styleguide/createFromKi", function () {
    // TODO save styleguide
    //Styleguide::createFromPost();
    //Styleguide::copyFromPost();
    var_dump('<h1>needs to be saved, no access to view DB :(</h1>');
    var_dump($_POST['kiStyleguide']);
    Generator::redirect("/dashboard?message=newStyleguide_success");
}, "styleguide_create_from_ki_post");

include("kistyleguide/ShowCaseGenerator.php"); // TODO needed for MockupTest...
Generator::$router->map("GET", "mockupTest", function () {
    $dalleImage = 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-0G9SuW0aa8B27SpuHDJVNUfY/user-O3U1bF08dJLFZG34o7BPCnLk/img-BweBlcXq6tH93ku2IzbrmMEh.png?st=2023-06-23T11%3A20%3A57Z&se=2023-06-23T13%3A20%3A57Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-06-22T23%3A47%3A20Z&ske=2023-06-23T23%3A47%3A20Z&sks=b&skv=2021-08-06&sig=XtxldIflguEgC5/Jbj3tDKOmmTZFc%2BrqAbaiCJdRaB0%3D';
    $primaryColor = '#ff0000';
    $imageSrc = ShowCaseGenerator::genBusinessCardShowCase($dalleImage, $primaryColor, 'FurryFriends');
    echo '<img src=' . $imageSrc . ' style="height: 100vh;">';
    //Generator::renderPublic("page/kistyleguide/review/generatedStyleguideReview", ["register" => true, "imageSrc" => $imageSrc]);
}, "mockupTest");

Generator::$router->map("GET", "competitorTest", function () {
    $url = "https://www.teamsisu.at/";
    $competitorScraper = new CompetitorScraping();
    $competitorInfo = $competitorScraper->getStylingInformation($url);
}, "competitorTest");

Generator::$router->map("GET", "logoRemoveBgTest", function () {
    $dalleImage = 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-0G9SuW0aa8B27SpuHDJVNUfY/user-O3U1bF08dJLFZG34o7BPCnLk/img-jH7UOmmRs1Ebj4VML3m8C5MH.png?st=2023-06-23T12%3A40%3A18Z&se=2023-06-23T14%3A40%3A18Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-06-22T23%3A46%3A56Z&ske=2023-06-23T23%3A46%3A56Z&sks=b&skv=2021-08-06&sig=BorEZnU1DodJfxv0DcUjcL0D/b1BQEgnCuRgBDj8/Mc%3D';
    $imageSrc = ShowCaseGenerator::removeLogoBg($dalleImage);
    echo '<img src=' . $imageSrc . ' style="height: 100vh;">';
}, "logoRemoveBgTest");
