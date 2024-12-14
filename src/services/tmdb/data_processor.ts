import { base_image_url } from '@/stores/title_model';
import type { TitleSummary } from './types'

class DataProcessor {
    public static processPeople(people: any[], roleKey: string): any[] {
      return people.map((person: any) => ({
        name: person.name || "Unknown",
        role: person[roleKey] || "Unknown",
        profile_path: person.profile_path ? `${base_image_url}${person.profile_path}` : null,
      }));
    }
  
    public static processSearchResults(data: any, type: "movie" | "tv"): TitleSummary[] {
      return data.results.map((item: any): TitleSummary => ({
        id: item.id,
        original_name:  item.original_name,
        original_language: item.original_language,
        origin_country: item.origin_country,
        adult: item.adult,
        popularity: item.popularity,
        vote_average: item.vote_average,
        vote_count: item.vote_count,
        plot: item.overview,
        title: type === "movie" ? item.title : item.name, // Adjust field based on type
        year: item.release_date || item.first_air_date
          ? new Date(item.release_date || item.first_air_date).getFullYear()
          : null,
        poster_path: item.poster_path ? `${base_image_url}${item.poster_path}` : null,
        backdrop_path: item.backdrop_path ? `${base_image_url}${item.backdrop_path}` : null,
        list_type: type, // Lowercase list_type,
      }));
    }
}


export default DataProcessor;