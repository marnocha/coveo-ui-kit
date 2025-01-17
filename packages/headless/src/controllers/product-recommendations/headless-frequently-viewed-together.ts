import {Schema, SchemaValues} from '@coveo/bueno';
import {ProductRecommendationEngine} from '../../app/product-recommendation-engine/product-recommendation-engine';
import {validateOptions} from '../../utils/validate-payload';
import {
  baseProductRecommendationsOptionsSchema,
  buildBaseProductRecommendationsList,
} from './headless-base-product-recommendations';

const optionsSchema = new Schema({
  ...baseProductRecommendationsOptionsSchema,
});

export type FrequentlyViewedTogetherListOptions = SchemaValues<
  typeof optionsSchema
>;

export interface FrequentlyViewedTogetherListProps {
  options?: FrequentlyViewedTogetherListOptions;
}

export type FrequentlyViewedTogetherList = ReturnType<
  typeof buildFrequentlyViewedTogetherList
>;
export type FrequentlyViewedTogetherListState =
  FrequentlyViewedTogetherList['state'];

export const buildFrequentlyViewedTogetherList = (
  engine: ProductRecommendationEngine,
  props: FrequentlyViewedTogetherListProps
) => {
  const options = validateOptions(
    engine,
    optionsSchema,
    props.options,
    'buildFrequentlyViewedTogetherList'
  ) as Required<FrequentlyViewedTogetherListOptions>;
  return buildBaseProductRecommendationsList(engine, {
    ...props,
    options: {
      ...options,
      id: 'frequentViewed',
    },
  });
};
