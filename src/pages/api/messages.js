// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import data from './data.json'

export default function handler(req, res) {
  const { pn, ps } = req.query;

  if (!Number.isInteger(Number(pn)) || !Number.isInteger(Number(ps))) {
    res.status(400).json({ error: '页码和每页大小必须为有效数字' });
    return;
  }

  const current = Number(pn);
  const page_size = Number(ps);

  if(current <= 0 || page_size <= 0) {
    res.status(400).json({ error: 'pn或ps不能小于0' });
  }

  const startIndex = (current - 1) * page_size;
  const endIndex = Math.min(startIndex + page_size, data.length);

  if (startIndex >= data.length) {
    res.status(400).json({ error: '页码超出范围' });
    return;
  }

  const pageData = data.slice(startIndex, endIndex);

  const result = {
    error: null,
    current: current,
    requested_size: page_size,
    actual_size: pageData.length,
    total: data.length,
    has_next: endIndex < data.length,
    data: pageData,
  };

  res.status(200).json(result);
}
