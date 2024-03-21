/// <reference path="../../../@types/commercetools__sync-actions/index.d.ts" />
/// <reference path="../../../@types-extensions/graphql-ctp/index.d.ts" />

import { ApolloError } from '@apollo/client';
import { TDataTableSortingState } from '@commercetools-uikit/hooks';
import { createSyncChannels } from '@commercetools/sync-actions';
import {
  TFetchChannelsQuery,
  TFetchProductsQuery,
  TFetchProductsQueryVariables,
} from '../../types/generated/ctp';
import { useMcQuery } from '@commercetools-frontend/application-shell-connectors';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';

import FetchChannelsQuery from './fetch-channels.ctp.graphql';
import FetchChannelDetailsQuery from './fetch-channel-details.ctp.graphql';
import UpdateChannelDetailsMutation from './update-channel-details.ctp.graphql';
import FetchProductsQuery from './fetch-products.ctp.graphql';

const syncChannels = createSyncChannels();

type PaginationAndSortingProps = {
  page: { value: number };
  perPage: { value: number };
  tableSorting: TDataTableSortingState;
};

type TUseChannelsFetcher = () => {
  productsResult?: TFetchProductsQuery;
  error?: ApolloError;
  loading: boolean;
};

export const useProductsFetcher: TUseChannelsFetcher = () => {
  const variables: TFetchProductsQueryVariables = {
    productSelectionRefsLimit: 5,
    productsLimit: 100,
    locale: 'en-US',
    includeNames: [],
    shouldIncludeNames: false,
    shouldIncludeState: false,
    shouldIncludeCategories: false,
    shouldIncludeTotalVariants: false,
    shouldIncludeInventoryPerVariant: false,
    shouldIncludeVariantKey: true,
    shouldIncludePrices: false,
    shouldIncludeId: true,
    shouldIncludeSku: true,
    shouldIncludeImages: false,
    shouldIncludeProductSelections: false,
    shouldIncludeAttributes: false,
    shouldIncludeProducts: true,
  };

  const { data, error, loading } = useMcQuery<
    TFetchProductsQuery,
    TFetchProductsQueryVariables
  >(FetchProductsQuery, {
    variables,
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return {
    productsResult: data,
    error,
    loading,
  };
};
