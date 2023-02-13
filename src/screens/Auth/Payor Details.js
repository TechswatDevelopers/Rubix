import React, { useContext } from "react";
import { connect } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import {Helmet} from "react-helmet";
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import {onPresPopUpEvent,
  updateClientBackG,
  updateLoadingMessage,
  updateLoadingController} from "../../actions";
import PopUpModal from "../../components/PopUpModal";
import { Tabs, Tab, Row, Col } from "react-bootstrap";

class PayorDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        userGender: 'Male',
        errorMessage: '',
        location: null,
        myUserID: null,
        userIPAddress: null,
        dateAndTime: null,
        isLoad: false,
        showSearch: false,
        //consent: false,
        funding: null,
        fundingSources: ["Please select funding source"],
        payMethods: ["Please select payment method"],
        bankTypes: ['Please select account type', 'Savings', 'Cheque'],
        payment: null,
        consent: '0',
        MarketingConsent: '0',
        value: 0

    };
  }
 Validate() {
    
  var idNumber = document.getElementById("IDNumber").value;

  // store the error div, to save typing
  var error = document.getElementById('error');

  // assume everything is correct and if it later turns out not to be, just set this to false
  var correct = true;

  //Ref: http://www.sadev.co.za/content/what-south-african-id-number-made
  // SA ID Number have to be 13 digits, so check the length
  if (idNumber.length != 13 ) {
      //error.append('ID number does not appear to be authentic - input not a valid number.');
      correct = false;
  }

  //Extract first 6 digits
  var year = idNumber.substring(0, 2);
  var month = idNumber.substring(2, 4);
  var day = idNumber.substring(4, 6);
  //////console.log(year, month, day)

  // get first 6 digits as a valid date
  var tempDate = new Date(year, month - 1, day);

  var id_date = tempDate.getDate();
  var id_month = tempDate.getMonth();
  var id_year = tempDate.getFullYear();
  var right_month = id_month + 1;
  //////console.log(id_date, id_month, id_year)

  var fullDate = id_date + "-" + right_month + "-" + id_year;

  if (!((tempDate.getYear() == idNumber.substring(0, 2)) && (id_month == idNumber.substring(2, 4) - 1) && (id_date == idNumber.substring(4, 6)))) {
      //error.append('ID number does not appear to be authentic - date part not valid. ');
      correct = false;
  }

  // get the gender
  var genderCode = idNumber.substring(6, 10);
  var gender = parseInt(genderCode) < 5000 ? "Female" : "Male";
  this.setState({userGender: gender})
  //setGender(gender)

  // get country ID for citzenship
  var citzenship = parseInt(idNumber.substring(10, 11)) == 0 ? "Yes" : "No";

  // apply Luhn formula for check-digits
  var tempTotal = 0;
  var checkSum = 0;
  var multiplier = 1;
  for (var i = 0; i < 13; ++i) {
      tempTotal = parseInt(idNumber.charAt(i)) * multiplier;
      if (tempTotal > 9) {
          tempTotal = parseInt(tempTotal.toString().charAt(0)) + parseInt(tempTotal.toString().charAt(1));
      }
      checkSum = checkSum + tempTotal;
      multiplier = (multiplier % 2 == 0) ? 1 : 2;
  }
  if ((checkSum % 10) != 0) {
      //error.append('ID number does not appear to be authentic - check digit is not valid');
      correct = false;
  }
  if (correct) {
      // and put together a result message
      //document.getElementById('result').append('<p>South African ID Number:   ' + idNumber + '</p><p>Birth Date:   ' + fullDate + '</p><p>Gender:  ' + gender + '</p><p>SA Citizen:  ' + citzenship + '</p>');
   } else {
    alert("Invalid ID Number, please correct ID Number and try again")
    this.setState({errorMessage: "Invalid ID Number, please enter a valid ID Number"})
  }
  return correct
}

