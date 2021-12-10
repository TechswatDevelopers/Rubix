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
                  <ul className="list-unstyled list-login-session w-80 p-3">

                    <li>
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
                    </li>

                    <li>
                      <div className="login-session">
                        <div className="login-info">
                          <h3 >
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
