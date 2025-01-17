import {SearchAPIErrorWithStatusCode} from '../../api/search/search-api-error-response';
import {
  AnalyticsType,
  InsightAction,
  makeInsightAnalyticsAction,
} from '../analytics/analytics-utils';
import {getCaseContextAnalyticsMetadata} from '../case-context/case-context-state';
import {getQueryInitialState} from '../query/query-state';

export const logFetchMoreResults = (): InsightAction =>
  makeInsightAnalyticsAction(
    'search/logFetchMoreResults',
    AnalyticsType.Search,
    (client, state) =>
      client.logFetchMoreResults(
        getCaseContextAnalyticsMetadata(state.insightCaseContext)
      )
  );

export const logQueryError = (
  error: SearchAPIErrorWithStatusCode
): InsightAction =>
  makeInsightAnalyticsAction(
    'search/queryError',
    AnalyticsType.Search,
    (client, state) =>
      client.logQueryError({
        ...getCaseContextAnalyticsMetadata(state.insightCaseContext),
        query: state.query?.q || getQueryInitialState().q,
        aq: '',
        cq: '',
        dq: '',
        errorType: error.type,
        errorMessage: error.message,
      })
  );

export const logContextChanged = (
  caseId: string,
  caseNumber: string
): InsightAction =>
  makeInsightAnalyticsAction(
    'analytics/contextChanged',
    AnalyticsType.Search,
    (client, state) => {
      const meta = {
        caseId,
        caseNumber,
        caseContext: state.insightCaseContext?.caseContext || {},
      };
      client.logContextChanged(meta);
    }
  );

export const logExpandToFullUI = (
  caseId: string,
  caseNumber: string,
  fullSearchComponentName: string,
  triggeredBy: string
): InsightAction<AnalyticsType.Custom> =>
  makeInsightAnalyticsAction(
    'analytics/expandToFullUI',
    AnalyticsType.Custom,
    (client, state) => {
      const meta = {
        caseId,
        caseNumber,
        fullSearchComponentName,
        triggeredBy,
        caseContext: state.insightCaseContext?.caseContext || {},
      };
      client.logExpandToFullUI(meta);
    }
  );
