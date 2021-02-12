const ObjectId = require('mongodb').ObjectId

class Member {

  /**
   * @type string | null
   */
  id;

  /**
   * @type string
   */
  fullName;

  /**
   * @type Date
   */
  startDate;

  /**
   * @type Date | null
   */
  endDate;

  /**
   * @param {string} [id] - The ID of the member.
   * @param {string} fullName - The full name of the member.
   * @param {Date} startDate - The starting date of the member.
   * @param {Date} [endDate] - the leaving date of the member.
   */
  constructor(id, fullName, startDate, endDate = null) {
    this.id = id;
    this.fullName = fullName;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  /**
   * Converts a DBO (from the Database) to a `Member` object.
   *
   * @param {string} _id
   * @param {string} fullName
   * @param {Date} startDate
   * @param {Date} endDate
   * @return {Member}
   */
  static fromDbo({_id, fullName, startDate, endDate}) {
    return new Member(
      _id.toString(),
      fullName,
      new Date(startDate),
      endDate ? (new Date(endDate)) : null
    )
  }

  /**
   * Converts a DTO (from the client) to a `Member` object.
   */
  static fromDto({_id, fullName, startDate, endDate}) {
    return new Member(
      _id ? _id : null,
      fullName,
      new Date(startDate),
      endDate ? (new Date(endDate)) : null
    )
  }

  toDto() {
    let returnDto = {
      _id: this.id,
      fullName: this.fullName,
      startDate: this.startDate,
    }

    if (this.endDate) {
      returnDto.endDate = this.endDate
    }

    return returnDto
  }

  toDbo() {
    let returnDbo = {
      _id: this.id ? ObjectId(this.id) : undefined,
      fullName: this.fullName,
      startDate: this.startDate,
    }

    if (this.endDate) {
      returnDbo.endDate = this.endDate
    }

    return returnDbo
  }
}

module.exports = {
  Member
}