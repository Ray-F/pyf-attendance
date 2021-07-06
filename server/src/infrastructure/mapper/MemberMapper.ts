import { IDboMapper } from '../../domain/common/IDboMapper';
import { Member } from '../../models/Member';
import { ObjectId } from 'mongodb';

interface MemberDbo {
  _id: ObjectId;
  fullName: string;
  startDate: Date;
  endDate: Date;
}


class MemberDboMapper implements IDboMapper<Member> {

  fromDbo(dbo: MemberDbo): Member {
    return new Member(String(dbo._id), dbo.fullName, dbo.startDate, dbo.endDate);
  }

  toDbo(member: Member): MemberDbo {
    console.log(member);
    return {
      _id: member.id ? new ObjectId(member.id) : new ObjectId(),
      fullName: member.fullName,
      startDate: member.startDate,
      endDate: member.endDate || undefined,
    };
  }

}


export {
  MemberDboMapper,
  MemberDbo,
};
