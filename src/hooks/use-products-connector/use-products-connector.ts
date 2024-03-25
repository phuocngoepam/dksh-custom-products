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
  country: 'sg' | 'vn' | 'all';
  tableSorting: TDataTableSortingState;
};

type TUseChannelsFetcher = (
  paginationAndSortingProps: PaginationAndSortingProps
) => {
  productsResult?: TFetchProductsQuery;
  error?: ApolloError;
  loading: boolean;
};

const sgId = [
  '268a4b79-7da7-4e11-bcec-786d0f76b7f8',
  '9666b9a7-a0c3-4116-99a6-7e11b880f824',
  '85302303-a64d-422a-9c35-45ce56990f26',
  '35f329e0-3eff-452b-86eb-5dd51cac76b3',
  '2d643a40-3b6d-4736-94cc-0547daf2a0c9',
  '1d166989-a8a4-4445-b3be-a86332e423d9',
  'a7ad5231-7e73-405a-bf33-41d8dbfbbdde',
  '44d3a251-8e13-4b5b-8bef-9bb5d22c21ae',
  '8c01b819-477d-4d82-8a8c-c2e2be1f95a4',
  '89e68c70-106c-46b8-80b7-503dac6ea257',
  '7ea5c97c-cffb-48c4-8609-90d3ce3c08ce',
  'bcb54ecc-bf5f-44f0-a6fa-92cc96e41953',
];

const vnId = [
  'dd4c13d5-4af7-4209-a073-38036e13d25e',
  '85b5305f-dd6c-4a10-843c-4c4460c69dc8',
  '76669104-49f9-4121-b269-b9466ccd7ce0',
  '85302303-a64d-422a-9c35-45ce56990f26',
  '35f329e0-3eff-452b-86eb-5dd51cac76b3',
  '2d643a40-3b6d-4736-94cc-0547daf2a0c9',
  '248caf05-1544-413e-bb7e-d3b45f739c7c',
  '1d166989-a8a4-4445-b3be-a86332e423d9',
  '7c8b73d9-2c33-4a4d-a644-df158483055a',
  '73029204-dbdf-4558-bd58-5c7393497d6c',
  '7b54fe99-a537-4860-8c57-13a221bdb206',
  '7ea5c97c-cffb-48c4-8609-90d3ce3c08ce',
  '742325d7-f8fa-4de1-86fe-456fcf8e6866',
  'bcb54ecc-bf5f-44f0-a6fa-92cc96e41953',
];

export const useProductsFetcher: TUseChannelsFetcher = ({
  page,
  perPage,
  tableSorting,
  country
}) => {
  let productsQuery = 'id NOT in ("00000000-0000-0000-0000-000000000000")';

  if(country === 'sg') {
    productsQuery = `id in (${sgId.map((id) => `"${id}"`).join(',')})`;
  } else if(country === 'vn') {
    productsQuery = `id in (${vnId.map((id) => `"${id}"`).join(',')})`;
  }

  const variables: TFetchProductsQueryVariables = {
    sort: [`${tableSorting.value.key} ${tableSorting.value.order}`],
    productSelectionRefsLimit: 5,
    productsLimit: perPage.value,
    offset: (page.value - 1) * perPage.value,
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
    productsQuery,
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
