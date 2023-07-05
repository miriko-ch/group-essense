//api/count

// 按月统计本月有多少条发言
/*
{
  error: err,
  data: [{
    month: "YYYY-MM",
    count: int
  }...]
}
*/

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
  let error = null,
      data = [];
  try {
    const agg = [
      {
        '$group': {
          '_id': {
            '$dateToString': {
              'format': '%Y-%m',
              'date': '$sender_time'
            }
          },
          'count': {
            '$sum': 1
          }
        }
      }, {
        '$project': {
          '_id': 0,
          'month': '$_id',
          'count': 1
        }
      }, {
        '$sort': {
          'month': -1
        }
      }
    ];

    const db = await connectToDatabase();
    const collection = await db.collection('digests');
    const cursor = collection.aggregate(agg);
    data = await cursor.toArray();
  } catch (e) {
    console.log(e);
    error = e.message;
  } finally {
    const result = {
      error,
      data
    };
  
    res.setHeader('Cache-Control', 's-maxage=28800'); //8h
    res.status(200).json(result);
  }
}
