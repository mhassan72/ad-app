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