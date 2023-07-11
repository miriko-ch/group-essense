// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import _ from 'lodash';
import clientPromise from '../../libs/mongodb';
import to from 'await-to-js';
import Cache from 'cache'
const cache = new Cache(60 * 1000)

const connectToDatabase = async () => {
  const cachedDb = cache.get('cachedDb')
  if (!_.isEmpty(cachedDb)) { return cachedDb }

  const client = await clientPromise;
  const db = await client.db('digests');
  cache.put('cachedDb', db)

  return db;
}

const fetchCollection = async () => {
  const db = await connectToDatabase();
  const collection = await db.collection('digests');
  return collection
}

const queryData = async (params) => {
  const { startIndex, stopIndex } = params;
  const isInvalidIndex = !(_.isInteger(startIndex) && _.isInteger(stopIndex) && stopIndex > startIndex);
  if (isInvalidIndex) { throw new Error('起止位置需要为递增非负整数') }

  const query = {};
  const sort = { sender_time: -1 };
  const projection = { msg_seq: 0, sender_uin: 0 }
  const size = stopIndex - startIndex

  const collection = await fetchCollection();
  const data = await collection.find(query).project(projection).sort(sort).skip(startIndex).limit(size).toArray()

  return data
}


const handler = async (req, res) => {
  const params = JSON.parse(req.body)

  const [error, data = []] = await to(queryData(params))
  const result = {
    error: error?.message || null,
    listData: data,
    ...params
  }

  res.setHeader('Cache-Control', 's-maxage=28800'); //8h
  res.status(200).json(result);
}

export default handler