import React from "react";
import {Helmet} from "react-helmet";
import {connect} from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Nav, Toast } from "react-bootstrap";
import axios from "axios";
import PageHeader from "../../components/PageHeader";
import {updateLoadingMessage, updateLoadingController,
  onPresPopUpConfirmLeaseUpdate, onPresPopUpConfirmMassLeaseUpdate,
} from "../../actions";
import PopUpConfirmLeaseUpdate from '../../components/PopUpConfirmUpdateLease';
import PopUpConfrimUpdateAndRegen from '../../components/PopUpConfirmAmmendAlll';

class AdminAmmendPage extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        this.FetchResData()
        this.setState({

        })
    }

    constructor(props) {
        super(props)
        this.state = {
            allData: [],
            varsities: [],
            varsity: "",
            varsityID: "",
            residenceID: "",
            payMethods: [],
            payment: '',
            resName: '',
            singlePrice: '',
            sharingPrice: '',
            threeSharingPrice: '',
            studentList: [],

        }
    }

    //Fetch Res Data for Display
    FetchResData(){
       //Set Loading Screen ON
    this.props.updateLoadingController(true);
      this.props.updateLoadingMessage("Loading Residence Details, Please wait...");
        const data = {
            'UserCode': localStorage.getItem('userCode')
        };
        const requestOptions = {
          title: 'Fetch Res Data',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: data
        };
        //console.log('Posted request data:', data)
        const postData = async () => {
          await axios.post('http://129.232.144.154:88/api/RubixAdminGetLeaseRefferenceList', data, requestOptions)
            .then(response => {
              //Sort out the data
              //console.log('Response data:', response)
              if ( response.data.PostRubixUserData.length != 0){
              this.setState({
                  resName: response.data.PostRubixUserData[0].ResidenceName,
                  allData: response.data.PostRubixUserData,
                  residenceID: response.data.PostRubixUserData[0].RubixResidenceID,
                  varsityID: response.data.PostRubixUserData[0].RubixUniversityID,
              })
              this.sort(response.data.PostRubixUserData)

              this.updatePricesVarsity(response.data.PostRubixUserData[0].UniversityName)

            }
            })
        }
        postData().then(()=>{
          //Populate Initial Students List
        this.loadStudentsList()
        })
    }

//Get Specific User Data
  updateLeaseData(){
    const data = {
      'UserCode': localStorage.getItem('userCode'),
      'RubixClientID': localStorage.getItem('clientID'),
      'RubixUniversityID': this.state.varsityID,
      'RubixResidenceID': this.state.residenceID,
      "PaymentMethod": this.state.payment,
      'RatesSingleRoom': this.state.singlePrice,
      "RatesSharingRoom": this.state.sharingPrice,
      "Rates3Sharing": this.state.threeSharingPrice,
    };

    const requestOptions = {
      title: 'Update Lease Data',
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: data
    };

    //console.log('Posted student data:', data)

    const postData = async () => {
      await axios.post('http://129.232.144.154:88/api/RubixAdminAddLeaseRefferance', data, requestOptions)
        .then(response => {
        })
    }
    postData()
  }

  //Load Students List
  loadStudentsList(){
    this.props.updateLoadingMessage("Loading Residence Details, Please wait...");
    const data = {
    "UserCode" : localStorage.getItem('userCode'),
    "RubixResidenceID":'1'/* this.state.residenceID */,
    "RubixClientID": '1'/* localStorage.getItem('clientID') */,
    "RubixUniversityID":'2' /* this.state.varsityID */,
    "PaymentMethod": 'NSFAS' /* this.state.payment */,
    "Capacity": 1
    }

    const requestOptions = {
      title: 'Load Student Data',
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: data
    };

    const postData = async () => {
      await axios.post('http://129.232.144.154:88/api/RubixAdminRateUpdateData', data, requestOptions)
        .then(response => {
          this.setState({
            studentList: response.data.PostRubixUserData
          })
        })
    }
    postData().then(() =>{
       //Set Loading Screen OFF
       setTimeout(() => {
        this.props.updateLoadingController(false);
      }, 1000);
    })
  }


