import { MongoAdapter } from '../mapper/MongoAdapter';
import { Collection, ObjectId } from 'mongodb';

import { Event } from '../../models/Event';
import { EventDboMapper } from '../mapper/EventMapper';
import { IRepository } from '../../domain/common/Repository';
import { AttendanceRepository } from './AttendanceRepository';

const eventMapper = new EventDboMapper();


class EventRepository implements IRepository<Event> {

  private collection: Collection;
  private attendanceRepository: AttendanceRepository;

  constructor(mongoAdapter: MongoAdapter, attendanceRepository: AttendanceRepository) {
    this.collection = mongoAdapter.db.collection('events');
    this.attendanceRepository = attendanceRepository;
  }

  async list(): Promise<Event[]> {
    return (await this.collection.find({}).toArray())
      .map((dbo) => eventMapper.fromDbo(dbo));
  }

  async getById(id: string): Promise<Event> {
    const dbo = await this.collection.findOne({ '_id': new ObjectId(id) });

    if (!dbo) {
      return Promise.resolve(undefined);
    }

    return eventMapper.fromDbo(dbo);
  }

  async save(event: Event): Promise<Event> {
    const dbo = eventMapper.toDbo(event);

    const query = { _id: dbo._id };
    const update = { $set: dbo };
    const options = { upsert: true };

    await this.collection.updateOne(query, update, options);
    return eventMapper.fromDbo(dbo);
  }

  async delete(eventId: string) {
    await this.collection.deleteOne({ '_id': new ObjectId(eventId) });
    await this.attendanceRepository.deleteByEventId(eventId);
  }

}


export {
  EventRepository,
};
