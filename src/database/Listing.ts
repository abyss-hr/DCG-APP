export type Listing = {
  id: string;

  title: string;
  description: string;
  descriptionFeatured?: string;

  categoryId: string;
  categoryName: string;
  categoryIcon?: string;

  filterMain?: string;
  filterMainIcon?: string;
  filterExtra?: string;
  filterExtraIcon?: string;

  locationMain: string;
  locationSub?: string;

  googleMapUrl: string;
  coordinates: string;

  youtubeUrl?: string;
  phone: string;
  whatsapp?: string;
  email: string;

  website?: string;
  facebook?: string;
  instagram?: string;

  priceLevel?: string;
  workingPeriod?: string;

  featuredImageUrl: string;
  galleryImageUrls: string[];

  featured: boolean;
  popular: boolean;
  status: string;

  createdAt?: any;
  updatedAt?: any;
};
