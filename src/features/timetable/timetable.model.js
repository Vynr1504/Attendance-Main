class subjectModel {
  constructor(
    subject,
    branch,
    semester,
    timing,
    section,
    location,
    course,
    session
  ) {
    (this.subject = subject),
      (this.branch = branch),
      (this.semester = semester),
      (this.timing = timing),
      (this.section = section),
      (this.location = location),
      (this.course = course),
      (this.session = session);
  }
}


const createTimeTableList = () => {
  return {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
  };
};

class TimeTableModel {
  constructor(ownerId) {
    (this.ownerId = ownerId),
      (this.TimeTable = createTimeTableList()),
      ////////for rescheduling to me////////
      (this.assignedToMe = createTimeTableList()),
      (this.meAssignedToOther = createTimeTableList()),
      (this.request = []),
      (this.meRequestedOther = []);
  }
}



export { subjectModel, TimeTableModel };
