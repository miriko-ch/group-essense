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
  const params = JSON.parse(req.body)
  const { currentPage, pageSize, startDate, endDate } = params;

  let error = null;
  let pageData = [];
  const monthlyMessagesCount = {} //按月统计本月有多少条发言 {2022-1:300,2022-2:300}

  if (!Number.isInteger(currentPage) || !Number.isInteger(pageSize)) {
    error = '页码和每页大小必须为有效数字';
  }

  if (currentPage <= 0 || pageSize <= 0) {
    error = '页码和每页大小不能小于0';
  }

  const db = await connectToDatabase();
  const collection = await db.collection('digests');
  const size = await collection.countDocuments();
  const query = {};
  const sort = { sender_time: -1 };
  const limit = pageSize;
  const skip = (currentPage - 1) * pageSize;
  const projection = {
    msg_seq: 0,
    sender_uin: 0
  } // exclude these 2 fields from result

  if (skip >= size) {
    error = '页码超出范围'
  }

  if (error === null) {
    pageData = await collection.find(query).project(projection).sort(sort).limit(limit).skip(skip).toArray();
  }

  const hasNext = skip + limit < size;

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

  res.status(200).json(result);
}
