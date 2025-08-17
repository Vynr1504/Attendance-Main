import { getDB } from "../../config/mongodb.js";
import StudentModel from "./student.model.js";
import { getStudentList } from "../../ExternalAPI_ERP/getStudentList.js";
import { ObjectId } from "mongodb";

export default class StudentRepo {
  constructor() {
    this.collection = "Student";
    this.electiveCollection = "ElectiveStudent";
    this.attendanceCollection = "Attendance";
  }
  async addStudent(data) {
    try {
      const db = await getDB();
      const collection = await db.collection(this.collection);
      const check = await collection.findOne({
        scholarNumber: data.scholarNumber,
      });
      // console.log(check);
      if (check) {
        return "Student Already Exist";
      } else {
        const newStudent = new StudentModel(
          data.scholarNumber,
          data.studentName,
          data.branch,
          data.section,
          data.batch
        );
        const res = await collection.insertOne(newStudent);
        if (res) {
          return "Success";
        } else {
          throw "Something Went Wrong!";
          // return "Something Went Wrong!";
        }
      }
    } catch (e) {
      console.log(e);
      return "Some Internal Error";
    }
  }

  async findByScholarNumber(scholarNumber) {
    try {
      const db = await getDB();
      const collection = await db.collection(this.collection);
      const check = await collection.findOne({
        scholarNumber: scholarNumber,
      });
      if (check) {
        return check;
      } else {
        throw "Error";
      }
    } catch (e) {
      console.log(e);
      return "Some Internal Error";
    }
  }
  async updateStudentDetail(field, scholarNumber, newVal) {
    try {
      if (field != "scholarNumber") {
        const db = await getDB();
        const collection = await db.collection(this.collection);
        const result = await collection.updateOne(
          { scholarNumber: scholarNumber },
          { $set: { field: newVal } }
        );
        if (result) {
          return "Successfully Updated";
        } else {
          throw "Error";
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  async findByFilter(filtr) {
    try {
      console.log("Applying the Filter : " , filtr);
      const db = await getDB();
      const attendanceCollection = await db.collection(
        this.attendanceCollection
      );
      
      const checkAttendance = await attendanceCollection.findOne({
        ownerId: filtr.ownerId.toString(),
        branch: filtr.branch,
        subjectId: filtr.subjectId,
        session: filtr.batch,
        section: filtr.section,
      });
      let CheckToday = false;
      // console.log(checkAttendance);
      if(checkAttendance && checkAttendance.isMarked){
        console.log("Get IsMarked Dates: ", checkAttendance.isMarked);
        CheckToday = checkAttendance.isMarked.some(date => date.startsWith(filtr.dateTime));
      }
      console.log("Check Today: ", CheckToday);
      if (CheckToday) {
        console.log("Attendance already marked for this date");
        return "Already Filled";
      }
      
      const collection = await getStudentList(filtr.subjectCode);
      if (!collection || collection.length === 0) {
        console.log("No students found for the given subject code");
        return [];
      }
      // Sample object.  The collection  is an array of objects like this : 
    //   {
    //     "roll_no": "2311201253",
    //     "full_name": "KATRAVATH  SURYA  TEJA",
    //     "branch_section": "2",
    //     "subname": "Operating Systems",
    //     "subject_code": "CSE 311",
    //     "teacher_name": "Mitul Kumar Ahirwal",
    //     "program_name": "Computer Science & Engineering "
    // }
      let result = collection
        .filter(student => student.branch_section === `${filtr.section}`);
      let modified = result.map(student =>{
        let new_student = new Object();
        new_student.scholarNumber=student.roll_no;
        new_student.section=student.branch_section;
        new_student.StudentName=student.full_name;
        new_student.branch=filtr.branch;
        new_student.batch=filtr.batch;
        return new_student; // Return the new object
      })
      modified.sort(function (a, b) {
        var keyA = a.scholarNumber,
          keyB = b.scholarNumber;
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      return modified; // Return the modified array instead of result
    } catch (e) {
      console.log(e);
      return "Error";
    }
  }
  // async findElectiveList(filtr) {
  //   try {
  //     const db = await getDB();
  //     const collection = await db.collection(this.electiveCollection);
  //     let result = await collection.findOne(filtr);
  //     // console.log(result);
  //     return result == null ? [] : result.list;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
  async findElectiveList(filtr) {
    try {
      const db = await getDB();
      const attendanceCollection = await db.collection(
        this.attendanceCollection
      );
      const checkAttendance = await attendanceCollection.findOne({
        ownerId: filtr.ownerId.toString(),
        branch: filtr.branch,
        subjectId: filtr.subjectId,
        session: filtr.batch,
        section: filtr.section,
      });
      // console.log(checkAttendance);
      if (
        filtr.temp == null &&
        checkAttendance &&
        checkAttendance.isMarked != null &&
        checkAttendance.isMarked.some(date => date.startsWith(filtr.dateTime))
      ) {
        return "Already Filled";
      }

      const collection = await db.collection(this.electiveCollection);
      let result = await collection.findOne({
        ownerId: filtr.ownerId,
        branch: filtr.branch,
        section: filtr.section,
        batch: filtr.batch,
        subjectId: filtr.subjectId,
      });
      // console.log(result);
      return result == null ? [] : result.list;
    } catch (e) {
      console.log(e);
    }
  }
  async addElectiveList(data) {
    try {
      const db = await getDB();
      const collection = await db.collection(this.electiveCollection);
      let result = await collection.insertOne(data);
      return result;
    } catch (e) {
      console.log(e);
    }
  }
}
