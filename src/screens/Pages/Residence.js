import React from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import ReactEcharts from "echarts-for-react";
import "echarts-gl";
import echarts from "echarts";
import axios from "axios";
import {
  topProductOption,
  topRevenueOption,
  topRevenueMonthlyOption,
  saleGaugeOption,
  dataManagetOption,
  sparkleCardData,
} from "../../Data/DashbordData";

class Residence extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      resDetails: {},
      resDetailTag: '',
      resCapacity: 0,
    }
  }
  componentDidMount() {
    window.scrollTo(0, 0);

    const pingData = {
      'RubixRegisterUserID': localStorage.getItem('userID'),
  };
    //Ping Request Headers
    const requestOptions = {
      title: 'Get residence Details',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: pingData
  };

    const postData = async()=>{
      //Ping email address
      await axios.post('https://rubixapidev.cjstudents.co.za:88/api/RubixStudentResDetails', pingData, requestOptions)
          .then(response => {
              console.log("Student Res Details", response.data.PostRubixUserData[0])
              this.setState({
                resDetails: response.data.PostRubixUserData[0],
                resDetailTag: "Total Capacity",
                resCapacity: response.data.PostRubixUserData[0].Capacity
              })
             /*  if(response.data.EmailResult){
                this.props.updateEmail(email);
                this.props.updatePlatformID("1");
               this.props.history.push("/logInformation")
               } else{
             console.log('Email validation failed')
             alert('Invalid email, please enter a valid email address')
               } */
          })
        }
        postData()
  }

  //Function for changing res capacity
  toggleCapacity(e, keyString) {
    e.preventDefault();
    switch(keyString){
      case 'total':
        {
          this.setState({resDetailTag: "Total Capacity"})
          this.setState({resCapacity: this.state.resDetails.Capacity})
        }
        break
      case 'occupied':
        {
          this.setState({resDetailTag: "Currently Occupied"})
          this.setState({resCapacity: this.state.resDetails.Occupied})
        }
        break
      case 'available':
        {
          this.setState({resDetailTag: "Currently Available"})
          this.setState({resCapacity: this.state.resDetails.Capacity - this.state.resDetails.Occupied})
        }
    }
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
            {/* <PageHeader
              HeaderText="My Residense Information"
              Breadcrumb={[
                { name: "Page", navigate: "" },
                { name: "Residence Page", navigate: "" },
              ]}
            /> */}
            <div className="row clearfix">
              <div className="w-100 p-3">
                <div className="body w-100 p-3">

                  <div>
                  <div className="has-bg-img w-100 p-3" id="top-div"
                    style={{
                      backgroundImage: 'url(' + this.state.resDetails.ResidencePhoto + ')',
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                      height: '250px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignContent: 'center'
                    }} >
                    <h3 className=""
                      style={{
                        color: "white",
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignContent: 'center'
                      }}
                    >
                      {this.state.resDetails.ResidenceName}
                    </h3>
                    <span className=""
                      style={{
                        color: "white",
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignContent: 'center'
                      }}>
                      {this.state.resDetails.ResidenceLocation}
                    </span>

                  </div>

                  <div className="login-info shadow-sm p-3 mb-5 bg-white rounded">
                        <h3
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignContent: 'center'
                          }}
                        >About Us</h3>
                        <p>{this.state.resDetails.ResidenceDescription}</p>
                      </div>
                  </div>


                  <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="header">
                    <h2>{this.state.resDetailTag}</h2>
                    <Dropdown as="ul" className="header-dropdown">
                      <Dropdown.Toggle
                        variant="success"
                        as="li"
                        id="dropdown-basic"
                      >
                        <Dropdown.Menu
                          as="ul"
                          className="dropdown-menu dropdown-menu-right"
                        >
                          <li>
                            <a
                            href="#!"
                            onClick={(e)=> this.toggleCapacity(e, 'total')}
                            >Total Capacity</a>
                          </li>

                          <li>
                            <a
                            href="#!"
                            onClick={(e)=> this.toggleCapacity(e, 'occupied')}
                            >Currently Occupied</a>
                          </li>

                          <li>
                            <a
                            href="#!"
                            onClick={(e)=> this.toggleCapacity(e, 'available')}
                            >Currently Available</a>
                          </li>
                        </Dropdown.Menu>
                      </Dropdown.Toggle>
                    </Dropdown>
                  </div>
                  <div className="body text-center"
                  style={{
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    alignContent: 'center'
                  }}
                  >
                    <div className="rounded-circle margin-0"
                    style={{
                      width: "120px",
                      height: "120px",
                      backgroundColor: "purple",
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      alignContent: 'center'
                    }}
                    >
                    <h4 className="margin-0" 
                    style={{
                      color: "white",
                      fontSize: "50px",
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      alignContent: 'center'
                    }}
                    >{this.state.resCapacity}</h4>
                    </div>
                    
                    <h4 className="margin-0">Beds</h4>
                    <div
                      id="topsaleDonut"
                      style={{ height: 125, width: "100%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="login-session col-lg-3 ">
                        <div className="login-info">
                          <h3 >
                            Residence Amenitis
                          </h3>
                          <p>{localStorage.getItem('resAmenities')}</p>
                        </div>

                      </div>


                  <ul className="list-unstyled list-login-session w-80 p-3">

                    <li>
                      
                    </li>

                  </ul>
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

export default connect(mapStateToProps, {})(Residence);
