// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import _ from 'lodash';
import clientPromise from '../../libs/mongodb';

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  const client = await clientPromise;
  const db = await client.db('digests');
  cachedDb = db;
  return db;
}

export default async function handler(req, res) {
  let currentPage,
      pageSize,
      startDate,
      endDate,
      pageData = [],
      size,
      skip,
      limit,
      hasNext,
      error;

  try {
    const params = JSON.parse(req.body);
    ({ currentPage, pageSize, startDate, endDate } = params);

    if (!Number.isInteger(currentPage) || !Number.isInteger(pageSize)) {
      throw new Error('页码和每页大小必须为有效数字');
    }

    if (currentPage <= 0 || pageSize <= 0) {
      throw new Error('页码和每页大小不能小于0');
    }

    const db = await connectToDatabase();
    const collection = await db.collection('digests');
    size = await collection.countDocuments();
    const query = {};
    const sort = { sender_time: -1 };
    limit = pageSize;
    skip = (currentPage - 1) * pageSize;
    const projection = {
      msg_seq: 0,
      sender_uin: 0
    } // exclude these 2 fields from result

    if (skip >= size) {
      throw new Error('页码超出范围');
    }
    pageData = await collection.find(query).project(projection).sort(sort).limit(limit).skip(skip).toArray();
    hasNext = skip + limit < size;
  } catch (e) {
    console.log(e)
    error = e.message
  } finally {
    const result = {
      error,
      currentPage,
      pageSize,
      actualSize: _.size(pageData),
      total: size,
      hasNext,
      nextPage: hasNext ? currentPage + 1 : null,
      listData: pageData,
    };

    res.setHeader('Cache-Control', 's-maxage=28800'); //8h
    res.status(200).json(result);
  }
}
