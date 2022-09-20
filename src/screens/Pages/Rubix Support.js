import React from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import axios from "axios";
import PageHeader from "../../components/PageHeader";
import PopUpConfirmSubmit from "../../components/PopUpConfirmSubmit"
import {
  onPresPopUpConfirmSupport,
   updateLoadingController,
   updateLoadingMessage
  }from "../../actions"

class RubixSurport extends React.Component {
    //Initial State
    constructor(props) {
      super(props);
      this.state = {
        isLoad: true,
        isShow: false,
        isShowing: false,
        topic: '',
        students: [],
        studentList: [],
        querries: ['Add to residence', 'Remove from Rubix', 'Cannot log in', 'Lease Issue', 'Other'],
      };
    }

    //Check if Student is in list
    checkBoxChecked(keyString) {
      let isChecked = false;
      if(this.state.studentList.includes(keyString)){
        isChecked = true;
      }
      return isChecked
    }
  
    //Fetch all students Data
    getStudents(search, resID){
      this.setState({
        isEmpty: false,
        student: [],
        studentList: [],
      
      })
      document.getElementById('Comments').value = ''
      if(localStorage.getItem('role') == 'admin'){
  
      } else {
        document.getElementById('search').value = search
      }
      const pingData = {
          'UserCode': localStorage.getItem('userCode'),
          'RubixClientID':  localStorage.getItem('clientID'),
          'RubixResidenceID': resID, 
          'Search': search
        };
        //Ping Request Headers
        const requestOptions = {
          title: 'Get All Students',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: pingData
        };
        //console.log('Posted data: ', pingData)
        const postData = async () => {
          await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixAdminStudentList', pingData, requestOptions)
          .then(response => {
            //console.log("All Students: ", response)
            if(!response.data.PostRubixUserData){
              this.setState({
                isEmpty: true,
                students: []
              })
              //Set timer for loading screen
            setTimeout(() => {
              //this.props.updateLoadingController(false);
            }, 2000);
            } else {
              this.setState({
                students: response.data.PostRubixUserData
              })
            
            }
          })
        }
        postData().then(() =>{
          setTimeout(() => {
            
          }, 4000);
        })
    }

    //Handle Issue Topic
    handleIssue(e){
      this.setState({
        topic: e.target.value
      })
    }

    //Toggle Classified
    handleClass(e){
      this.setState({
        isShowing: true,
      })
      if(e.target.value == 'in-res'){
        //Load Res students
        this.getStudents('', localStorage.getItem('resID'))
      } else if(e.target.value == 'not-in-res'){
        //Load Res99 students
        this.getStudents('', '99')
      }
      this.setState({

      })
    }

    //Change Querry
    handleQuerry(e){
      if(e.target.checked){
        document.getElementById('Comments').value = document.getElementById('Comments').value + e.target.value
      } else {

      }
    }

    ///Change Student lists
    handleCheck(e){
      //e.preventDefault();
      if(e.target.checked){
        this.state.studentList.push(e.target.value)
      } else {
        this.state.studentList.splice(this.state.studentList.indexOf(e.target.value), 1)
      }
      ///Reset Input box
      document.getElementById('Comments').value = this.state.studentList.join()

      this.setState({

      })
    }

