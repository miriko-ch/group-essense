// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import data from './data.json';
import _ from 'lodash';

export default function handler(req, res) {

  const params = JSON.parse(req.body)
  const { currentPage, pageSize } = params;

  let error = null;

  if (!Number.isInteger(currentPage) || !Number.isInteger(pageSize)) {
    error = '页码和每页大小必须为有效数字';
  }

  if (currentPage <= 0 || pageSize <= 0) {
    error = '页码和每页大小不能小于0';
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, _.size(data));

  if (startIndex >= data.length) {
    error = '页码超出范围'
  }

  const pageData = error ? [] : data.slice(startIndex, endIndex);

  const hasNext = endIndex < _.size(data)

  const result = {
    error,
    currentPage,
    pageSize,
    actualSize: _.size(pageData),
    total: _.size(data),
    hasNext,
    nextPage: hasNext ? currentPage + 1 : null,
    listData: pageData,
  };

  res.status(200).json(result);
}
