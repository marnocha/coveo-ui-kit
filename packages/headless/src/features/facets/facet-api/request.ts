export interface BaseFacetRequest {
  facetId: string;
  field: string;
  filterFacetCount: boolean;
  injectionDepth: number;
  isFieldExpanded: boolean;
  numberOfValues: number;
  preventAutoSelect: boolean;
}

export interface CurrentValues<T> {
  currentValues: T[];
}

export interface Freezable {
  freezeCurrentValues: boolean;
}

export interface Delimitable {
  delimitingCharacter: string;
}

export interface Type<
  T extends 'specific' | 'dateRange' | 'numericalRange' | 'hierarchical'
> {
  type: T;
}

export interface SortCriteria<
  T extends
    | 'score'
    | 'alphanumeric'
    | 'ascending'
    | 'descending'
    | 'occurrences'
> {
  sortCriteria: T;
}