  ///Submit Function
  Submit(e){
    e.preventDefault();
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Submitting Request...");
    const data = {
      'RubixClientID': localStorage.getItem('clientID'),
      'RubixResidenceID': localStorage.getItem('resID'),
      'AdminID': localStorage.getItem('adminID'),
      'Resmanager': this.state.topic,
      'Comments': document.getElementById('Comments').value
    }
    const requestOptions = {
      title: 'Student University Deytails',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
  };

  console.log("Posted Data:", data)

  const postData = async()=>{
    await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixSupportAdd', data, requestOptions)
    .then(response => {
      //console.log('done', response)
      if(response.data.PostRubixUserData[0].Response == 1){
        
      }
    })
  }
  setTimeout(() => {
    this.props.updateLoadingController(false);
  }, 4000);
  postData().then(() => {
    this.props.onPresPopUpConfirmSupport()
    //window.location.reload()
  })
  }
  ///Initial state (On Page Load)
  componentDidMount() {
    window.scrollTo(0, 0);
    //Load Data
    this.getStudents('', '99')
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
        <div
          className="page-loader-wrapper"
          style={{ display: this.props.MyloadingController ? "block" : "none" }}
        >
          <div className="loader">
            <div className="m-t-30">
              <img
                src={this.props.rubixClientLogo}
                width="20%"
                height="20%"
                alt=" "
              />
            </div>
            <p>{this.props.loadingMessage}</p>
          </div>
        </div>
          <PopUpConfirmSubmit />
          <div className="container-fluid">
            <PageHeader
              HeaderText="Rubix Support"
              Breadcrumb={[
                { name: "Page", navigate: "" },
                { name: "Rubix Support", navigate: "" },
              ]}
            />
            <div className="row clearfix">
              <div className="col-lg-12 col-md-12">
                <div className="card planned_task">
                  <div className="header">
                    <h4>Rubix Support</h4>
                  </div>
                  <div className="body">
                    <p>Please fill in the form below and we will get back to you at our earliest convinience.</p>
                    <div>
                      <p>Is the student <strong>ACTIVE</strong> in your residence?</p>
                      <input className="m-2" type="radio" name="class" value ='in-res' onChange={(e) => {this.handleClass(e)}}/>
                        <span>Yes</span>
                      <input className="m-2" type="radio" name="class" value ='not-in-res' onChange={(e) => {this.handleClass(e)}}/>
                       <span>No</span>
                    </div>

                    {
                             this.state.isShowing

                      ? <button className="btn btn-primary btn-sm btn-block mt-3 mb-3"  
                    onClick={(e) => {
                      e.preventDefault()
                      this.setState({
                      isShow: !this.state.isShow})} }>
                        {this.state.isShow ? "Hide List" : "Select Students"}
                        </button>
                        : <div></div>
                        }
                    {
                      this.state.isShow
                      ? <div>
                      {
                        this.state.students.map((student, index) => (
                          <div>
                            <input value={student.Name + '' + student.Surname} 
                            checked = {
                              this.checkBoxChecked(student.Name + student.Surname)
                              } type="checkbox" onChange={(e) =>{this.handleCheck(e)}}/>
                            <span> {student.Name + ' ' + student.Surname}</span>
                          </div>
                        ))
                      }
                    </div>
                  : <div> </div>  
                  }

                  <h5>Please assist with: </h5>
                    <div>
                      {
                        this.state.querries.map((querry, index) => (
                          <div>
                            <input name="topic" value={querry} 
                             type="radio" onChange={(e) =>{this.handleIssue(e)}}/>
                            <span> {querry}</span>
                          </div>
                        ))
                      }
                    </div>
                    <div className="form-group">
                        <label className="control-label sr-only" >
                        Comment:
                            </label>
                            <input
                          className="form-control"
                          id="Comments"
                          name='Comments'
                          placeholder="Enter your comment or question"
                          type="text"
                          required
                        />
                      </div>

                      <button className="btn btn-primary btn-lg btn-block" type="submit" onClick={(e) => this.Submit(e) }>
                        Submit
                        </button>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ ioTReducer, navigationReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
  MyloadingController: navigationReducer.loadingController,
  loadingMessage: navigationReducer.loadingMessage,
  rubixClientLogo: navigationReducer.clientLogo,
  rubixThemeColor: navigationReducer.themeColor,
  rubixClientName: navigationReducer.clientName,
});

export default connect(
  mapStateToProps, {
    onPresPopUpConfirmSupport,
    updateLoadingController,
    updateLoadingMessage,
  })(RubixSurport);
