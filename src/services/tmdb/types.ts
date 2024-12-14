export interface TitleSummary {
    id: string;
    title: string;
    plot: string;
    year: number | null;
    poster_path: string | null;
    backdrop_path: string | null;
    list_type: string; // Lowercase type of title, default is "movie"
    original_name:  string,
    original_language: string,
    origin_country: string,
    adult: string,
    popularity: string | number,
    vote_average: string | number,
    vote_count: string | number,
}
  