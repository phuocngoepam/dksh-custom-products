import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import messages from './messages';
import { useIntl } from 'react-intl';
import { useProductsFetcher } from '../../hooks/use-products-connector';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { getErrorMessage } from '../../helpers';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import DataTable from '@commercetools-uikit/data-table';
import SpacingsInline from '@commercetools-uikit/spacings-inline';

import {
  usePaginationState,
  useDataTableSortingState,
} from '@commercetools-uikit/hooks';
import dayjs from 'dayjs';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Constraints from '@commercetools-uikit/constraints';
import { useState } from 'react';

type TProductsProps = {
  linkToWelcome?: string;
};

const columns = [
  { key: 'name', label: 'Product name' },
  { key: 'key', label: 'Product key', isSortable: true },
  { key: 'productType', label: 'Product type' },
  { key: 'createdAt', label: 'Date created' },
  { key: 'lastModifiedAt', label: 'Date modified' },
];

const Products = (props: TProductsProps) => {
  const [filter, setFilter] = useState('');

  const intl = useIntl();

  const { productsResult, error, loading } = useProductsFetcher();

  const productsData = productsResult?.products.results.filter((product) => {
    return product.masterData.staged.name.toLowerCase().includes(filter);
  });

  const handleDataFilter = (role: string, filter: string) => {
    setFilter(filter.toLocaleLowerCase());
    alert('Switch to ' + role + ' role');
  };

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }
  return (
    <Spacings.Stack scale="xl">
      <Spacings.Stack scale="xs">
        <Text.Headline as="h2" intlMessage={messages.title} />
      </Spacings.Stack>

      <Constraints.Horizontal max={16}>
        <ContentNotification type="info">
          <Text.Body intlMessage={messages.demoHint} />
        </ContentNotification>
      </Constraints.Horizontal>

      <Constraints.Horizontal max={13}>
        <SpacingsInline scale="s">
          <PrimaryButton
            label="Super Admin"
            onClick={() => handleDataFilter('Super Admin', '')}
            isDisabled={false}
          />
          <PrimaryButton
            label="Market Lead Region"
            onClick={() => handleDataFilter('Market Lead Region', '')}
            isDisabled={false}
          />
          <PrimaryButton
            label="Sales Admin in Vietnam"
            onClick={() =>
              handleDataFilter('Sales Admin in Vietnam', 'vietnam')
            }
            isDisabled={false}
          />
          <PrimaryButton
            label="Sales Admin in Singapore"
            onClick={() =>
              handleDataFilter('Sales Admin in Singapore', 'singapore')
            }
            isDisabled={false}
          />
        </SpacingsInline>
      </Constraints.Horizontal>

      {loading && <LoadingSpinner />}

      {productsData ? (
        <Spacings.Stack scale="l">
          <DataTable
            isCondensed
            columns={columns}
            rows={productsData}
            itemRenderer={(item, columns) => {
              switch (columns.key) {
                case 'name':
                  return item.masterData.staged.name;
                case 'key':
                  return item.key;
                case 'productType':
                  return item.productType.name;
                case 'createdAt':
                  return dayjs(item.createdAt).format('DD/MM/YYYY HH:mm');
                case 'lastModifiedAt':
                  return dayjs(item.lastModifiedAt).format('DD/MM/YYYY HH:mm');
                default:
                  return null;
              }
            }}
          />
        </Spacings.Stack>
      ) : null}
    </Spacings.Stack>
  );
};

Products.displayName = 'Products';
export default Products;
