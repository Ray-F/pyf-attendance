import { IRepository } from '../../domain/common/Repository';
import { Attendance } from '../../models/Attendance';
import { Collection, ObjectId } from 'mongodb';
import { MongoAdapter } from '../mapper/MongoAdapter';
import { AttendanceDboMapper } from '../mapper/AttendanceMapper';

const attendanceMapper = new AttendanceDboMapper();


class AttendanceRepository implements IRepository<Attendance> {

  private collection: Collection;

  constructor(mongoAdapter: MongoAdapter) {
    this.collection = mongoAdapter.db.collection('attendance');
  }

  async getById(id: string): Promise<Attendance> {
    const dbo = await this.collection.findOne({ '_id': new ObjectId(id) });

    if (!dbo) return Promise.resolve(undefined);

    return attendanceMapper.fromDbo(dbo);
  }

  async listByEventId(eventId: string): Promise<Attendance[]> {
    return this.listByQuery({ 'event.eventId': new ObjectId(eventId) });
  }

  async listByMemberId(memberId: string): Promise<Attendance[]> {
    return this.listByQuery({ 'member.memberId': new ObjectId(memberId) });
  }

  async list(): Promise<Attendance[]> {
    return this.listByQuery({});
  }

  private async listByQuery(query): Promise<Attendance[]> {
    const dboList = await this.collection.find(query).toArray();
    return dboList.map((dbo) => attendanceMapper.fromDbo(dbo));
  }

  async save(attendance: Attendance): Promise<Attendance> {
    const dbo = attendanceMapper.toDbo(attendance);

    const filter = { _id: dbo._id };
    const update = { $set: dbo };
    const options = { upsert: true };

    await this.collection.updateOne(filter, update, options);
    return attendanceMapper.fromDbo(dbo);
  }

  // TODO: Fix this
  async saveAll(attendanceList: Attendance[]): Promise<Attendance[]> {
    const attendanceDboList = attendanceList.map((attendance) => attendanceMapper.toDbo(attendance));

    const filter = {};
    const update = {};
    const options = {};

    await this.collection.updateMany(filter, update, options);

    return attendanceDboList.map((dbo) => attendanceMapper.fromDbo(dbo));
  }

  async deleteByEventId(eventId: string) {
    await this.collection.deleteMany({ 'event.eventId': new ObjectId(eventId) });
  }

  async deleteByMemberId(memberId: string) {
    await this.collection.deleteMany({ 'member.memberId': new ObjectId(memberId) });
  }

  async delete(attendanceId: string) {
    await this.collection.deleteOne({ '_id': new ObjectId(attendanceId) });
  }

}


export {
  AttendanceRepository,
};
