import {ArrayValue} from '@coveo/bueno';
import type {CategoryFacetMetadata} from 'coveo.analytics/dist/definitions/searchPage/searchPageEvents';
import {InsightAppState} from '../../../state/insight-app-state';
import {
  requiredNonEmptyString,
  validatePayload,
} from '../../../utils/validate-payload';
import {
  AnalyticsType,
  makeInsightAnalyticsAction,
} from '../../analytics/analytics-utils';
import {facetIdDefinition} from '../generic/facet-actions-validation';
import {LogCategoryFacetBreadcrumbActionCreatorPayload} from './category-facet-set-analytics-actions';

const categoryFacetBreadcrumbPayloadDefinition = {
  categoryFacetId: facetIdDefinition,
  categoryFacetPath: new ArrayValue({
    required: true,
    each: requiredNonEmptyString,
  }),
};

const getCategoryFacetMetadata = (
  state: Partial<InsightAppState>,
  {
    categoryFacetId,
    categoryFacetPath,
  }: LogCategoryFacetBreadcrumbActionCreatorPayload
): CategoryFacetMetadata => {
  const facet = state.categoryFacetSet![categoryFacetId]!;
  const categoryFacetField = facet?.request.field;
  const categoryFacetTitle = `${categoryFacetField}_${categoryFacetId}`;
  return {
    categoryFacetId,
    categoryFacetPath,
    categoryFacetField,
    categoryFacetTitle,
  };
};

export const logCategoryFacetBreadcrumb = (
  payload: LogCategoryFacetBreadcrumbActionCreatorPayload
) =>
  makeInsightAnalyticsAction(
    'analytics/categoryFacet/breadcrumb',
    AnalyticsType.Search,
    (client, state) => {
      validatePayload(payload, categoryFacetBreadcrumbPayloadDefinition);

      return client.logBreadcrumbFacet(
        getCategoryFacetMetadata(state, payload)
      );
    }
  )();