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

class RubixTickets extends React.Component {
  
    //Initial State
    constructor(props) {
      super(props);
      this.state = {
        isLoad: true,
        isShow: false,
        isShowing: false,
        isShowInfo: false,
        tickets: [],
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
      const data = {
        'RubixClientID': 1,
        'RubixResidenceID': 0,
        'UserCode': localStorage.getItem('userCode')
      }

      const requestOptions = {
        title: 'Get All Student Tickets',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
      }

      //console.log("Posted Data: ", data)
      const postData = async () => {
        await axios.post('https://adowarest.rubix.mobi:88/api/RubixGetSupportData', data, requestOptions)
        .then(response => {
          //console.log("Response Data:", response)
          this.setState({
            tickets: response.data.PostRubixUserData
          })
        })

      }
      postData()
      
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

  ///Submit Function
  Submit(e, ticketID, status){
    e.preventDefault();
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Submitting Request...");
    const data = {
      'RubixSupportID': ticketID,
      'UserCode': localStorage.getItem('userCode'),
      'Status': status
    }
    const requestOptions = {
      title: 'Update Ticket',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
  };

  //console.log("Posted Data:", data)

  const postData = async()=>{
    await axios.post('https://adowarest.rubix.mobi:88/api/RubixSupportUpdate', data, requestOptions)
    .then(response => {
      //console.log('done', response)
      
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

    //Fetch Ticket List
    this.getTockets()
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
                          {ticket.Status == 'Open'
                          ?<button 
                          onClick={(e)=>{this.Submit(e, ticket.RubixSupportID, 'Assigned')}} 
                          className="btn btn-primary btn-lg btn-block">Start Task</button> 
                          :ticket.Status == 'Assigned'
                          ? <button 
                          onClick={(e)=>{this.Submit(e, ticket.RubixSupportID, 'Closed')}} 
                          className="btn btn-warning btn-lg btn-block">Close Ticket</button>
                          : null
                          }
                          
                          </div>
                        </div>
                      ))
                    }
                  </ScrollMenu>

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
    updateResidenceID,
  })(RubixTickets);