//Mass Ammend Lease 
  bulkUpdateLeaseData(){ 
    //Set Loading Screen ON
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Updating ALL leases, Please wait...");
    const data = {
      'UserCode': localStorage.getItem('userCode'),
      'RubixClientID': localStorage.getItem('clientID'),
      'RubixStudentNumber': "Done",
      'RubixRentalPeriodLeaseStartDate': "Done",
      "RubixRentalPeriodLeaseEndDate": "Done",
      'RubixMontlyRentalAmount': "Done",
      "RubixPaymentMethod": "Done",
      "RubixRoomumber": "Done",
    };

    const requestOptions = {
      title: 'Bulk Update Lease Data',
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: data
    };

    const postData = async () => {
      await axios.post('http://129.232.144.154:88/api/RubixAdminAddLeaseBulkUpdate', data, requestOptions)
        .then(response => {
          //console.log("Response for Bulk Updates: ", response)
        })
    }
    postData().then(() => {
      //Set Loading Screen ON
      setTimeout(() => {
        this.props.updateLoadingController(false);
      }, 1000);

    })
  }

  //Sort out information
  sort(list){
      list.forEach(entry => {
          if (entry.UniversityName != null || entry.UniversityName != undefined ){
              //if name is defined then check if already in varsities list
              if(this.state.varsities.includes(entry.UniversityName)){

              }else {
                  //Add to varsity list
                  this.state.varsities.push(entry.UniversityName)
                  this.setState({
                  })
                  //console.log("Added ", entry.UniversityName)
                 
              }

          }
      })
      this.setState({
        varsity: this.state.varsities[0]
    })
    this.loadPaymentMethods(list)
  }

  
  //Load payment methods
  loadPaymentMethods(list){    
    //Set Loading Screen ON
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Loading Payment Methods, Please wait...");
      list.forEach(entry => {
                  //Add to payment method list
                  if (this.state.payMethods.includes(entry.PaymentMethod)){

                } else {
                  this.state.payMethods.push(entry.PaymentMethod)
                  this.setState({
                  })
                }
      })
      this.setState({
        payment: this.state.payMethods[0]
    })
    //console.log("Payment Methods: ", this.state.allData)
    this.changePrices()
  }

  //Change Prices
  changePrices(school, method){
    this.props.updateLoadingMessage("Changing prices, Please wait...");
      let mySchool, myMethod
      if (school != null) {
          mySchool = school
      } else {
          mySchool = this.state.varsity
      }

//Assign Paymenet method
      if (method != null) {
          myMethod = method
      } else {
          myMethod = this.state.payment
      }
      this.state.allData.forEach(entry => {
          if (entry.UniversityName == mySchool && entry.PaymentMethod == myMethod){
              this.setState({
                  singlePrice: entry.RatesSingleRoom,
                  sharingPrice: entry.RatesSharingRoom,
                  threeSharingPrice: entry.Rates3Sharing
              })
              //Set Loading Screen OFF
              this.props.updateLoadingController(false);
          }
      })
  }

  //Update Prices using varsity
  updatePricesVarsity(mySchool){
    this.state.allData.forEach(entry => {
        if (entry.UniversityName == mySchool){
            console.log("I am called with: ", this.state.allData)
            this.setState({
                singlePrice: entry.RatesSingleRoom,
                sharingPrice: entry.RatesSharingRoom,
                threeSharingPrice: entry.Rates3Sharing,
                varsityID: entry.RubixUniversityID,
                residenceID: entry.RubixResidenceID
            })
        }
    })
}
  //Update Prices using Payment Method
  updatePricesPayment(myPaymentMethod){
    this.state.allData.forEach(entry => {
        if (entry.PaymentMethod == myPaymentMethod){
            //console.log("I am called with: ", mySchool)
            this.setState({
                singlePrice: entry.RatesSingleRoom,
                sharingPrice: entry.RatesSharingRoom,
                threeSharingPrice: entry.Rates3Sharing,
                //varsityID: entry.RubixUniversityID,
                //residenceID: entry.RubixResidenceID
            })
        }
    })
}

