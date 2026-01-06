app/(drawer)/(listing)/[id].tsx - this is route file where all components will show up,..

src/pages/ - main folder for all pages 

first we will finish with listing , but later we will add homepage, search, explore, place, etc,..

OK, now let's start with file structure, and here is what I think will be good:

src/pages/listing

 header/ - ListingHeader.tsx - please check but I think we can have in (listing)/_layout - for now we don't have layout for lisiting ID, but maybe is not bad idea,.. or if can be handled from universal header, if that is better option tell me,..
 
header/ - if needed, we can create, no problem, if will be more simple,..

media/
│   │   ├── ListingGallery.tsx 
│   │   └── ListingVideo.tsx


content/
│   │   ├── ListingTitle.tsx
│   │   ├── ListingDescription.tsx
│   │   ├── ListingInfoCard.tsx
│   │  └── ListingTags.tsx
│   │  └── ListingBadges.tsx

map/
│   │   └── ListingMapSection.tsx
│   │   └── ListingMapButton.tsx

contacts/
│       ├── ListingContactBar.tsx
│       └── ListingSocialLinks.tsx


├── types.ts
└── index.ts


src/pages/search/                # ← FUTURE
├── SearchPage.tsx
└── components/
    └── SearchFilters.tsx

src/pages/explore/               # ← FUTURE
└── ExplorePage.tsx


Now to explain some things about all files, and for you please add all that plans and ideas in LISTING TODO that we can fallow and doing step by step

first of all, this all components for ID page need to be in separated "like" cards shown on page, and if something is not provided by database then do not show! Cards need to look like before to be little bit diferent then bacground, but to be little bit separated from other contents,..ok, let's go

media/ListingGallery.tsx:
- need to have, image swiper like before + with arrows and auto slide after like 2 second, with lazy load etc for better performance
- right bottom corner image index of image sliding
- right top corrner - small like button badge if is seasonal open or working whole year around etc
- top left corner - few icons and tags in badges: - first if is featured to have icon badge + featured sign, second to be icon in badge if is popular (something like start in badge + Popular sign) 
- bottom left - badge with price simbols (like $$)

media/ListingVideo.tsx:
- need to show youtube player in card, with option to press play to play video - remember that youtube card need to be located under Map card - maybe is better to make that separated outside of meadia folder - to be from video folder this file, and Lisitng Gallery from Images folder for example, to be separated, then inside images folder we can separate badges from images etc,.. tell me if taht is good idea, give me suggestion,..

content/ListingTitle.tsx:
- We want to have full title under images slider but on right side of title part (in same row) we want to have SVG Luscide icon for every category diferent icon to be shown, like if restaurant category is Traditional we can show fish icon, if is Pizza we show pizza icon, if is Experience for hike we show hike icon, kayak icon for kayaking, etc,.. icons we can import from component icons 

content/ListingDescription.tsx:
- we have main description and featured, and we can show them on separated cards, because if featured is not provided then we will not show that second card with description

content/ListingInfoCard.tsx:
- this is probably for categories etc,, what we can make like small chops for categories if user click to go on that whole category with other lisitngs from that categorie etc

content/ListingTags.tsx - for now I don't remember what was tags and whare we use that??

content/ListingBadges.tsx - same for badges, we put that on list but don't remember what king of badges,..

map/ListingMapSection.tsx:
- Map need to be shown in one card, with map pin of location, on right side we need buttons inside of map for zoom in/out, and also button for full screen open in map.tsx file (lisitng/map.tsx) 

map/ListingMapButton.tsx: this file is just that user have option on press button "Open map & take me there" to open map on ther phone, google map or ios maps and open that location there to show them direction etc

contacts/ListingContactBar.tsx:
- Contact bar need to stay like now on bottom of page, but only what we need need is to make modern buttons for actions, for example blue button outline rounded with phone icon and text Phone for call, also greeen one for whatsapp, white for mail for example etc - also what is not provided we will not display button

contacts/ListingSocialLinks.tsx:
- This need to be like small cards in one card on bottom of all content with social networks icons and names, if is provided,..

please now because is longer list, make that in LISITNG TODO that we can fallow one by one to finish whole page :)
