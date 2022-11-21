import React from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import axios from "axios";
import PageHeader from "../../components/PageHeader";
import PopUpConfirmSubmit from "../../components/PopUpConfirmSubmit"
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import {
  onPresPopUpConfirmSupport,
   updateLoadingController,
   updateLoadingMessage,
   updateResidenceID
  }from "../../actions"

class RubixSurport extends React.Component {
  
    //Initial State
    constructor(props) {
      super(props);
      this.state = {
        isLoad: true,
        isShow: false,
        isShowing: false,
        isShowInfo: false,
        topic: '',
        students: [],
        studentList: [],
        querries: ['Add to residence', 'Remove from Rubix', 'Cannot log in', 'Lease Issue', 'Other'],
        resList: [],
        tickets: []
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

    //Fetch all tickets
    getTockets(){

      this.setState({
        tickets: []
      })

      const data = {
        'RubixClientID': 1,
        'RubixResidenceID': 1,
        'UserCode': localStorage.getItem('userCode')
      }

      const requestOptions = {
        title: 'Get All Student Tickets',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
      }

      console.log("Posted Data: ", data)
      const postData = async () => {
        await axios.post('https://jjprest.rubix.mobi:88/api/RubixGetSupportData', data, requestOptions)
        .then(response => {
          console.log("Response Data:", response)
          this.setState({
            tickets: response.data.PostRubixUserData
          })
        })

      }
      postData()
      
    }
  
    //Fetch all students Data
    getStudents(search, resID){
      this.setState({
        isEmpty: false,
        student: [],
        studentList: [],
      
      })
       if(this.state.isShowInfo){
        document.getElementById('Comments').value = ''
       }
       
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
          await axios.post('https://jjprest.rubix.mobi:88/api/RubixAdminStudentList', pingData, requestOptions)
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
            //Fetch Ticket List
            this.getTockets()  
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

  //console.log("Posted Data:", data)

  const postData = async()=>{
    await axios.post('https://jjprest.rubix.mobi:88/api/RubixSupportAdd', data, requestOptions)
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

    //Fetch Ticket List
    this.getTockets()

    //Fetch Residences
    const fetchData = async() =>{
      //Populate Residence list
      await fetch('https://jjprest.rubix.mobi:88/api/RubixResidences/')
      .then(response => response.json())
      .then(data => {
          //console.log("data is ", data)
          this.setState({resList: data.data})
          });
      } 
      fetchData();
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
                src={localStorage.getItem('clientLogo')}
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
            
            {
            localStorage.getItem('adminLevel') == 2 || localStorage.getItem('adminLevel') == '2' 
            ? <>
            <p> <strong>Please Select a Residence to view: </strong></p>
            {  
        <select className="form-control" onChange={(e)=>{
          this.setState({
            res: e.target.value,
            isShowInfo: true
          })
          this.getStudents('', e.target.value)
          this.props.updateResidenceID(e.target.value)
          //console.log('ResID1: ', e.target.value)
          localStorage.setItem('resID', e.target.value)
          }} value={this.state.res}>
        {
            
            this.state.resList.map((res, index)=> (
            <option key={index} name='ResidenceID' value = {res.RubixResidenceID }>{res.ResidenceName}</option>
        ))   
        }
    </select> }
            </>
          : <div>
            <div className="row clearfix m-2">
              <div className="col-lg-12 col-md-12">
              <div className="card planned_task">
              <div className="header">
                    <h4>Ticket List</h4>
                  </div>
                  <ScrollMenu>
                    {
                      this.state.tickets.map((ticket, index) => (
                        <div className="card p-2">
                          <div className="m-2">
                          <p className="m-2"><strong>{ticket.Topic}</strong></p>
                          <p><strong>Issue: </strong>{ticket.Comments}</p>
                          <p><strong>Status: </strong>{ticket.Status}</p>
                          </div>
                        </div>
                      ))
                    }
                  </ScrollMenu>

                </div>
              </div>
            </div>

            <div className="row clearfix">
              <div className="col-lg-12 col-md-12">
                <div className="card planned_task">
                  <div className="header">
                    <h4>New Rubix Support Ticket</h4>
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
                        : <div> </div>
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
          
          }

            {/* Top Bar Ticket Lists */}
            {
              this.state.isShowInfo
              ? <div className="row clearfix m-2">
              <div className="col-lg-12 col-md-12">
              <div className="card planned_task">
              <div className="header">
                    <h4>Ticket List</h4>
                  </div>
                  <ScrollMenu>
                    {
                      this.state.tickets.map((ticket, index) => (
                        <div className="card p-2">
                          <div className="m-2">
                          <p className="m-2"><strong>{ticket.Topic}</strong></p>
                          <p><strong>Issue: </strong>{ticket.Comments}</p>
                          <p><strong>Status: </strong>{ticket.Status}</p>
                          </div>
                        </div>
                      ))
                    }
                  </ScrollMenu>

                </div>
              </div>
            </div>
            : null}

             {/* Add new ticket */}
             { this.state.isShowInfo
             ?<div className="row clearfix">
              <div className="col-lg-12 col-md-12">
                <div className="card planned_task">
                  <div className="header">
                    <h4>New Rubix Support Ticket</h4>
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
                        : <div> </div>
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
             : null}
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
    updateResidenceID,
  })(RubixSurport);
