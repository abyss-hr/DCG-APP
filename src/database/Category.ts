// File: src/database/Category.ts
// Category type definition

export type Filter = {
  label: string;
  icon: string;
};

export type Category = {
  id: string;
  key: string;
  name: string;
  filterLabel: string;
  filters: Filter[];
  extraFilterLabel: string;
  extras: Filter[];
  createdAt?: any;
  updatedAt?: any;
};
