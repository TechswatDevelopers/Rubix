import React from "react";
import { connect } from "react-redux";
import "bootstrap/dist/js/bootstrap.min.js";
import {updateStudentID,onUpdateStudentRubixID, onPresShowProfile, onPresRooms, updateStudentName} from "../../actions";

class SudentsTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStudent: {},
    }
  }
  //Select Specific Student
  selectStudent(e){
    this.props.onUpdateStudentRubixID(e.RubixRegisterUserID)
    console.log('student details: ', e)
    this.props.updateStudentName(
      e.Name 
      + ' ' 
      + e.MiddleName 
      +  ' ' 
       + e.Surname)
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
                  <th>Status</th>
                  <th>FIRST NAME</th>
                  <th>LAST NAME</th>
                  <th>Email</th>
                  <th>ID NUMBER</th>
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
                  onClick={(e)=>{
                    this.setState({
                    currentStudent: student
                  })}
                
                }
                  >
                  <th scope="row">
                    <div style={{
                      height: '30px',
                      width: '30px',
                      backgroundColor: student.Color
                    }}></div>
                    </th>
                  <td>{student.Name} {student.MiddleName}</td>
                  <td>{student.Surname}</td>
                  <td>{student.UserEmail}</td>
                  <td>{student.IDNumber}</td>
                  <td>
                    <>
                  <button className="btn btn-sm btn-outline-primary" 
                  onClick={(e)=>{
                    localStorage.setItem('tab', 'settings')
                    this.setState({
                      currentStudent: student
                    })
                    this.selectStudent(student)
                    this.props.onPresShowProfile()
                  }
                    
                    }>
                    <span>
                      <i className=" icon-user-following"></i> 
                         Profile
                      </span>
                    </button>{" "}
                &nbsp;&nbsp;
                  <button className="btn btn-sm btn-outline-success" 
                  onClick={(e)=>{
                    localStorage.setItem('tab', 'documents')
                    this.setState({
                      currentStudent: student
                    })
                    this.selectStudent(student)
                    this.props.onPresShowProfile()}}>
                    <span>
                      <i className=" icon-magnifier"></i> 
                         Vet
                      </span>
                    </button>{" "}
                &nbsp;&nbsp;
                  <button className="btn btn-sm btn-outline-info" 
                  onClick={(e)=>{
                    e.preventDefault()
                    this.setState({
                      currentStudent: student
                    })
                    this.selectStudent(student)
                    this.props.onPresRooms(e)
                    if(this.props.showProfile){
                      this.props.onPresShowProfile()
                      
                    }
                    }}>
                    <span>
                      <i className=" icon-key"></i> 
                         Room
                      </span>
                    </button>
                  </></td>
                </tr>
                <tr className="collapse multi-collapse m-t-10" id={"collapseComment" + index} >
                      <th scope="row"> </th>
                      
                      <td>{student.RequiredDocuments}</td>
                      <td><span><strong>Full Name: </strong>{student.Name} {student.MiddleName} {student.Surname}</span>
                      <br></br>
                      <span><strong>Email: </strong>{student.UserEmail}</span></td>
                      <td><span><strong>Phone Number: </strong>{student.PhoneNumber}</span>
                      <br></br>
                      <span><strong>Gender: </strong>{student.Gender}</span></td>
                      <td><span><strong>Student Number: </strong>{student.StudentNumber}</span></td>
                      {/* <td><button class="btn btn-primary" onClick={(e)=>this.selectStudent(e)}>View Full Profile</button></td> */}
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
  onPresShowProfile,
  onPresRooms,
  updateStudentName
})(SudentsTable);
