export interface IServiceQuery {
  page?: string;
  limit?: string;
  searchTerm?: string;
  categoryId?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
