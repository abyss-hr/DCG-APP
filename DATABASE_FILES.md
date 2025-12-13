src/
  firebase/
    firebaseConfig.ts      ← initialize app, export db + storage

  services/
    listingService.ts      ← fetch listings & categories from Firestore

  adapters/
    listingAdapter.ts      ← convert Firebase listing → ResultCardItem

  hooks/
    useListings.ts         ← SearchScreen data source

  types/
    Listing.ts             ← your Firebase listing model

  components/
    ... (cards, UI, etc.)
