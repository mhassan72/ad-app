import axios from 'axios';
import { API } from '@/keys';
import { getTitle, updateTitle } from '@/model/title';
import { base_image_url } from '@/stores/title_model'

interface TitleSummary {
  id: string;
  title: string;
  year: number | null;
  poster_path: string | null;
  backdrop_path: string | null;
}

class TMDBService {
  private static API_BASE_URL = API.BASE_URL;
  private static API_KEY = API.KEY;

  private static getHeaders(): Record<string, string> {
    return {
      accept: 'application/json',
      Authorization: `Bearer ${this.API_KEY}`,
    };
  }

  private static async fetchFromAPI(endpoint: string, params: Record<string, string | number> = {}): Promise<any> {
    try {
      const url = `${this.API_BASE_URL}${endpoint}`;
      const response = await axios.get(url, { headers: this.getHeaders(), params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching data from TMDB API: ${error}`);
      throw error;
    }
  }

  private static processPeople(people: any[], roleKey: string): any[] {
    return people.map((person: any) => ({
      name: person.name || "Unknown",
      role: person[roleKey] || "Unknown",
      profile_path: `${base_image_url}${person.profile_path}` ? `${base_image_url}${person.profile_path}` : null,
    }));
  }

  public static async searchTitles(query: string): Promise<TitleSummary[]> {
    const paramsOption : any = {
      query,
      include_adult: false,
      language: "en-US",
      page: 1,
    };

    const data = await this.fetchFromAPI("/search/movie", paramsOption);
    return data.results.map((item: any): TitleSummary => ({
      id: item.id,
      title: item.title,
      year: item.release_date ? new Date(item.release_date).getFullYear() : null,
      poster_path: `${base_image_url}${item.poster_path}` || null,
      backdrop_path: `${base_image_url}${item.backdrop_path}` || null,
    }));
  }

  public static async fetchDetails(id: string): Promise<void> {
    try {
      const movieDetails = await this.fetchFromAPI(`/movie/${id}`, { language: "en-US" });
      const credits = await this.fetchFromAPI(`/movie/${id}/credits`, { language: "en-US" });

      updateTitle({
        id: movieDetails.id,
        title: movieDetails.title,
        plot: movieDetails.overview,
        poster_path: `${base_image_url}${movieDetails.poster_path}`,
        backdrop_path: `${base_image_url}${movieDetails.backdrop_path}`,
        year: movieDetails.release_date ? new Date(movieDetails.release_date).getFullYear() : null,
        genres: movieDetails.genres.map((genre: any) => genre.name),
        cast: this.processPeople(credits.cast, "character"),
        crew: this.processPeople(credits.crew, "job"),
      })
    } catch (error) {
      console.error("Failed to fetch details:", error);
    }

    await getTitle(id)
  }
}

export default TMDBService;
