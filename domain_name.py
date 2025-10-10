import requests
import time
import json
from typing import List, Dict

# Domain name suggestions organized by category
domain_names = {
    "action_words": [
        "ziplink", "snapurl", "quicklink", "fastlink", "swifturl",
        "dashlink", "jumplink", "hoplink", "skipurl", "leaplink",
        "zoomlink", "rushlink", "boltlink", "flashurl", "sparklink",
        "clickwise", "taplink", "pressurl", "touchlink", "hitlink",
        "golink", "runlink", "flylink", "glideurl", "slidelink"
    ],
    
    "smart_tech": [
        "smartlink", "cleverurl", "geniuslink", "brightlink", "sharpurl",
        "keenlink", "acuteurl", "aptlink", "sagelink", "wiseurl",
        "brainlink", "mindurl", "thinklink", "logicurl", "reasonlink",
        "neurallink", "synapseurl", "cognilink", "intellecturl", "iqlink"
    ],
    
    "memory_related": [
        "memorablelink", "recallurl", "rememberlink", "mindfulurl", "stickylink",
        "catchiurl", "grablink", "holdurl", "keeplink", "saveurl",
        "storelink", "vaulturl", "cachelink", "retainurl", "preservelink"
    ],
    
    "human_friendly": [
        "humanurl", "peoplelink", "friendlyurl", "sociallink", "personaurl",
        "humanize", "naturallink", "organicurl", "reallink", "authenticurl",
        "genuinelink", "trueurl", "honestlink", "pureurl", "simplelink"
    ],
    
    "speak_say": [
        "speakurl", "saylink", "tellurl", "talklink", "voiceurl",
        "wordlink", "phraseurl", "speechlink", "utterurl", "dictatelink",
        "pronounceurl", "articulink", "expressurl", "conveylink", "relateurl"
    ],
    
    "short_variations": [
        "tinyurl", "minilink", "microurl", "nanolink", "picourl",
        "bitlink", "byteurl", "compactlink", "briefurl", "conciselink",
        "crispurl", "tightlink", "slimurl", "trimlink", "neaturl"
    ],
    
    "creative_combinations": [
        "linksmart", "urlgenius", "linkcraft", "urlforge", "linkmaker",
        "urlbuilder", "linksmith", "urlartisan", "linkdesign", "urlstudio",
        "linklab", "urlworks", "linkfactory", "urlmill", "linkhub"
    ],
    
    "modern_tech": [
        "pixellink", "digitalurl", "binarylink", "quantumurl", "atomiclink",
        "fusionurl", "plasmalink", "laserurl", "photonlink", "electronurl",
        "protonlink", "neutronurl", "particlelink", "waveurl", "fieldlink"
    ],
    
    "web_terms": [
        "weblink", "neturl", "cyberlink", "onlineurl", "virtuallink",
        "cloudurl", "serverlink", "hosturl", "domainlink", "siteurl",
        "pagelink", "portalurl", "gatewaylink", "accessurl", "connectlink"
    ],
    
    "descriptive": [
        "clearlink", "cleanurl", "purelink", "plainurl", "barelink",
        "rawurl", "baselink", "coreurl", "essentiallink", "fundamentalurl",
        "primarylink", "mainurl", "centrallink", "keyurl", "vitallink"
    ],
    
    "playful": [
        "funlink", "playurl", "joylink", "happyurl", "smilelink",
        "laughurl", "gigglelink", "chuckleurl", "amuselink", "delighturl",
        "cheerlink", "brighturl", "sunnylink", "warmurl", "glowlink"
    ],
    
    "professional": [
        "prolink", "bizurl", "corplink", "workurl", "officelink",
        "deskurl", "suitelink", "firmurl", "agencylink", "studiourl",
        "lablink", "shopurl", "storelink", "marketurl", "tradelink"
    ],
    
    "location_based": [
        "herelink", "thereurl", "wherelink", "placeurl", "spotlink",
        "pointurl", "pinlink", "mapurl", "locatelink", "findurl",
        "searchlink", "seekurl", "huntlink", "trackurl", "tracelink"
    ],
    
    "time_related": [
        "nowlink", "instanturl", "momentlink", "flashurl", "quicklink",
        "fasturl", "speedlink", "rapidurl", "swiftlink", "prompturl",
        "readylink", "gourl", "startlink", "beginurl", "launchlink"
    ],
    
    "quality": [
        "premiumlink", "eliteurl", "selectlink", "choiceurl", "primelink",
        "topurl", "bestlink", "superurl", "ultralink", "megaurl",
        "maxlink", "plusurl", "prolink", "goldurl", "platinumlink"
    ],
    
    "action_results": [
        "getlink", "makeurl", "createlink", "buildurl", "formlink",
        "shapeurl", "moldlink", "casturl", "forgelink", "crafturl",
        "designlink", "styleurl", "fashionlink", "tailorurl", "customlink"
    ],
    
    "connectivity": [
        "bridgelink", "connecturl", "joinlink", "mergeurl", "unitelink",
        "bondurl", "tielink", "chainurl", "couplelink", "pairurl",
        "matchlink", "fiturl", "suitlink", "alignurl", "synclink"
    ],
    
    "visibility": [
        "showlink", "viewurl", "seelink", "lookurl", "watchlink",
        "gazeurl", "peeklink", "glimpseurl", "sightlink", "visionurl",
        "focuslink", "zoomurl", "magnifylink", "enhanceurl", "amplifylink"
    ],
    
    "transformation": [
        "morphlink", "shifturl", "changelink", "alterurl", "modifylink",
        "adapturl", "evolvelink", "transformurl", "convertlink", "switchurl",
        "fliplink", "turnurl", "spinlink", "rotateurl", "pivotlink"
    ],
    
    "simplicity": [
        "easylink", "simpleurl", "basiclink", "plainurl", "clearlink",
        "pureurl", "barelink", "rawurl", "nakedlink", "stripurl",
        "cleanlink", "tidyurl", "neatlink", "orderlyurl", "organizedlink"
    ],
    
    "discovery": [
        "findlink", "discoverurl", "explorelink", "ventureurl", "questlink",
        "journeyurl", "treklink", "pathurl", "routelink", "wayurl",
        "roadlink", "trailurl", "courselink", "directionurl", "guidelink"
    ],
    
    "innovation": [
        "nextlink", "futureurl", "aheadlink", "forwardurl", "advancelink",
        "progressurl", "evolvelink", "developurl", "growlink", "riseurl",
        "climblink", "ascendurl", "elevatelink", "lifturl", "boostlink"
    ],
    
    "reliability": [
        "trustlink", "secureurl", "safelink", "guardurl", "protectlink",
        "shieldurl", "armorlink", "defendurl", "coverlink", "shelterurl",
        "harborlink", "havenurl", "refugelink", "sanctuaryurl", "fortresslink"
    ],
    
    "efficiency": [
        "optimallink", "efficienturl", "effectivelink", "productiveurl", "usefullink",
        "practicalurl", "functionallink", "workingurl", "activelink", "liveurl",
        "runninglink", "operatingurl", "performinglink", "executingurl", "doinglink"
    ],
    
    "unique_combinations": [
        "zestlink", "vibeurl", "pulselink", "rhythmurl", "beatlink",
        "tempourl", "pacelink", "flowurl", "streamlink", "currenturl",
        "tidelink", "waveurl", "ripplelink", "echourl", "resonatelink"
    ],
    
    "abstract": [
        "zenlink", "alphaurl", "omegalink", "primeurl", "corelink",
        "axisurl", "hublink", "nexusurl", "centerlink", "hearturl",
        "soullink", "spiriturl", "essencelink", "beingurl", "entitylink"
    ],
    
    "geometric": [
        "circlelink", "squareurl", "trianglink", "hexurl", "octaform",
        "polylink", "sphereurl", "cubelink", "prismurl", "pyramidlink",
        "arcurl", "curvelink", "lineurl", "dotlink", "pointurl"
    ],
    
    "nature_inspired": [
        "leaflink", "treeurl", "rootlink", "branchurl", "bloomlink",
        "flowerurl", "seedlink", "growthurl", "greenlink", "ecourl",
        "biolink", "lifeurl", "vitalink", "livingurl", "organiclink"
    ],
    
    "energy": [
        "sparklink", "bolturl", "chargelink", "powerurl", "energylink",
        "forceurl", "drivelink", "fuelurl", "boostlink", "surgeurl",
        "voltlink", "ampurl", "wattlink", "jolturl", "zaplink"
    ],
    
    "communication": [
        "telllink", "shareurl", "spreadlink", "broadcasturl", "transmitlink",
        "sendurl", "deliverlink", "conveyurl", "relaylink", "passurl",
        "handlink", "giveurl", "offerlink", "presenturl", "showlink"
    ],
    
    "creative_modern": [
        "neonlink", "retrourl", "vintagelink", "modernurl", "contemporarylink",
        "currenturl", "presentlink", "nowurl", "todaylink", "freshurl",
        "newlink", "novelurl", "originalink", "uniqueurl", "rarelink"
    ],
    
    "business_oriented": [
        "venturelink", "startupurl", "launchlink", "kickoffurl", "beginlink",
        "initiateurl", "commencelink", "starturl", "openlink", "unveilurl",
        "reveallink", "exposeurl", "displaylink", "exhibiturl", "presentlink"
    ],
    
    "tech_startup": [
        "applink", "softurl", "codelink", "devurl", "programlink",
        "scripturl", "functionlink", "methodurl", "processlink", "systemurl",
        "platformlink", "frameworkurl", "librarylink", "moduleurl", "packagelink"
    ],
    
    "social_media": [
        "socialink", "viralurl", "trendlink", "buzzurl", "hypelink",
        "popularurl", "famouslink", "knownurl", "recognizedlink", "notedurl",
        "remarkablelink", "notableurl", "prominentlink", "eminenturl", "distinguishedlink"
    ],
    
    "data_related": [
        "datalink", "infourl", "factlink", "truthurl", "realitylink",
        "actualurl", "genuinelink", "authenticurl", "validlink", "verifiedurl",
        "confirmedlink", "provenurl", "testedlink", "checkedurl", "approvedlink"
    ],
    
    "user_focused": [
        "youlink", "myurl", "ourlink", "usurl", "welink",
        "teamurl", "grouplink", "communityurl", "societylink", "publicurl",
        "peoplelink", "folkurl", "crowdlink", "massurl", "audiencelink"
    ],
    
    "brandable_invented": [
        "linkify", "urlito", "linkado", "urlify", "linkster",
        "urlster", "linkly", "urlly", "linkio", "urlio",
        "linkzy", "urlzy", "linkr", "urlr", "linkd",
        "urld", "linkn", "urln", "linkx", "urlx",
        "linkq", "urlq", "linkz", "urlz", "linkv"
    ],
    
    "two_syllable": [
        "zippy", "linko", "urbo", "clicky", "shorty",
        "quicky", "snappy", "crispy", "bouncy", "jumpy",
        "hoppy", "skippy", "flippy", "tippy", "dippy",
        "nippy", "chippy", "rippy", "sippy", "lippy"
    ],
    
    "compound_creative": [
        "linkpop", "urlhop", "linkdrop", "urlstop", "linktop",
        "urlshop", "linkspot", "urldot", "linkshot", "urlhot",
        "linkpot", "urlnot", "linkgot", "urllot", "linkbot"
    ],
    
    "minimalist": [
        "lnk", "url", "go", "to", "at",
        "on", "in", "by", "up", "it",
        "is", "be", "do", "my", "we"
    ],
    
    "acronym_style": [
        "gotourl", "asaplink", "pdqurl", "easyasurl", "quickaslink",
        "fastnowurl", "herenowlink", "gogeturl", "clicknowlink", "tapnowurl"
    ],
    
    "rhyming": [
        "blink", "shrink", "think", "wink", "pink",
        "sink", "rink", "mink", "kink", "fink"
    ],
    
    "alliteration": [
        "quickqlik", "fastfwd", "snapshort", "tinytwist", "briefburst",
        "crispclick", "dashdig", "flashfast", "gogoget", "hophit"
    ]
}