render() {
        return (
            <div>
                <Helmet>
              <meta charSet="utf-8" />
              <title>Admin Ammending</title>
                </Helmet>
                <div className="container-fluid pt-2">
                <PageHeader
              HeaderText="Lease Information Update"
              Breadcrumb={[{ name: "Lease Ammend" }]}
            />

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
                alt="Rubix System"
              />
            </div>
            <p>{this.props.loadingMessage}</p>
          </div>
        </div>

        <PopUpConfrimUpdateAndRegen>
        </PopUpConfrimUpdateAndRegen>

        <PopUpConfirmLeaseUpdate>
        </PopUpConfirmLeaseUpdate>

        


            <div className="row clearfix">
              <div className="col-lg-12">
                <div className="card">
                    <form className="p-3">
                        <h2>Monthly Rate Changes</h2>
                        <p>Please fill out the information below to ammend the fee rates for : {this.state.resName} Residence</p>
    <div className="form-group">
                <div className="form-line">
                    <label>University</label>
                    {  
        <select className="form-control" onChange={(e)=>{this.setState({varsity: e.target.value}); this.changePrices(e.target.value, null); }} value={this.state.varsity}>
        {
            
            this.state.varsities.map((varsity, index)=> (
            <option key={index} name='Varsity' value={varsity}>{varsity}</option>
        ))   
        }
    </select> }
                </div>
              </div>
    
    <div className="form-group">
                <div className="form-line">
    <label>Payment Method</label>
    {  
        <select className="form-control" onChange={(e)=>{this.setState({payment: e.target.value}); this.changePrices(null, e.target.value)}} value={this.state.payment}>
        {
            
            this.state.payMethods.map((payment, index)=> (
            <option key={index} name='PaymentMethod' value={payment}>{payment}</option>
        ))   
        }
    </select> 
    }
                </div>
              </div>

    <div className="form-group">
                <div className="form-line">
                  <label>Single Room Amount</label>
                  <input
                    required
                    id="SingleAmount"
                    type="number"
                    className="form-control"
                    placeholder={this.state.singlePrice}
                  />
                </div>
              </div>
    <div className="form-group">
                <div className="form-line">
                  <label>2 Sharing Room Amount</label>
                  <input
                    required
                    id="2SharingAmount"
                    type="number"
                    className="form-control"
                    placeholder={this.state.sharingPrice}
                  />
                </div>
              </div>
    <div className="form-group">
                <div className="form-line">
                  <label>3 Sharing Room Amount</label>
                  <input
                    required
                    id="3SharingAmount"
                    type="number"
                    className="form-control"
                    placeholder={this.state.threeSharingPrice}
                  />
                </div>
              </div>
              <button onClick={(e)=>{ this.props.onPresPopUpConfirmLeaseUpdate() }} className="btn btn-primary">Update</button>
              <button onClick={(e)=>{this.props.onPresPopUpConfirmMassLeaseUpdate()}} className="btn btn-warning ml-3 text-white">Update and Regenerate ALL leases</button>
                    </form>
                </div>
                </div>
            </div>

                </div>
            </div>
        )
    }
}

AdminAmmendPage.propTypes = {

};
const mapStateToProps = ({ navigationReducer, loginReducer, mailInboxReducer }) => ({
  MyloadingController: navigationReducer.loadingController,
  loadingMessage: navigationReducer.loadingMessage,
  isPopUpConfirm: mailInboxReducer.isPopUpConfirmLeaseUpdate,
  isPopUpConfirmMass: mailInboxReducer.isPopUpConfirmMassLeaseUpdate,
});

export default connect(mapStateToProps, {
  updateLoadingController,
  updateLoadingMessage,
  onPresPopUpConfirmLeaseUpdate,
  onPresPopUpConfirmMassLeaseUpdate,
})(AdminAmmendPage);