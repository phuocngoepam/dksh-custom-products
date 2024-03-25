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
  Link as RouterLink,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import {
  usePaginationState,
  useDataTableSortingState,
} from '@commercetools-uikit/hooks';
import dayjs from 'dayjs';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Constraints from '@commercetools-uikit/constraints';
import { useState } from 'react';
import { Pagination } from '@commercetools-uikit/pagination';
import { BackIcon } from '@commercetools-uikit/icons';
import FlatButton from '@commercetools-uikit/flat-button';
import DataTableManager from '@commercetools-uikit/data-table-manager';
import CheckboxInput from '@commercetools-uikit/checkbox-input';

type TProductsProps = {
  linkToWelcome: string;
};

const columns = [
  { key: 'name', label: 'Product name' },
  { key: 'key', label: 'Product key', isSortable: true },
  { key: 'productType', label: 'Product type' },
  { key: 'createdAt', label: 'Date created' },
  { key: 'lastModifiedAt', label: 'Date modified' },
];

const Products = (props: TProductsProps) => {
  const [filter, setFilter] = useState<'sg' | 'vn' | 'all'>('all');

  const intl = useIntl();
  const { page, perPage } = usePaginationState();
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });

  const { productsResult, error, loading } = useProductsFetcher({
    page,
    perPage,
    country: filter,
    tableSorting,
  });

  const productsData = productsResult?.products.results;

  // productsData.

  // console.log(productsData?.map((product) => product.id));

  const handleDataFilter = (role: string, filter: 'sg' | 'vn' | 'all') => {
    setFilter(filter);
    page.onChange(1);
    alert('Switch to ' + role + ' role');
  };

  // const columnsWithSelect = [
  //   {
  //     key: 'checkbox',
  //     label: (
  //       <CheckboxInput
  //         isIndeterminate={isSelectColumnHeaderIndeterminate}
  //         isChecked={countSelectedRows !== 0}
  //         onChange={handleSelectColumnHeaderChange}
  //       />
  //     ),
  //     shouldIgnoreRowClick: true,
  //     align: 'center',
  //     renderItem: (row) => (
  //       <CheckboxInput
  //         isChecked={getIsRowSelected(row.id)}
  //         onChange={() => toggleRow(row.id)}
  //       />
  //     ),
  //     disableResizing: true,
  //   },
  //   ...columns,
  // ];

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
        <FlatButton
          as={RouterLink}
          to={props.linkToWelcome}
          label={intl.formatMessage(messages.backToWelcome)}
          icon={<BackIcon />}
        />
        <SpacingsInline scale="s" alignItems="baseline">
          <Text.Headline as="h2" intlMessage={messages.title} />
          <p>{productsResult?.products.total} items</p>
        </SpacingsInline>
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
            onClick={() => handleDataFilter('Super Admin', 'all')}
            isDisabled={false}
          />
          <PrimaryButton
            label="Market Lead Region"
            onClick={() => handleDataFilter('Market Lead Region', 'all')}
            isDisabled={false}
          />
          <PrimaryButton
            label="Sales Admin in Vietnam"
            onClick={() => handleDataFilter('Sales Admin in Vietnam', 'vn')}
            isDisabled={false}
          />
          <PrimaryButton
            label="Sales Admin in Singapore"
            onClick={() => handleDataFilter('Sales Admin in Singapore', 'sg')}
            isDisabled={false}
          />
        </SpacingsInline>
      </Constraints.Horizontal>

      {loading && <LoadingSpinner />}

      {productsData ? (
        <Spacings.Stack scale="m">
          <Constraints.Horizontal max="scale">
            <DataTableManager columns={columns}>
              <DataTable
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
                      return dayjs(item.lastModifiedAt).format(
                        'DD/MM/YYYY HH:mm'
                      );
                    default:
                      return null;
                  }
                }}
                sortedBy={tableSorting.value.key}
                sortDirection={tableSorting.value.order}
                onSortChange={tableSorting.onChange}
              />
            </DataTableManager>
          </Constraints.Horizontal>
          <Pagination
            page={page.value}
            onPageChange={page.onChange}
            perPage={perPage.value}
            onPerPageChange={perPage.onChange}
            totalItems={productsResult?.products.total || 0}
          />
        </Spacings.Stack>
      ) : null}
    </Spacings.Stack>
  );
};

Products.displayName = 'Products';
export default Products;
