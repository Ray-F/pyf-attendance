import { IRepository } from '../../domain/common/Repository';
import { MemberDboMapper } from '../mapper/MemberMapper';
import Member from '../../models/Member';
import { MongoAdapter } from '../mapper/MongoAdapter';
import { Collection, ObjectId } from 'mongodb';
import { AttendanceRepository } from './AttendanceRepository';

const memberMapper = new MemberDboMapper();


class MemberRepository implements IRepository<Member> {

  private collection: Collection;
  private attendanceRepository: AttendanceRepository;

  constructor(mongoAdapter: MongoAdapter, attendanceRepository: AttendanceRepository) {
    this.collection = mongoAdapter.db.collection('members');
    this.attendanceRepository = attendanceRepository;
  }

  async getById(id: string): Promise<Member> {
    const dbo = await this.collection.findOne({ '_id': new ObjectId(id) });

    if (!dbo) return Promise.resolve(undefined);

    return memberMapper.fromDbo(dbo);
  }

  async list(): Promise<Member[]> {
    return (await this.collection.find({}).toArray()).map((dbo) => memberMapper.fromDbo(dbo));
  }

  async save(member: Member): Promise<Member> {
    const dbo = memberMapper.toDbo(member);

    const query = { _id: dbo._id };
    const update = { $set: dbo };
    const options = { upsert: true };

    await this.collection.updateOne(query, update, options);

    return memberMapper.fromDbo(dbo);
  }

  async delete(memberId: string) {
    await this.collection.deleteOne({ '_id': new ObjectId(memberId) });
    await this.attendanceRepository.deleteByMemberId(memberId);
  }

}


export {
  MemberRepository,
};
