import Client from './client'
import  DataProcessor from  './data_processor'
import { getTitle, updateTitle } from '@/model/title';
import { base_image_url } from '@/stores/title_model';
import type { TitleSummary } from './types';
import { results } from '@/stores/search'

class TMDBService {
    public static async searchTitles(query: string, type: "movie" | "tv" = "movie"): Promise<TitleSummary[]> {
      const paramsOption : any = {
        query,
        include_adult: false,
        language: "en-US",
        page: 1,
      };
  
      const data = await Client.fetchFromAPI(`/search/${type}`, paramsOption);
      return DataProcessor.processSearchResults(data, type);
    }
  
    public static async fetchDetails(id: string, type: "movie" | "tv" = "movie"): Promise<void> {
      try {
        const details = await Client.fetchFromAPI(`/${type}/${id}`, { language: "en-US" });
        const credits = await Client.fetchFromAPI(`/${type}/${id}/credits`, { language: "en-US" });
  
        updateTitle({
          id: details.id,
          title: type === "movie" ? details.title : details.name,
          plot: details.overview,
          poster_path: details.poster_path ? `${base_image_url}${details.poster_path}` : null,
          backdrop_path: details.backdrop_path ? `${base_image_url}${details.backdrop_path}` : null,
          year: details.release_date || details.first_air_date
            ? new Date(details.release_date || details.first_air_date).getFullYear()
            : null,
          genres: details.genres.map((genre: any) => genre.name),
          original_name:  details.original_name,
          original_language: details.original_language,
          origin_country: details.origin_country,
          adult: details.adult,
          popularity:  details.popularity,
          vote_average: details.vote_average,
          vote_count:  details.vote_count,
          cast: DataProcessor.processPeople(credits.cast, "character"),
          crew: DataProcessor.processPeople(credits.crew, "job"),
          list_type: type, // Lowercase list_type in details
        });
      } catch (error) {
        console.error(`Failed to fetch ${type} details:`, error);
      }
  
      await getTitle(id);
    }
  
    public static async run(query: string): Promise<TitleSummary[]> {
      try {
        console.log(`Searching for both movies and TV shows with query: "${query}"`);
        // Execute both searches in parallel
        const [movies, tvShows] = await Promise.all([
          TMDBService.searchTitles(query, "movie"),
          TMDBService.searchTitles(query, "tv"),
        ]);
        
        // Sort each list by year in descending order
        const sortedMovies = movies.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
        const sortedTVShows = tvShows.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
        
        // Interleave movies and TV shows
        const mixedResults: TitleSummary[] = [];
        const maxLength = Math.max(sortedMovies.length, sortedTVShows.length);
        for (let i = 0; i < maxLength; i++) {
          if (i < sortedMovies.length) mixedResults.push(sortedMovies[i]);
          if (i < sortedTVShows.length) mixedResults.push(sortedTVShows[i]);
        }
        
        console.log(`Found ${mixedResults.length} combined results for query: "${query}"`,mixedResults);
        
        // Update the global store and return mixed results
        results.value.data = mixedResults;
        results.value.meta =  {movies: movies.length, tv: tvShows.length}
        return mixedResults;

        // Optionally, you can sort or manipulate the combined results here
        // results.value.data = combinedResults; // Update the global `results` store
        // results.value.meta =  {movies: movies.length, tv: tvShows.length}
        // return combinedResults;
      } catch (error) {
        console.error(`Error in TMDBService run:`, error);
        return [];
      }
    }
  }
  
  export default TMDBService;