import React from "react";
import { connect } from "react-redux";
import "bootstrap/dist/js/bootstrap.min.js";
import {Grid, Row, Col, Button} from "react-bootstrap";
import {updateStudentID,onUpdateStudentRubixID, onPresShowProfile, onPresRooms, updateStudentName} from "../../actions";

class SudentsTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStudent: {},
      currentIndex: null,
      isOpen: false,
      colors: [],
    }
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    this.getColors()
  }


  //Get rubix color codes
  getColors(){
    const fetchData = async () => {
      await fetch('https://rubixapi.cjstudents.co.za:88/api/RubixGetColor')
      .then(response => response.json())
      .then(data => {
        console.log("colors data: ", data.data)
        this.setState({
          colors: data.data
        })
      })
    }
    fetchData()
  }
  //Select Specific Student
  selectStudent(e){
    this.props.onUpdateStudentRubixID(e.RubixRegisterUserID)
    //console.log('student details: ', e)
    this.props.updateStudentName(
      e.Name 
      + ' ' 
      + e.MiddleName 
      +  ' ' 
       + e.Surname)
  }

  //Split String into list
  splitString(given) {
    var string
    if (given !== null || given != undefined){
      string = given.split(',').map(function (element, index) {
        return <p key={index}>{ element }</p>; 
    });
    } else {
      string = ''
    }
     
    return string
  }

  //On Student Press
  onPressStudent(index){
    if(this.currentIndex == null){
      document.getElementById('student').href = "#collapseComment" + index
    } else if(this.currentIndex == index) {
      document.getElementById('student').href = "#collapseComment" + index
     
    } else {
      document.getElementById('student').href = "#collapseComment" + this.currentIndex
       //Set timer for loading screen
  setTimeout(() => {
    document.getElementById('student').href = "#collapseComment" + index
  }, 2000);
    }
  }

  
  render() {
    const { StudentList, Form, Colors } = this.props;
    return (
      <div className="col-lg-12">
        <div className="card">
          <div className="header">
            <Row>
            <h2>
              Student Details{" "}
              <small>
               List of all students
              </small>
            </h2>
            <div style={{
              width: '50px'
            }}></div>
            {Form}
            
              </Row>
              {Colors}
            
          </div>
          <div className="body table-responsive table-hover">
            <table className="table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>FIRST NAME</th>
                  <th>LAST NAME</th>
                  <th>ID NUMBER</th>
                  <th>QUICK ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {StudentList.map((student, index) => (
                  <>
                  <tr data-toggle="collapse" 
                  id="student"
                  aria-expanded="false"
                  aria-controls={"collapseComment" + index}
                  href={"#collapseComment" + index}
                  onClick={(e)=>{
                    this.setState({
                    currentStudent: student,
                    currentIndex: index,
                    isOpen: !this.state.isOpen
                  })
                  this.onPressStudent(index)
                }
                
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
                  <td>{student.IDNumber}</td>
                  <td>
                    <>
                  <button className="btn btn-sm btn-outline-primary" 
                  onClick={(e)=>{
                    e.preventDefault()
                    localStorage.setItem('tab', 'settings')
                    this.setState({
                      currentStudent: student
                    })
                    this.selectStudent(student)
                    if(this.props.showProfile && this.state.currentStudent == student){
                      this.props.onPresShowProfile()
                    } else if(this.props.showProfile && this.state.currentStudent != student){
                      this.props.onPresShowProfile()
                      //Set timer for loading screen
                      setTimeout(() => {
                        this.props.onPresShowProfile()
                      }, 2000);
                    } else {
                      this.props.onPresShowProfile()
                    }
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


                { student.Color == "Green" || student.Color == "Yellow" || student.Color == "Blue" || student.Color == "Purple"
                
                ? <button className="btn btn-sm btn-outline-info" 
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
                  : null  
                  }


                  </></td>
                </tr>
                <tr className="collapse multi-collapse m-t-10" id={"collapseComment" + index} >
                      <th scope="row"> </th>
                      
                      <td>{this.splitString(student.RequiredDocuments)}</td>
                      <td><span><strong>Full Name: </strong>{student.Name} {student.MiddleName} {student.Surname}</span>
                      <br></br>
                      <span><strong>Email: </strong>{student.UserEmail}</span>
                      <br></br>
                      <span><strong>Phone Number: </strong>{student.PhoneNumber}</span>
                      <br></br>
                      <span><strong>Gender: </strong>{student.Gender}</span>
                      <br></br>
                      <span><strong>Student Number: </strong>{student.StudentNumber}</span>
                      </td>
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
