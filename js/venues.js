
//initial data of each venue
var breweryModel = function() {
    this.venues = [{
        "index": 0,
        "fSqrID": "40b28c80f964a52073f81ee3",
        "untppdID": 634,
        "name": "Harpoon Brewery",
        "contact": {
            "formattedPhone": "(617) 456-2322",
            "twitter": "harpoonbrewery",
            "facebook": "TheHarpoonBrewery"
        },
        "location": {
            "address": "306 Northern Ave",
            "lat": 42.34699969120303,
            "lng": -71.03450775146484,
            "postalCode": "02210",
            "city": "Boston",
            "state": "MA",
            "country": "United States"
        },
        "url": "http://www.harpoonbrewery.com"
    }, {
        "index": 1,
        "fSqrID": "4a7daee1f964a5202aef1fe3",
        "untppdID": 157,
        "name": "Samuel Adams Brewery",
        "contact": {
            "formattedPhone": "(617) 368-5080",
            "twitter": "samueladamsbeer",
            "facebook": "117341921610"
        },
        "location": {
            "address": "30 Germania St",
            "lat": 42.31451354657694,
            "lng": -71.1031807831952,
            "postalCode": "02130",
            "city": "Boston",
            "state": "MA",
            "country": "United States"
        },
        "url": "http://www.samueladams.com/"
    }, {
        "index": 2,
        "fSqrID": "4ecc6c5c7beb7e03659ff7c1",
        "untppdID": 20827,
        "name": "Night Shift Brewing, Inc.",
        "contact": {
            "formattedPhone": "(617) 294-4233",
            "twitter": "nightshiftbeer",
            "facebook": "114734011901932"
        },
        "location": {
            "address": "87 Santilli Hwy",
            "lat": 42.40574533555862,
            "lng": -71.06781005859375,
            "postalCode": "02149",
            "city": "Everett",
            "state": "MA",
            "country": "United States"
        },
        "url": "http://www.nightshiftbrewing.com"
    }, {
        "index": 3,
        "fSqrID": "40b28c80f964a52044f81ee3",
        "untppdID": 1506,
        "name": "Cambridge Brewing Company",
        "contact": {
            "formattedPhone": "(617) 494-1994",
            "twitter": "cambridgebrewer",
            "facebook": "CambridgeBrewing"
        },
        "location": {
            "address": "1 Kendall Square, Building 100",
            "lat": 42.36645556205954,
            "lng": -71.09083414077759,
            "postalCode": "02139",
            "city": "Cambridge",
            "state": "MA",
            "country": "United States"
        },
        "url": "http://cambridgebrewingcompany.com"
    }, {
        "index": 4,
        "fSqrID": "52a1da9d11d2623b045bd2a0",
        "untppdID": 118327,
        "name": "Aeronaut Brewing Company",
        "contact": {
            "formattedPhone": "(617) 987-4236",
            "twitter": "aeronautbrewing",
            "facebook": "255897267908139"
        },
        "location": {
            "address": "14 Tyler St",
            "lat": 42.381443731437365,
            "lng": -71.10440611839294,
            "postalCode": "02143",
            "city": "Somerville",
            "state": "MA",
            "country": "United States"
        },
        "url": "http://www.aeronautbrewing.com"
    }, {
        "index": 5,
        "fSqrID": "521aa6b2498eaada1823de98",
        "untppdID": 22486,
        "name": "Downeast Cider House",
        "contact": {
            "formattedPhone": "(857) 301-8881 ",
            "twitter": "downeastcider",
            "facebook": "downeastcider"
        },
        "location": {
            "address": "200 Terminal St",
            "lat": 42.38269984863099,
            "lng": -71.05047225952148,
            "postalCode": "02129",
            "city": "Boston",
            "state": "MA",
            "country": "United States"
        },
        "url": "http://www.downeastcider.com"
    }, {
        "index": 6,
        "fSqrID": "4e3d729daeb73139a178d4fa",
        "untppdID": 23038,
        "name": "Trillium Brewing Company",
        "contact": {
            "formattedPhone": "(617) 453-8745",
            "twitter": "trilliumbrewing"
        },
        "location": {
            "address": "369 Congress St",
            "lat": 42.349784376011634,
            "lng": -71.04776002495406,
            "postalCode": "02210",
            "city": "Boston",
            "state": "MA",
            "country": "United States"
        },
        "url": "http://www.trilliumbrewing.com"
    }, {
        "index": 7,
        "fSqrID": "4e28903d18a83a136233a915",
        "untppdID": 14088,
        "name": "Jack's Abby Brewing",
        "contact": {
            "formattedPhone": "(508) 872-0900",
            "twitter": "jacksabby"
        },
        "location": {
            "address": "81 Morton St",
            "lat": 42.27914862774787,
            "lng": -71.40211437391038,
            "postalCode": "01702",
            "city": "Framingham",
            "state": "MA",
            "country": "United States"
        },
        "url": "http://jacksabbybrewing.com"
    }, {
        "index": 8,
        "fSqrID": "40b28c80f964a52038f81ee3",
        "untppdID": 16871,
        "name": "John Harvard's Brewery & Ale House",
        "contact": {
            "formattedPhone": "(617) 868-3585",
            "twitter": "brewersjhbh1"
        },
        "location": {
            "address": "33 Dunster St",
            "lat": 42.372439371668804,
            "lng": -71.1193413252859,
            "postalCode": "02138",
            "city": "Cambridge",
            "state": "MA",
            "country": "United States"
        },
        "url": "http://www.johnharvards.com"
    }, {
        "index": 9,
        "fSqrID": "4a469a33f964a5202ea91fe3",
        "untppdID": 337,
        "name": "Cape Ann Brewing Company",
        "contact": {
            "formattedPhone": "(978) 281-4782",
            "twitter": "capeannbrewing",
            "facebook": "capeannbrewing"
        },
        "location": {
            "address": "11 Rogers St",
            "lat": 42.61117410010077,
            "lng": -70.66505718207047,
            "postalCode": "01930",
            "city": "Gloucester",
            "state": "MA",
            "country": "United States"
        },
        "url": "http://capeannbrewing.com"
    },  {
        "index": 10,
        "fSqrID": "55318dd1498ecba13d173b31",
        "untppdID": 16923,
        "name": "Somerville Brewing Company, Slumbrew",
        "contact": {},
        "location": {
            "address": "15 Ward St",
            "lat": 42.37485363967085,
            "lng": -71.08909127918604,
            "postalCode": "02143",
            "city": "Somerville",
            "state": "MA",
            "country": "United States"
        },
        "url": "http://www.slumbrew.com/"
    }, {
        "index": 11,
        "fSqrID": "531bb084498ebc415d3aa083",
        "untppdID": 26766,
        "name": "Bantam Cidery",
        "contact": {
            "formattedPhone": "(617) 299-8600",
            "twitter": "bantamcider"
        },
        "location": {
            "address": "230 Somerville Ave",
            "lat": 42.37788410956959,
            "lng": -71.09174325380668,
            "postalCode": "02143",
            "city": "Somerville",
            "state": "MA",
            "country": "United States"
        },
        "url": "http://www.bantamcider.com"
    }, {
        "index": 12,
        "fSqrID": "5418c4bb498ee66fc36b1677",
        "untppdID": 199369,
        "name": "Lord Hobo Brewing Company",
        "contact": {},
        "location": {
            "address": "5 Draper St",
            "lat": 42.47651087399613,
            "lng": -71.12831203098834,
            "postalCode": "01801",
            "city": "Woburn",
            "state": "MA",
            "country": "United States"
        },
        "url": "http://www.lordhobo.com/"
    }, {
        "index": 13,
        "fSqrID": "4b854616f964a520105431e3",
        "untppdID": 1898,
        "name": "The Tap Brewing Company",
        "contact": {
            "formattedPhone": "(978) 374-1117",
            "twitter": "tapbrewingco"
        },
        "location": {
            "address": "100 Washington St",
            "lat": 42.772733168204624,
            "lng": -71.08529608182258,
            "postalCode": "01832",
            "city": "Haverhill",
            "state": "MA",
            "country": "United States"
        },
        "url": "http://www.tapbrewingcompany.com"
    }, {
        "index": 14,
        "fSqrID": "4b9bf6a5f964a5202d3b36e3",
        "untppdID": 1608,
        "name": "Blue Hills Brewery",
        "contact": {
            "formattedPhone": "(781) 821-2337",
            "twitter": "bhbcanton"
        },
        "location": {
            "address": "1020 Turnpike St #3B",
            "lat": 42.1506788,
            "lng": -71.10501229763031,
            "postalCode": "02021",
            "city": "Canton",
            "state": "MA",
            "country": "United States"
        },
        "url": "http://bluehillsbrewery.com"
    }, {
        "index": 15,
        "fSqrID": "4b22ae1cf964a520ac4b24e3",
        "untppdID": 3566,
        "name": "Martha's Exchange Restaurant and Brewing Co.",
        "contact": {
            "formattedPhone": "(603) 883-8781",
            "twitter": "marthasexchange"
        },
        "location": {
            "address": "185 Main St",
            "lat": 42.7605740208766,
            "lng": -71.465203,
            "postalCode": "03060",
            "city": "Nashua",
            "state": "NH",
            "country": "United States"
        },
        "url": "http://marthas-exchange.com"
    }, {
        "index": 16,
        "fSqrID": "4eda6a27f790c04545b983c0",
        "untppdID": 11459,
        "name": "Mystic Brewery",
        "contact": {
            "formattedPhone": "(617) 466-2079"
        },
        "location": {
            "address": "174 Williams St",
            "lat": 42.39181587806693,
            "lng": -71.04426043074731,
            "postalCode": "02150",
            "city": "Chelsea",
            "state": "MA",
            "country": "United States"
        },
        "url": "http://mystic-brewery.com"
    }, {
        "index": 17,
        "fSqrID": "4a467aa4f964a520eda81fe3",
        "untppdID": 1013,
        "name": "Portsmouth Brewery",
        "contact": {
            "formattedPhone": "(603) 431-1115",
            "twitter": "portsbrew"
        },
        "location": {
            "address": "56 Market St",
            "lat": 43.077966411305916,
            "lng": -70.75777693869185,
            "postalCode": "03801",
            "city": "Portsmouth",
            "state": "NH",
            "country": "United States"
        },
        "url": "http://portsmouthbrewery.com"
    }, {
        "index": 18,
        "fSqrID": "51fc10c6498e560efe8203b7",
        "untppdID": 1160,
        "name": "Smuttynose Brewing Company",
        "contact": {
            "formattedPhone": "(603) 436-4026",
            "twitter": "smuttynosebeer",
            "facebook": "43031114818"
        },
        "location": {
            "address": "110 Towle Farm Rd",
            "lat": 42.94550688054216,
            "lng": -70.85400251923296,
            "postalCode": "03842",
            "city": "Hampton",
            "state": "NH",
            "country": "United States"
        },
        "url": "http://www.smuttynose.com"
    }, {
        "index": 19,
        "fSqrID": "559db002498e4d176e78d73c",
        "untppdID": 14011,
        "name": "Throwback Brewery @ Hobbs Farm",
        "contact": {
            "twitter": "thrwbck"
        },
        "location": {
            "address": "7 Hobbs Road",
            "lat": 42.980869705398185,
            "lng": -70.8347834310706,
            "postalCode": "03862",
            "city": "North Hampton",
            "state": "NH",
            "country": "United States"
        },
        "url": "http://throwbackbrewery.com/"
    }];
};