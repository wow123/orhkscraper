# OpenRice Search "API" Documentation

The primary search URL for OpenRice (in English) is:

`http://www.openrice.com/english/restaurant/sr1.htm`

## Parameters
These are some of the known query parameters that can be used with the search URL.
Most of these parameters are optional, but some of them have to be used together.
These are noted

### tc
*(Optional)*  
Unknown effect.
##### Known values:
* `sr1quick`

### s
*(Optional)*  
Unknown effect.
##### Known values:
* `1`

### region
*(Optional)*  
Unknown effect. Presumably something to do with region.
##### Known values:
* `0`

### inputstrwhat
*(Optional)*  
Search keywords (e.g. restaurant name, cuisine, dishes)
##### Known values:
* `Dim Sum`
* `KFC`
* etc.

### inputstrwhere
*(Optional)*  
Location search filter
##### Known values:
* `Central`
* `Mong kok`
* etc.

### searchSort
*(Optional)*  
Sort search results
##### Values:
* `1`  -- Overall Score
* `2`  -- Smile
* `4`  -- Price
* `10` -- Cry
* `20` -- Review(s)
* `21` -- Environment
* `23` -- Value for Money
* `25` -- Taste
* `27` -- Hygiene
* `29` -- Service
* `31` -- Overall *[Default]*
* `42` -- Name

### cuisine_id
*(Optional)*  
Comma-separated list of ID numbers that specify the type(s) of cuisine to search for
##### Known values:
* 1001^chiu chow
*`1002` -- Guangdong
* 1005^Hakka
* `1008` -- Sichuan
* 1009^taiwanese
*`1010` -- Beijing
*`1011` -- Shanghai
 `1023` -- Anhui
* `1999` -- All Chinese
* `2001` -- Korean
* 2002^vietnamese
* `2004` -- Thai
* `2009` -- Japanese
* 2024^malaysian
*`2999` -- All Asian
* 3006^Italian
 `3999` -- All European
* 4001^american
 `4002` -- Mexican
 `4004` -- Brazilian
 `4005` -- Argentinian
 `4999` -- All North & South American
 `5001` -- African
 `5004` -- Egyptian
 `5005` -- Moroccan
 `5999` -- All Others
 `6000` -- International *[Included in 5999]*

### district_id
*(Optional)*  
Comma-separated list of ID numbers that specify the districts to search within
##### Known values:
* -9151^cyberport
* -9008^knutsford terrace
* -9007^Lan Kwai Fong
* 1002^the peak
* `1003` -- Central
* 1007^Shek O
* 1008^Western District
* 1009^sai wan ho
* 1010^stanley
* 1011^admiralty
* `1012` -- Aberdeen
* 1013^Chai Wan
* 1014^quarry bay
* 1015^repulse bay
* 1016^deep water bay
* 1017^happy valley
* 1018^shau kei wan
* `1019` -- Causeway Bay
* 1020^Ap Lei Chau
* 1021^po fu lam
* `1022` -- Wanchai
* 1023^tai koo"
* 1023^tai koo shing"
* 1023^tai koo place"
* 1025^tai hang
* 1026^tin hau
* 1027^wong chuk hang
* `1999` -- Hong Kong
* `1999` -- HK
* `1999` -- HKG
* 2001^kowloon city
* 2002^kowloon tong
* 2003^kowloon bay
* 2004^to kwa wan
* 2005^tai kok tsui
* 2006^ngau tau kok
* 2007^shek kip mei
* `2008` -- Tsim Sha Tsui
* 2009^ho man tin
* 2010^mongkok
* 2011^yau ma tei
* 2012^yau tong
* 2013^cheung sha wan
* 2015^hung hum
* 2016^lai chi kok
* 2019^sham shui po
* 2020^wong tai sin
* 2021^tsz wan shan
* 2022^san po kong
* 2024^lam tin
* 2026^kwun tong
* 2027^diamond hill
* 2028^jordan
* 2029^price edward
* 2030^lok fu
* 2031^mei foo
* 2032^choi hung
* 2999^kowloon
* 2999^all kowloon
* 3001^sheung shui
* 3002^tai po
* 3003^yuen long
* 3004^tin shui wai
* 3005^tuen mun
* 3006^sai kung
* 3007^sha tin
* 3008^fanling
* 3009^ma on shan
* 3010^sham tseng
* 3011^lo wu
* 3012^tai wai
* 3013^fo tan
* 3014^tai wo
* 3015^kwai fong
* 3016^lau fau shan
* 3017^tsing yi
* 3018^tsuen wan
* 3019^kwai chung
* `3020` -- Tseung Kwan O
* 3021^lok ma chau
* 3022^ma wan
* 3999^new territories
* 4001^lantau island
* 4002^chek lap kok
* 4003^ping chau
* 4004^cheung chau
* 4005^lamma island
* 4006^discovery bay
* 4010^tai o
* 4999^outlying island

### dishes_id
*(Optional)*  
Comma-separated list of ID numbers that specify the type(s) of dishes to search for
##### Known values:
* `1001` -- Hot Pot
* `1003` -- Bakery
* `1004` -- Noodle
* 1015^ramen
* `1014` -- Dessert
* 1018^congee
* `1019` -- BBQ
* 1020^Chinese BBQ
* 1022^Pizza
* `1032` -- Buffet
* 1036^dim sum
* 1039^Wonton
* 1039^Dumpling
* 1202^sweet soup

### amenity_id
*(Optional)*  
Comma-separated list of ID numbers that specify what type of restaurant to search for
##### Known values:
* `1005` -- Dim Sum Restaurant

### theme_id
*(Optional)*  
Comma-separated list of ID numbers that specify the occasions a restaurant needs to cater to
##### Known values:
* `1` -- Romantic Dining

### price
*(Optional)*  
Comma-separated list of ID numbers that specify a price range to search within
##### Values:
* `1` -- Below $50
* `2` -- $51-$100
* `3` -- $100-$200
* `4` -- $201-$400
* `5` -- $401-$800
* `6` -- Above $800
##### Example:
`price=1,2,3` will search for restaurants with prices below $200

### condition
*(Optional)*  
Comma-separated list of IDs that specify additional features required of a restaurant
##### Known values:
* `booking` -- Phone Reservation
* `onlinebooking` -- Online Reservation
* `wifi` -- WiFi

#### award
*(Optional)*  
Sub-category of **condition**. Specifies whether to search for award winning restaurants
##### Known values:
* `20` -- Award winner

### Co-ordinates
*(Optional)*  
A set of parameters that **have to all be specified** at the same time to provide
filtering based on exact location.

#### currentlocation=1
Enables the "Current Location" filter.
##### Values:
* `1` -- Enables Current Location

##### Example:
`currentlocation=1`

#### x
*x* coordinate
##### Example:
`x=22.3172964`

#### y
*y* coordinate
##### Example:
`y=114.16761939`

#### z
Unknown effect. Presumably the z coordinate or elevation. Exact effect is unclear
but it definitely has an effect on the search results
##### Example:
`z=10`

#### wxh
Unsure. Width by height? Not sure what this affects,
but results do change if this is different
##### Example:
`wxh=5x5`