def check_domain_availability(domain: str, tld: str = ".com") -> Dict:
    """
    Check if a domain is available using a domain availability API
    You'll need to use a real API like:
    - Namecheap API
    - GoDaddy API
    - Domain.com API
    """
    # This is a placeholder - replace with actual API call
    # For testing, we'll simulate random availability
    import random
    time.sleep(0.1)  # Rate limiting
    
    return {
        "domain": f"{domain}{tld}",
        "available": random.choice([True, False]),
        "price": random.randint(10, 50) if random.choice([True, False]) else None
    }

def check_all_domains(domains: List[str], tlds: List[str] = [".com"]) -> List[Dict]:
    """Check availability for all domain combinations"""
    results = []
    total = len(domains) * len(tlds)
    
    for i, domain in enumerate(domains):
        for tld in tlds:
            result = check_domain_availability(domain, tld)
            results.append(result)
            
            # Progress indicator
            if (i + 1) % 10 == 0:
                print(f"Checked {i + 1}/{total} domains...")
    
    return results

def get_all_domain_suggestions() -> List[str]:
    """Flatten all domain suggestions into a single list"""
    all_domains = []
    for category, names in domain_names.items():
        all_domains.extend(names)
    return all_domains

def save_results(results: List[Dict], filename: str = "domain_availability.json"):
    """Save results to JSON file"""
    with open(filename, 'w') as f:
        json.dump(results, f, indent=2)
    
    # Also create a CSV for easy viewing
    available_domains = [r for r in results if r.get('available')]
    with open('available_domains.csv', 'w') as f:
        f.write("Domain,Price\n")
        for domain in available_domains:
            f.write(f"{domain['domain']},{domain.get('price', 'N/A')}\n")
    
    print(f"\nFound {len(available_domains)} available domains!")
    print("Results saved to domain_availability.json and available_domains.csv")

if __name__ == "__main__":
    # Get all domain suggestions
    domains = get_all_domain_suggestions()
    print(f"Checking {len(domains)} domain names...")
    
    # Check availability
    results = check_all_domains(domains, [".com", ".io", ".ai"])
    
    # Save results
    save_results(results)
    
    # Print top 10 available domains
    available = [r for r in results if r.get('available')][:10]
    print("\nTop 10 Available Domains:")
    for domain in available:
        print(f"  - {domain['domain']} (${domain.get('price', 'N/A')})")
