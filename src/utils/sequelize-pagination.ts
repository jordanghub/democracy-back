import sequelize from 'sequelize';

export const filterParams = ({ page, pageSize }) => {
  const formatPageSize =
    pageSize > 0 &&
    (typeof pageSize === 'number' || !Number.isNaN(Number(page)))
      ? Math.floor(Number(pageSize))
      : 5;

  const formatPage =
    page > 0 && (typeof page === 'number' || !Number.isNaN(Number(page)))
      ? Math.ceil(Number(page))
      : 1;

  return {
    pageSize: formatPageSize,
    page: formatPage,
  };
};

export const pagination = ({ pageSize, page, distinct = true }) => {
  const filteredParams = filterParams({ page, pageSize });

  const offset = filteredParams.pageSize * (filteredParams.page - 1);

  const pageOptions = {
    offset,
    limit: filteredParams.pageSize,
    distinct,
  };

  return pageOptions;
};

export const getPaginationParams = (
  items: any,
  total: number,
  page: number,
  pageSize: number = 5,
) => {
  const filteredParams = filterParams({ pageSize, page });

  const attrs = {
    items,
    pages: Math.ceil(total / filteredParams.pageSize),
    currentPage: filteredParams.page,
    count: total,
  };

  return attrs;
};
