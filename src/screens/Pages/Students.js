import React from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import SudentsTable from "../../components/Tables/StudentTables";
import axios from "axios";
import ProfileV1Setting from "../../components/Pages/ProfileV1Setting";
import {updateStudentID} from "../../actions"

class Students extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          searchKey: '',
          students: [],
        }
      }
  componentDidMount() {
    window.scrollTo(0, 0);
    this.getStudents()
  }

  //Fetch all students Data
  getStudents(){
    const pingData = {
        'UserCode': localStorage.getItem('userCode'),
        'RubixClientID': localStorage.getItem('clientID'),
        'Search': this.state.searchKey
      };
      //Ping Request Headers
      const requestOptions = {
        title: 'Get All Students Details',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: pingData
      };
      const postData = async () => {
        await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixAdminStudentList', pingData, requestOptions)
        .then(response => {
          console.log("Students Data List:", response)
          this.setState({
            students: response.data.PostRubixUserData
          })
  
          //this.fetchImages(response.data.PostRubixUserData[0].RubixResidenceID)
          //Get Events Data
      //this.getResEvents()
        })
      }
      postData()
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
                { name: "Page", navigate: "" },
                { name: "Students Details Page", navigate: "" },
              ]}
            />
            <div className="row clearfix">
              <div className="col-lg-12 col-md-12">
              <SudentsTable
              StudentList= {this.state.students}
              />

<ProfileV1Setting 
StudentID= {this.props.currentStudentiD}
/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ ioTReducer, navigationReducer, }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
  currentStudentiD: navigationReducer.studentID
});

export default connect(mapStateToProps, {
    updateStudentID
})(Students);
