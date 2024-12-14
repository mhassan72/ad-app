import { API } from '@/keys';
import axios from 'axios';

class Client {
    private static API_BASE_URL = API.BASE_URL;
    private static API_KEY = API.KEY;
  
    public static getHeaders(): Record<string, string> {
      return {
        accept: 'application/json',
        Authorization: `Bearer ${this.API_KEY}`,
      };
    }
  
    public static async fetchFromAPI(endpoint: string, params: Record<string, string | number> = {}): Promise<any> {
      try {
        const url = `${this.API_BASE_URL}${endpoint}`;
        const response = await axios.get(url, { headers: this.getHeaders(), params });
        return response.data;
      } catch (error) {
        console.error(`Error fetching data from TMDB API: ${error}`);
        throw error;
      }
    }
}

export default Client