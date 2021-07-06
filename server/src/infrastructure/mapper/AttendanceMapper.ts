import { ObjectId } from 'mongodb';
import { IDboMapper } from '../../domain/common/IDboMapper';
import { Dbo } from '../../domain/common/Dbo';
import { Attendance } from '../../models/Attendance';

interface AttendanceDbo extends Dbo {
  _id: ObjectId,

  event: {
    eventId: ObjectId,
    type: string,
  },

  member: {
    memberId: ObjectId,
    fullName: string,
  },

  isLate: boolean,
  isAbsent: boolean,
  isExcused: boolean,
  excuseReason: string,
  capacity: number,

}

class AttendanceDboMapper implements IDboMapper<Attendance> {

  fromDbo(dbo: AttendanceDbo): Attendance {
    return new Attendance(String(dbo._id),
                          String(dbo.member.memberId),
                          dbo.member.fullName,
                          String(dbo.event.eventId),
                          dbo.event.type,
                          dbo.isLate,
                          dbo.isAbsent,
                          dbo.isExcused,
                          dbo.excuseReason,
                          dbo.capacity);
  }

  toDbo(attendance: Attendance): AttendanceDbo {
    return {
      _id: attendance.id ? new ObjectId(attendance.id) : new ObjectId(),

      event: {
        eventId: new ObjectId(attendance.eventId),
        type: attendance.eventType,
      },
      member: {
        memberId: new ObjectId(attendance.memberId),
        fullName: attendance.fullName,
      },

      isLate: attendance.isLate,
      isAbsent: attendance.isAbsent,
      isExcused: attendance.isExcused,
      excuseReason: attendance.excuseReason,
      capacity: attendance.capacity,
    };
  }

}


export {
  AttendanceDboMapper,
  AttendanceDbo,
};
