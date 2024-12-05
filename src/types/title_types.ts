export interface LoadingState {
    search_results: boolean;
    new_title: boolean;
    generate: boolean;
}
  
export interface StageTypes {
    title_list: boolean;
    search_results: boolean;
    search_bar: boolean;
    forum: boolean;
    loading: LoadingState;
}

export interface TitleMember {
    id: string,
    title: string,
    plot: string, 
    poster_path:  string,  
    backdrop_path: string,
    cast: CastMember[],
    crew: CrewMember[]
}

export interface CastMember {
    name: string;
    character: string;
}
  
export interface CrewMember {
    name: string;
    job: string;
}