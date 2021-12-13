import React from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import ReactEcharts from "echarts-for-react";
import "echarts-gl";
import echarts from "echarts";
import {
  topProductOption,
  topRevenueOption,
  topRevenueMonthlyOption,
  saleGaugeOption,
  dataManagetOption,
  sparkleCardData,
} from "../../Data/DashbordData";

class Residence extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
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
                      backgroundImage: 'url(' + localStorage.getItem('resPhoto') + ')',
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
                      {localStorage.getItem('resName')}
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
                      {localStorage.getItem('resAddress')}
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
                        <p>{localStorage.getItem('resDescription')}</p>
                      </div>
                  </div>


                  <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="header">
                    <h2>Residence Capacity</h2>
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
                            <a>Action</a>
                          </li>
                          <li>
                            <a>Another Action</a>
                          </li>
                          <li>
                            <a>Something else</a>
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
                    >600</h4>
                    </div>
                    
                    <h4 className="margin-0">Students</h4>
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
