import React from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import {onPresPopConfirmReq} from "../../actions"
import axios from "axios";
import storage from "redux-persist/lib/storage";
import PageHeader from "../../components/PageHeader";
import PopUpConfirmReq from "../../components/PopUpRequest"

class RequestReReg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resList: [],
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    
    const fetchData = async() =>{
      
            //Populate Residence list
            await fetch('https://rubixapi.cjstudents.co.za:88/api/RubixResidences/' + localStorage.getItem('clientID'))
        .then(response => response.json())
        .then(data => {
            //console.log("data is ", data)
            this.setState({resList: data.data})
            });
    }
    fetchData()
  }

  //Post to DB
  postRequest(e){
    e.preventDefault()
    const data = {
      'RubixRegisterUserID': localStorage.getItem("userID"),
      'RubixResidenceID': this.state.res,
      'RubixClientID': localStorage.getItem("clientID")
    }
    //console.log("I am called", data)

    const requestOptions = {
      title: "Request Reregister Form",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    }

    const postData = async () => {
      await axios.post("https://rubixapi.cjstudents.co.za:88/api/RubixUpdateRubixResidence", data, requestOptions)
      .then((response) => {
        console.log("This is the response: ", response)
        if(response.data.PostRubixUserData["0"]["Responce"] == 1){
          this.props.onPresPopConfirmReq()
        }
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
          <PopUpConfirmReq></PopUpConfirmReq>
          <div className="container-fluid">
            <div className="row clearfix">
              <div className="col-lg-12 col-md-12">
                <div className="card planned_task mt-5">
                <div className="top">
                  <img src={localStorage.getItem('clientLogo')} alt="" style={{  height: "14%",  width:"14%",  display: "block", display: "block", margin: "auto" }} />
                </div>
                  <div className="header">
                    <h2>Re Activation</h2>
                  </div>
                  <div className="body">
                    <p>It seems that your account has been deactivated, to re activate it please press the button below and we will notify you once your account is active again.</p>
                  
                    <div className="form-group">
                        <label className="control-label sr-only" >
                        Residence:
                            </label>
                            {  
        <select className="form-control" onChange={(e)=>this.setState({res: e.target.value})} value={this.state.res}>
        {
            
            this.state.resList.map((res, index)=> (
            <option key={index} name='ResidenceID' value = {res.RubixResidenceID }>{res.ResidenceName}</option>
        ))   
        }
    </select> }
                      </div>
                  <button className="btn btn-primary" onClick={(e)=>{this.postRequest(e)}}>Request Re Activation</button>
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

const mapStateToProps = ({ ioTReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
});

export default connect(mapStateToProps, {
  onPresPopConfirmReq
})(RequestReReg);
