import React from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import SudentsTable from "../../components/Tables/StudentTables";
import axios from "axios";
import ProfileV1Setting from "../../components/Pages/ProfileV1Setting";
import {updateStudentID, onPresShowProfile, onPresRooms, onPresPopUpAssign} from "../../actions"
import ProfileV1Page from '../../screens/Pages/ProfileV1';
import RoomAllocation from '../../screens/Pages/Rooms';
import PopUpAssign from '../../components/PopUpAssignRoom';

import {Grid, Row, Col, Button} from "react-bootstrap";

class Students extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          searchKey: '',
          students: [],
          showRooms: false,
          colors: [],
          isEmpty: false,
        }
      }
  componentDidMount() {
    window.scrollTo(0, 0);
    this.getStudents('')
  }

  //Fetch all students Data
  getStudents(search){
    this.setState({
      isEmpty: false,
    })
    document.getElementById('search').value = search
    const pingData = {
        'UserCode': localStorage.getItem('userCode'),
        'RubixClientID': localStorage.getItem('clientID'),
        'Search': search
      };
      //Ping Request Headers
      const requestOptions = {
        title: 'Get All Students Details',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: pingData
      };
      console.log('Posted data: ', pingData)
      const postData = async () => {
        await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixAdminStudentList', pingData, requestOptions)
        .then(response => {
          console.log("Students Data List:", response)
          if(!response.data.PostRubixUserData){
            this.setState({
              isEmpty: true,
              students: []
            })
          } else {
            this.setState({
              students: response.data.PostRubixUserData
            })
          }
          

        })
      }
      postData().then(() =>{
        this.getColors()
      })
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

  //Post Search Student
  searchStudent(e){
    e.preventDefault();
    //console.log('I am called for: ', document.getElementById('search').value)
    
    //Set Search key state
    this.setState({
      searchKey: document.getElementById('search').value
    })

    //Do post
    this.getStudents(document.getElementById('search').value)
  }


  render() {
    return (
      <div
        style={{ flex: 1 }}
        onClick={() => {
          document.body.classList.remove("offcanvas-active");
        }}
      >
        <div>
          <div className="container-fluid">
            <PageHeader
              HeaderText="Students Details Page"
              Breadcrumb={[
                { name: "Students Details Page", navigate: "" },
              ]}
            />
            <div className="row clearfix">
              <div className="col-lg-12 col-md-12">
              <SudentsTable
              StudentList= {this.state.students}
              Colors = {
                <>
                <div data-toggle="collapse" 
                  aria-expanded="false"
                  aria-controls={"colors"}
                  href={"#colors"}>

                    <div className="btn btn-primary m-3">Filter by color codes</div>
                  </div>
            {
              this.state.colors.map((color, index) =>(
                <>
                
                <Row onClick={()=> this.getStudents(color.Color)} className="collapse multi-collapse m-t-10" id={"colors"}>
                <div style={{
                      height: '20px',
                      width: '20px',
                      backgroundColor: color.Color
                    }}>

                  </div>
                    <p >{"  " + color.ColorDescription}</p>
                    </Row>
                </>
              ))
            }
            
            {this.state.isEmpty ? <p style={{
              color: 'Red'
            }}>No records found</p> : null}
                </>
              }
              Form = {<>
                <form id="navbar-search" className="navbar-form search-form d-flex p-2">
                <input
                  className="form-control"
                  placeholder="Search here..."
                  type="text"
                  id='search'
                />
                <button className="btn btn-default" onClick={(e)=> this.searchStudent(e)}>
                  <i className="icon-magnifier"></i>
                </button>
              </form>
              <button className="btn btn-primary ml-5" onClick={()=>this.getStudents('')}>Clear Search</button>
              </>
              }
              />

{
  this.props.showProfile
  ? <ProfileV1Page/> 

: null}
{
  this.props.showRooms
  ? <RoomAllocation />
:null
}

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ ioTReducer, navigationReducer, mailInboxReducer}) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
  currentStudentiD: navigationReducer.studentID,
  showProfile: mailInboxReducer.isProfileShowing,
  showRooms: mailInboxReducer.isRoomshowing,
});

export default connect(mapStateToProps, {
    updateStudentID,
    onPresShowProfile,
    onPresRooms,
    onPresPopUpAssign
})(Students);
