import React, { useState, useEffect } from 'react';
import { Table, Empty, Typography, Spin } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';

const { Text } = Typography;

interface Props {
  title?: string;
  columns: any;
  data: any;
  pointerOnHover?: boolean;
  highlightOnHover?: boolean;
  striped?: boolean;
  selectable?: boolean;
  pagination?: boolean;
  paginationTotalRows?: number;
  onRowClicked?: (row: any, event: any) => void;
  onChangePage?: (page: number) => void;
  onChangeRowsPerPage?: (size: number) => void;
  dense?: boolean;
  progressPending?: any;
  onSelectedRowsChange?: any;
  noHeader?: boolean;
  conditionalRowStyles?: [];
  selectableRowsComponent?: any;
  CustomEmptyData?: React.ReactNode | '';
  preferredCustomStyles?: any;
  clearSelectedRows?: any;
  contextActions?: any;
  selectableRowSelected?: any;
  selectableRowsHighlight?: boolean;
}

const CustomLoader = () => (
  <div
    style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Spin size="large" />
    <Text style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
      Hold on, whilst we fetch your data...
    </Text>
  </div>
);

/**
 * CustomTable Component - Ant Design Wrapper
 * Maintains backward compatibility with react-data-table-component API
 * while using Ant Design Table underneath
 */
const CustomTable: React.FC<Props> = ({
  title,
  columns,
  data,
  onRowClicked,
  pointerOnHover = true,
  highlightOnHover = true,
  striped = true,
  dense = false,
  pagination = false,
  progressPending,
  selectable = false,
  onSelectedRowsChange,
  noHeader = true,
  paginationTotalRows,
  onChangePage,
  onChangeRowsPerPage,
  CustomEmptyData,
  clearSelectedRows,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [paginationState, setPaginationState] = useState<TablePaginationConfig>(
    {
      current: 1,
      pageSize: 10,
      total: paginationTotalRows || data?.length || 0,
      showSizeChanger: true,
      showQuickJumper: pagination,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      pageSizeOptions: ['10', '20', '50', '100'],
    },
  );

  // Update total when paginationTotalRows changes
  useEffect(() => {
    if (paginationTotalRows !== undefined) {
      setPaginationState((prev) => ({ ...prev, total: paginationTotalRows }));
    } else if (data?.length) {
      setPaginationState((prev) => ({ ...prev, total: data.length }));
    }
  }, [paginationTotalRows, data?.length]);

  // Convert react-data-table columns to Ant Design columns format
  const convertColumns = (cols: any[]): ColumnsType<any> => {
    return cols.map((col) => ({
      title: col.name,
      dataIndex: col.selector
        ? col.selector.toString().split('.').pop()
        : col.id,
      key: col.id || col.selector?.toString(),
      width: col.width,
      render:
        col.cell ||
        ((text: any, record: any) => {
          // Try to get value using selector if it exists
          if (col.selector && typeof col.selector === 'function') {
            return col.selector(record);
          }
          return text;
        }),
      sorter: col.sortable
        ? (a: any, b: any) => {
            const aVal = col.selector ? col.selector(a) : a[col.id];
            const bVal = col.selector ? col.selector(b) : b[col.id];
            if (typeof aVal === 'string') return aVal.localeCompare(bVal);
            return aVal - bVal;
          }
        : undefined,
      ellipsis: col.wrap === false,
    }));
  };

  // Add serial number to data
  const dataWithSn = data?.map((obj: any, i: number) => ({
    ...obj,
    sn:
      ((paginationState.current || 1) - 1) * (paginationState.pageSize || 10) +
      i +
      1,
    key: obj._id || obj.id || `item-id-${i}`,
  }));

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPaginationState(newPagination);

    // Call original callbacks
    if (onChangePage && newPagination.current) {
      onChangePage(newPagination.current);
    }
    if (onChangeRowsPerPage && newPagination.pageSize) {
      onChangeRowsPerPage(newPagination.pageSize);
    }
  };

  const rowSelection = selectable
    ? {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[], selectedRows: any[]) => {
          setSelectedRowKeys(selectedKeys);
          if (onSelectedRowsChange) {
            onSelectedRowsChange({ selectedRows });
          }
        },
      }
    : undefined;

  // Clear selected rows when clearSelectedRows changes
  useEffect(() => {
    if (clearSelectedRows) {
      setSelectedRowKeys([]);
    }
  }, [clearSelectedRows]);

  return (
    <div style={{ width: '100%' }}>
      {title && !noHeader && (
        <div style={{ marginBottom: '16px' }}>
          <Typography.Title level={4}>{title}</Typography.Title>
        </div>
      )}
      <Table
        columns={convertColumns(columns)}
        dataSource={dataWithSn}
        loading={{
          spinning: progressPending,
          indicator: <CustomLoader />,
        }}
        pagination={
          pagination
            ? {
                ...paginationState,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }
            : false
        }
        onChange={handleTableChange}
        onRow={(record) => ({
          onClick: (event) => {
            if (onRowClicked) {
              onRowClicked(record, event);
            }
          },
          style: {
            cursor: pointerOnHover ? 'pointer' : 'default',
          },
        })}
        rowSelection={rowSelection}
        locale={{
          emptyText: CustomEmptyData || (
            <Empty
              description="No data available"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
        scroll={{ x: 'max-content', y: 'calc(65vh - 55px)' }}
        size={dense ? 'small' : 'middle'}
        bordered
        rowClassName={(record, index) =>
          highlightOnHover ? 'ant-table-row-hover' : ''
        }
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default CustomTable;
