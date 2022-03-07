import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Nav, Toast } from "react-bootstrap";
import { Component } from "@fullcalendar/core";
import {Helmet} from "react-helmet";

class LeaseInformation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          
        }
      }
      componentDidMount() {
        window.scrollTo(0, 0);
      }

      //Update Lease Information
      postLeaseData() {
        //Set Loading Screen ON
        //this.props.updateLoadingController(true);
        //this.props.updateLoadingMessage("Loading Residence Events...");
        //Post Request Data
        const data = {
          'PDFDocumentUrl': '',
          "LeaseStartDate" : "",
          "LeaseEndDate" : "",
          "LeaseAmount" : ""

        }
        const requestOptions = {
          title: 'Update Lease Information',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: data
        }
    
        //Http Post Request
        const postData = async () => {
          await axios.post('https://rubixpdf.cjstudents.co.za:94/PDFLeaseAdd', data, requestOptions)
          .then(response => {
    
            if(response.data.PostRubixUserData == null || response.data.PostRubixUserData.length == 0){
    
            } else {
              //console.log("Res Events: ", response.data.PostRubixUserData)
              //Popolate Events List
              this.populateEvents(response.data.PostRubixUserData)
              this.setState({
                totalResEvents: response.data.PostRubixUserData[0].TotalEvents,
                upcomingResEvents: response.data.PostRubixUserData[0].UpcomingEvents,
                pastEvents:response.data.PostRubixUserData[0].PastEvents
              })
            }
    
            
        this.props.updateLoadingController(false);
        //Get Student Events
        this.getStudentEvents()
            
          })
        }
        postData()
      }
    render() {
        return(
            <div>
                <Helmet>
                <meta charSet="utf-8" />
                <title>Lease Information</title>
            </Helmet>
            </div>
        )
    }
}


const mapStateToProps = ({ mailInboxReducer, navigationReducer }) => ({
    isEventModal: mailInboxReducer.isEventModal,
    isPopUpModal: mailInboxReducer.isPopUpModal,
  
    MyloadingController: navigationReducer.loadingController,
    loadingMessage: navigationReducer.loadingMessage,
  });
  
  export default connect(mapStateToProps, { 
    onPresAddEvent, 
    onPresPopUpEvent,
    updateLoadingMessage,
    updateLoadingController,
   })(LeaseInformation);