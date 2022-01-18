import React from "react";
import { connect } from "react-redux";
import "bootstrap/dist/js/bootstrap.min.js";
import {updateStudentID,onUpdateStudentRubixID, onPresShowProfile} from "../../actions";

class SudentsTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStudent: {},
    }
  }
  //Select Specific Student
  selectStudent(e){
    this.props.onUpdateStudentRubixID(this.state.currentStudent.RubixRegisterUserID)
    this.props.onPresShowProfile()
  }

  
  render() {
    const { StudentList } = this.props;
    return (
      <div className="col-lg-12">
        <div className="card">
          <div className="header">
            <h2>
              Student Details{" "}
              <small>
               List of all students
              </small>
            </h2>
          </div>
          <div className="body table-responsive table-hover">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>FIRST NAME</th>
                  <th>LAST NAME</th>
                  <th>Email</th>
                  <th>ID NUMBER</th>
                  <th>STUDENT NUMBER</th>
                  <th>QUICK ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {StudentList.map((student, index) => (
                  <>
                  <tr data-toggle="collapse" 
                  aria-expanded="false"
                  aria-controls={"collapseComment" + index}
                  href={"#collapseComment" + index}
                  onClick={(e)=>this.setState({
                    currentStudent: student
                  })}
                  >
                  <th scope="row">1</th>
                  <td>{student.Name} {student.MiddleName}</td>
                  <td>{student.Surname}</td>
                  <td>{student.UserEmail}</td>
                  <td>{student.IDNumber}</td>
                  <td>{student.StudentNumber}</td>
                  <td><button>View Full Details</button></td>
                </tr>
                <tr className="collapse multi-collapse m-t-10" id={"collapseComment" + index} >
                      <th scope="row"> </th>
                      <td><span><strong>Full Name: </strong>{student.Name} {student.MiddleName} {student.Surname}</span>
                      <br></br>
                      <span><strong>Email: </strong>{student.UserEmail}</span></td>
                      <td><span><strong>Phone Number: </strong>{student.PhoneNumber}</span>
                      <br></br>
                      <span><strong>Gender: </strong>{student.Gender}</span></td>
                      <td><span><strong>Student Number: </strong>{student.StudentNumber}</span></td>
                      <td><button class="btn btn-primary" onClick={(e)=>this.selectStudent(e)}>View Full Profile</button></td>
              </tr>
              
              </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ mailInboxReducer, navigationReducer, }) => ({
  currentStudentiD: navigationReducer.studentID,
  showProfile: mailInboxReducer.isProfileShowing,

});

export default connect(mapStateToProps, {
  updateStudentID,
  onUpdateStudentRubixID,
  onPresShowProfile
})(SudentsTable);
