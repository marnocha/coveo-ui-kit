import {ProductListingEngine} from '../../../../app/product-listing-engine/product-listing-engine';
import {configuration, numericFacetSet, search} from '../../../../app/reducers';
import {
  logFacetClearAll,
  logFacetUpdateSort,
} from '../../../../features/facets/facet-set/facet-set-analytics-actions';
import {RangeFacetSortCriterion} from '../../../../features/facets/range-facets/generic/interfaces/request';
import {getAnalyticsActionForToggleRangeFacetSelect} from '../../../../features/facets/range-facets/generic/range-facet-utils';
import {NumericRangeRequest} from '../../../../features/facets/range-facets/numeric-facet-set/interfaces/request';
import {NumericFacetValue} from '../../../../features/facets/range-facets/numeric-facet-set/interfaces/response';
import {fetchProductListing} from '../../../../features/product-listing/product-listing-actions';
import {
  ConfigurationSection,
  NumericFacetSection,
  SearchSection,
} from '../../../../state/state-sections';
import {loadReducerError} from '../../../../utils/errors';
import {
  buildCoreNumericFacet,
  buildNumericRange,
  NumericFacet,
  NumericFacetOptions,
  NumericFacetProps,
  NumericFacetState,
  NumericRangeOptions,
} from '../../../core/facets/range-facet/numeric-facet/headless-core-numeric-facet';

export type {
  NumericRangeOptions,
  NumericRangeRequest,
  NumericFacetValue,
  NumericFacetOptions,
  NumericFacetProps,
  NumericFacet,
  NumericFacetState,
};
export {buildNumericRange};

/**
 * Creates a `NumericFacet` controller instance for the product listing.
 *
 * @param engine - The headless engine.
 * @param props - The configurable `NumericFacet` properties.
 * @returns A `NumericFacet` controller instance.
 */
export function buildNumericFacet(
  engine: ProductListingEngine,
  props: NumericFacetProps
): NumericFacet {
  if (!loadNumericFacetReducers(engine)) {
    throw loadReducerError;
  }

  const coreController = buildCoreNumericFacet(engine, props);
  const dispatch = engine.dispatch;
  const getFacetId = () => coreController.state.facetId;

  return {
    ...coreController,

    deselectAll() {
      coreController.deselectAll();
      dispatch(fetchProductListing()).then(() =>
        dispatch(logFacetClearAll(getFacetId()))
      );
    },

    sortBy(criterion: RangeFacetSortCriterion) {
      coreController.sortBy(criterion);
      dispatch(fetchProductListing()).then(() =>
        dispatch(logFacetUpdateSort({facetId: getFacetId(), criterion}))
      );
    },

    toggleSelect: (selection: NumericFacetValue) => {
      coreController.toggleSelect(selection);
      dispatch(fetchProductListing()).then(() =>
        dispatch(
          getAnalyticsActionForToggleRangeFacetSelect(getFacetId(), selection)
        )
      );
    },

    get state() {
      return {
        ...coreController.state,
      };
    },
  };
}

function loadNumericFacetReducers(
  engine: ProductListingEngine
): engine is ProductListingEngine<
  NumericFacetSection & ConfigurationSection & SearchSection
> {
  engine.addReducers({numericFacetSet, configuration, search});
  return true;
}
