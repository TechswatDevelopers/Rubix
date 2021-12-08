import React from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";

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
            <PageHeader
              HeaderText="My Residense Information"
              Breadcrumb={[
                { name: "Page", navigate: "" },
                { name: "Residence Page", navigate: "" },
              ]}
            />
            <div className="row clearfix">
                          <div className="w-100 p-3">
                            <div className="body">
                              <h6 style={{textAlign:'center'}}>My Residence Information</h6>
                              <ul className="list-unstyled list-login-session w-80 p-3">
                                <li>
                                <h3 className="login-title">
                                {localStorage.getItem('resName')}
                                      </h3>
                                      <li>
                                      <h3 className="login-title">
                                      {localStorage.getItem('resUni')}
                                      </h3>
                                      </li>
                                </li>
                                
                                <li>
                                    <div className="login-info">
                                      <span className="login-detail">
                                        {localStorage.getItem('resAddress')}
                                      </span>
                                      {/*<br></br>
                                       <span className="login-detail">
                                        Building number: {this.state.residence.BuildingNumber}
                                      </span>
                                      <br></br>
                                      <span className="login-detail">
                                        Floor: {this.state.residence.FloorNumber}
                                      </span> 
                                      <br></br>
                                      <span className="login-detail">
                                        Room:{this.state.residence.RoomNumber}
                                      </span> */}
                                    </div>
                                </li>
                                <img
                                  alt="cannot display"
                                  accept='.jpg, .png, .jpeg'
                                  className="user-photo media-object"
                                  src={localStorage.getItem('resPhoto')} />
                               
                                  <li>
                                    <p>{localStorage.getItem('resDescription')}</p>
                                  </li>
                                <li>
                                  <div className="login-session">
                                    <div className="login-info">
                                      <h3 className="login-title">
                                        Residence Amenitis
                                      </h3>
                                      <p>{localStorage.getItem('resAmenities')}</p>
                                    </div>

                                  </div>
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
