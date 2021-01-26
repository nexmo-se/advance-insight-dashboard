import { SearchContext } from "../contexts/search";
import { useContext } from "react";

export function useSearch() {
  return useContext(SearchContext);
}
