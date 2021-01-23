const ObjectId = require('mongodb').ObjectId


class Attendance {
  constructor(attendancePOJO = null, attendanceDbo = null) {

    if (attendancePOJO) {
      this.id = attendancePOJO._id
      this.memberId = attendancePOJO.memberId
      this.fullName = attendancePOJO.fullName
      this.eventId = attendancePOJO.eventId
      this.eventType = attendancePOJO.eventType
      this.isLate = attendancePOJO.isShort
      this.isAbsent = attendancePOJO.isAbsent
      this.isExcused = attendancePOJO.isExcused
      this.excuseReason = attendancePOJO.excuseReason
      this.capacity = attendancePOJO.capacity
    } else if (attendanceDbo) {
      this.id = attendanceDbo._id
      this.memberId = attendanceDbo.member.memberId.toString()
      this.fullName = attendanceDbo.member.fullName
      this.eventId =  attendanceDbo.event.eventId.toString()
      this.eventType = attendanceDbo.event.type
      this.isLate = attendanceDbo.isLate
      this.isAbsent = attendanceDbo.isAbsent
      this.isExcused = attendanceDbo.isExcused
      this.excuseReason = attendanceDbo.excuseReason
      this.capacity = attendanceDbo.capacity
    }


    if ([
      this.memberId, this.fullName, this.eventId,
      this.eventType, this.isAbsent, this.isLate, this.isExcused,
      this.excuseReason, this.capacity].includes(undefined)) {
      console.log(this.toDto())
      throw new Error("IllegalArgumentException: Missing parameter for attendance object!")
    }

    if (!this.id) {
      this.id = new ObjectId()
    }
  }

  toDbo() {
    return {
      _id: this.id,

      event: {
        eventId: ObjectId(this.eventId),
        type: this.eventType
      },
      member: {
        memberId: ObjectId(this.memberId),
        fullName: this.fullName
      },

      isLate: this.isLate,
      isAbsent: this.isAbsent,
      isExcused: this.isExcused,
      excuseReason: this.excuseReason,
      capacity: this.capacity
    }
  }

  toDto() {
    return {
      id: this.id,
      memberId: this.memberId,
      fullName: this.fullName,
      eventId: this.eventId,
      eventType: this.eventType,
      isShort: this.isLate,
      isAbsent: this.isAbsent,
      isExcused: this.isExcused,
      excuseReason: this.excuseReason,
      capacity: this.capacity
    }
  }
}

module.exports = {
  Attendance
}