//final submit check
 Submit(e){
   //Set timer for loading screen
  this.setState({
    isLoad: true
  })
  e.preventDefault();

  const form = document.getElementById('nof');
  var idNumber = document.getElementById("IDNumber").value;
  var nextofKinEmail = document.getElementById("PayorEmail").value;
  const studentID =  localStorage.getItem('studentIDNo')
  const studentEmail =  localStorage.getItem('email')

  if(this.state.location !=null){
    const locations = document.getElementById('location');
    const postCode = document.getElementById('post-code').value;
    const street_address = this.state.location['value']['structured_formatting']['main_text'] + ', ' + postCode
  
  const data = {
      'RubixRegisterUserID': this.state.myUserID,
      'PayorAdrress': street_address,
      'ClientID': 1,
      'PaymentMethod': this.state.payment,
      'FundingSource': this.state.funding,
      'PayorConcent': this.state.consent,
      'PayorMarketingConcent': this.state.MarketingConsent,
      'PayorAccountHolderName': '',
      'PayorBankName': '',
      'PayorBranchCode': '',
      'PayorAccountNumber': '',
      'PayorRef': '',
      'PayorBranchName': '',
  };

  for (let i=0; i < form.elements.length; i++) {
      const elem = form.elements[i];
      data[elem.name] = elem.value
  }

  const requestOptions = {
      title: 'Payor Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
  };
  
  //////console.log("I am empty",data)
  const postData = async() => {
      if ( idNumber != studentID && studentEmail != nextofKinEmail){
          await axios.post('https://adowarest.rubix.mobi:88/api/RubixRegisterUserPaymentDetails', data, requestOptions)
          .then(response => {
              //////console.log(response)
              if(response.data[0]['ResponceMessage'] == "Successfully Update Record"){
                this.props.onPresPopUpEvent()
                this.props.history.push("/nextofkin")
              }
              this.setState({
                isLoad: false
              })
          })
              
      } else{
        alert("Next of kin ID Number/Email cannot be the same as student Id Number/Email")
        this.setState({
          isLoad: false
        })
      }
  }
  postData().then(() => {
    //this.props.onPresPopUpEvent()
    //this.props.history.push("/login/" + localStorage.getItem('clientID'))
  })
} else if(document.getElementById('streetAddress') != null)  {
  
  const data = {
    'RubixRegisterUserID': this.state.myUserID,
    'PayorAdrress': document.getElementById('streetAddress').value,
    'ClientID': 1,
    'PaymentMethod': this.state.payment,
    'FundingSource': this.state.funding,
    'PayorConcent': this.state.consent,
    'PayorMarketingConcent': this.state.MarketingConsent,
    'PayorAccountHolderName': '',
    'PayorBankName': '',
    'PayorBranchCode': '',
    'PayorAccountNumber': '',
    'PayorRef': '',
    'PayorBranchName': '',
};
for (let i=0; i < form.elements.length; i++) {
    const elem = form.elements[i];
    data[elem.name] = elem.value
}

const requestOptions = {
    title: 'Payor Details Form',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data
};
//console.log("called", data)
const postData = async() => {
  await axios.post('https://adowarest.rubix.mobi:88/api/RubixRegisterUserPaymentDetails', data, requestOptions)
  .then(response => {
      ////console.log("2nd Response: ", response)
        setTimeout(() => {
          this.props.updateLoadingController(false);
        }, 1000);
        this.props.onPresPopUpEvent()
       this.props.history.push("/nextofkin")
  })

}
/* postData().then(() => {

}) */
}

else{
  alert("Please a valid home address")
  this.setState({
    isLoad: false
  })
}
}

  //Posting Update status
  postStatus() {
    //Set Loading Screen ON
 this.props.updateLoadingController(true);
 this.props.updateLoadingMessage("Adding Status...");
    const data = {
      'Status': 'Email Verify',
      'RubixRegisterUserID': this.state.myUserID,
    };
    const requestOptions = {
      title: 'Verify Status Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    };
    ////console.log('User data:', data)
    const postData = async () => {
      await axios.post('https://adowarest.rubix.mobi:88/RubixUpdateStatus', data, requestOptions)
        .then(response => {
          if(response != null || response != undefined){
      //Set timer for loading screen
    setTimeout(() => {
      this.setState({
        isLoad: false
      });
    }, 1000);
          }
          //////console.log("Verify email status", response)
          this.props.history.push("/relatives")
        })
    }
    postData()
  }

  getResAndPayment(resID, uni){
    //////console.log("this: ", resID)
    this.setState({
      isLoad: true
    })
    const data = {
      'RubixUniversityID': uni,
      'RubixResidenceID': resID
    };
    const requestOptions = {
      title: 'Get Payment Details Form',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
  };
  //////console.log("My Data: ", data)
    const getData = async() => {
      await axios.post('https://adowarest.rubix.mobi:88/api/RubixPaymentMethodDD', data, requestOptions)
      .then(response => {
        //console.log("My response for P.Methods: ", response.data.PostRubixUserData)

        this.setState({
          isLoad: false,
          payMethods: response.data.PostRubixUserData
        })
    })
    }
    getData()
  }

  ///Set funding source
  setFundingSource(value){
    if(value == 'Cash Student'){
      this.setState({
        fundingSources: ["Please select funding source", "Private", "Bursary / Scholarship"]
      })

    } else if(value == 'NSFAS') {
      this.setState({
        fundingSources: ["Please select funding source", "NSFAS"]
      })
    } else if(value == "Bursary / Scholarship") {
      this.setState({
        fundingSources: ["Please select funding source", "Bursary / Scholarship"]
      })
    }
  }

  componentDidMount(){
    document.body.classList.remove("theme-cyan");
    document.body.classList.remove("theme-purple");
    document.body.classList.remove("theme-blue");
    document.body.classList.remove("theme-green");
    document.body.classList.remove("theme-orange");
    document.body.classList.remove("theme-blush");
    const userID = localStorage.getItem('userID');
    this.props.updateClientBackG(localStorage.getItem('clientBG'))
    this.setState({myUserID: userID});
    const DATE_OPTIONS = { year: 'numeric', month: 'long', day: 'numeric', time: 'long' };
    const myDate = new Date().toLocaleDateString('en-ZA', DATE_OPTIONS)
    const myTime = new Date().toLocaleTimeString('en-ZA')
    this.setState({ dateAndTime: myDate + myTime })
    this.getResAndPayment(1, "1")

    //localStorage.setItem('userID', "1")

    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Loading Details...");

    setTimeout(() => {
      this.props.updateLoadingController(false);
    }, 2000)

  }

  setLoadingPage(time) {
    this.setState({ isLoad: true, })
    setTimeout(() => {
      this.setState({
        isLoad: false,
      })
    }, time);
  }

  //Show Search
  showSearch(e){
    e.preventDefault() 
    this.setState({showSearch: !this.state.showSearch})
  }

  //Change Credit Check Consent
  changeConsent(e){
    //////console.log("My consent: ", e.target.value)
    if (e.target.value == 'on'){
      this.setState({
        consent: "1"
      })
    } else {
      this.setState({
        consent: "0"
      })
    }
  }

  //Change Marketing Consent
  changeMarketingConsent(e){
    //////console.log("My consent: ", e.target.value)
    if (e.target.value == 'on'){
      this.setState({
        MarketingConsent: "1"
      })
    } else {
      this.setState({
        MarketingConsent: "0"
      })
    }
  }

  render() { 
    let body;
    if(this.state.payment == 'BankDeposit' || this.state.payment == 'NSFAS' || this.state.payment == 'Student Loan'){
      body = 
      null
    } else if(this.state.payment == 'EFT'){
      body = <>
      <div className="form-group">
                        <label className="control-label sr-only" >
                        Account Holder Name:
                            </label>
                            <input
                          className="form-control"
                          id="PayorAccountHolderName"
                          name='PayorAccountHolderName'
                          placeholder="Enter your bank account holder name"
                          type="text"
                          required
                        />
                      </div>

                            <div className="form-group">
                        <label className="control-label sr-only" >
                        Bank Name:
                            </label>
                            <input
                          className="form-control"
                          id="PayorBankName"
                          name='PayorBankName'
                          placeholder="Enter your bank name"
                          type="text"
                          required
                        />
                      </div>
                      
                            <div className="form-group">
                        <label className="control-label sr-only" >
                        Branch Name:
                            </label>
                            <input
                          className="form-control"
                          id="PayorBranchName"
                          name='PayorBranchName'
                          placeholder="Enter the branch name"
                          type="text"
                          required
                        />
                      </div>

                            <div className="form-group">
                        <label className="control-label sr-only" >
                        Branch Code:
                            </label>
                            <input
                          className="form-control"
                          id="PayorBranchCode"
                          name='PayorBranchCode'
                          placeholder="Enter your branch code"
                          type="text"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="control-label sr-only" >
                        Account Number:
                            </label>
                            <input
                          className="form-control"
                          id="PayorAccountNumber"
                          name='PayorAccountNumber'
                          placeholder="Enter your account number"
                          type="text"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="control-label sr-only" >
                        Payor Reff
                            </label>
                            <input
                          className="form-control"
                          id="PayorRef"
                          name='PayorRef'
                          placeholder="Enter your Payment Refference"
                          type="text"
                          required
                        />
                      </div>

                      
                     {/*  <div className="form-group">
                        <label className="control-label sr-only" >
                        Account Type:
                            </label>
                            {  
        <select className="form-control" onChange={(e)=>this.setState({bankType: e.target.value})} value={this.state.bankType}>
        {
         this.state.bankTypes.map((banktype, index)=> (
            <option key={index} name='AccountType' value = {banktype}>{banktype}</option>
        ))  
        }
        </select> }
                      </div> */}

      </>
    } else {
      body = null;
    }
    return (
      <div className="theme-grey">
      <Helmet>
            <meta charSet="utf-8" />
            <title>Payment Details</title>
        </Helmet>
        <div
          className="page-loader-wrapper"
          style={{ display: this.props.MyloadingController ? "block" : "none" }}
        >
          <div className="loader">
            <div className="m-t-30">
              <img
                src={localStorage.getItem('clientLogo')}
                width="10%"
                height="10%"
                alt=" "
              />
            </div>
            <p>{this.props.loadingMessage}</p>
          </div>
        </div>
        
        <PopUpModal 
        Title= "Registration Complete!"
        Body = "Thank you for registering with Us. We have sent you an email to verify your account, please check your emails."
        Function ={()=>this.props.history.push("/login/" + localStorage.getItem('clientID'))}
        />

        <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
          <div className="loader">
            <div className="m-t-30"><img src={localStorage.getItem('clientLogo')} width="170" height="70" alt="Lucid" /></div>
            <p>Processing informaion please wait...</p>
          </div>
        </div>
        <div >
          <div className="vertical-align-wrap">
            <div className="vertical-align-middle auth-main"
            style={{
                backgroundImage: "url(" + this.props.clientBG + ")",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                width: "100% !important",
                height: "100% !important",
              }}
            >
              <div className="auth-box">
                <div className="card">
                <div className="top">
                  <img src={localStorage.getItem('clientLogo')} alt="" style={{ height: "40%",  width:"44%",  display: "block", margin: "auto" }} />
                </div>
                  <div className="header">
                    <h1 className="lead"><strong>Payor Details</strong></h1>
                    <p className="text-secondary">Please fill in the following informaion regarding the person/organisation responsoble for rent payment.</p>
                  </div>
                  <div className="body">
                    <form id='nof' onSubmit={(e) => this.Submit(e)}>
                    <div className="form-group">
                        <label className="control-label" >
                        Payment Method
                            </label>
                            {  
        <select className="form-control" onChange={(e)=>{
          //this.onChangeDurationViaPayment(e)
          this.setFundingSource(e.target.value)
          this.setState({payment: e.target.value})}} value={this.state.payment}>
        {
            this.state.payMethods.map((payment, index)=> (
            <option key={index} name='PaymentMethod' value={payment.PaymentMethod}>{payment.PaymentMethod}</option>
        ))   
        }
    </select> }
                      </div>
                      {body}
                    <div className="form-group">
                        <label className="control-label" >
                        Funding Source
                            </label>
                            {  
        <select 
        className="form-control" 
        onChange={(e)=>{this.setState({funding: e.target.value})}} 
        value={this.state.funding}>
        {
         this.state.fundingSources.map((source, index)=> (
            <option key={index} name='FundingSource' value = {source}>{source}</option>
        ))  
        }
        </select> }
        </div>
                      <div className="form-group">
                        <label className="control-label" >
                        Full Name(s)
                            </label>
                        <input
                          className="form-control"
                          id="NextOfKinFirstName"
                          name='PayorFullName'
                          placeholder="Enter Payor's Full Name"
                          type="text"
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label className="control-label" >
                        ID/Reg. Number
                            </label>
                            <input type='number' name="PayorID" className='form-control' id='IDNumber' 
                    required='' /* maxLength = '13' minLength='13' */ placeholder='Enter ID/Reg Number'></input>
                    <p id="error" style={{color: 'red'}}>{this.state.errorMessage}</p>
                      </div>

                      <div className="form-group">
                        <label className="control-label" >
                        Vat Number
                            </label>
                        <input
                          className="form-control"
                          id="PayorVat"
                          name='PayorVat'
                          placeholder="Enter VAT number (optional)"
                          type="number"
                        />
                      </div>

                      <div className="form-group">
                        <label className="control-label" >
                        Email
                            </label>
                        <input
                          className="form-control"
                          id="PayorEmail"
                          name='PayorEmail'
                          placeholder="Enter Payor Email"
                          type="email"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="control-label" >
                        Home Phone Number
                            </label>
                            <PhoneInput placeholder="Home Phone Number" name="PayorHomeTell" className='PayorHomeTell' required='' 
                    value={this.state.value}
                    onChange={()=> this.setState({value: this.state.value})}/>
                      </div>
                      <div className="form-group">
                        <label className="control-label" >
                        Cellphone Number
                            </label>
                            <PhoneInput placeholder="Cellphone Number" name="PayorCellPhone" className='PayorCellPhone' required='' 
                    value={this.state.value}
                    onChange={()=> this.setState({value: this.state.value})}/>
                      </div>

                      <div className="form-group">
                        <label className="control-label" >
                          Home Address
                            </label>
                         {
                              !this.state.showSearch
                              ? <input
                              className="form-control"
                              name= "PayorAdrress"
                              id= "streetAddress"
                              placeholder="Enter Address"
                              type="text"
                            />
                              :<GooglePlacesAutocomplete
apiKey="AIzaSyBoqU4KAy_r-4XWOvOiqj0o_EiuxLd9rdA" id='location' onChange = {(e)=>this.setState({location: e.target.value})}
selectProps={{
location: this.state.location,
onChange: (e)=>this.setState({location: e}),
placeholder: "Search Address"
}}
/>}
<button className="btn btn-primary btn-sm m-2" onClick={(e)=>this.showSearch(e)}><i className={this.state.showSearch ?"icon-note pr-2" :"icon-magnifier pr-2"}/>
{
                      this.state.showSearch 
                      ?'Type Address'
                      
                    : 'Search Address'}</button>
                            
<br/>
<div className="form-group">
                        <label className="control-label" >
                        Postal Code
                            </label>
                        <input
                          className="form-control"
                          name="PayorPostalCode"
                          id="post-code"
                          placeholder="Enter your post code"
                          type="text"
                          required/>
                      </div>
                      <div className="form-group">
                        <label className="control-label" >
                        Work Number
                            </label>
                            <PhoneInput placeholder="Work number" name="Payorworktel" className='Payorworktel' required='' 
                    value={this.state.value}
                    onChange={()=> this.setState({value: this.state.value})}/>
                      </div>
                      </div>
                      <div className="form-group">
                        <input
                        className="form-check"
                        id="Concent"
                        //name='Concent'
                        onChange={(e)=>{this.changeConsent(e)}}
                        //placeholder="Enter Next of kin relation to you"
                        type="checkbox"
                        required
                      />
                      <p>I consent to a credit check.</p> 
                    </div>
                      <div className="form-group">
                        <input
                        className="form-check"
                        id="Concent"
                        //name='Concent'
                        onChange={(e)=>{this.changeMarketingConsent(e)}}
                        //placeholder="Enter Next of kin relation to you"
                        type="checkbox"
                        required
                      />
                      <p>I consent to receiving marketing content from Adowa Living.</p> 
                    </div>
                      <button className="btn btn-primary btn-lg btn-block" onClick={(e) => this.Submit(e)}>
                        Next
                        </button>
                    </form>
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

PayorDetails.propTypes = {
};

const mapStateToProps = ({ navigationReducer,  loginReducer, mailInboxReducer }) => ({
  rubixStudentIDNo: navigationReducer.studentIDNo,
  rubixUserID: navigationReducer.userID,
  email: loginReducer.email,
  password: loginReducer.password,
  isPopUpModal: mailInboxReducer.isPopUpModal,
    
  clientBG: navigationReducer.backImage,

  MyloadingController: navigationReducer.loadingController,
  loadingMessage: navigationReducer.loadingMessage,
});

export default connect(mapStateToProps, {
  onPresPopUpEvent,
  updateClientBackG,
  updateLoadingMessage,
  updateLoadingController
})(PayorDetails);
