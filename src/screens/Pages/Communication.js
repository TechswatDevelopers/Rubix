import React from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";

class Communication extends React.Component {
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
              HeaderText="Communications"
              Breadcrumb={[
                { name: "Communications", navigate: "" },
              ]}
            />
            <div className="">
                <div className="card planned_task">
                  {/* <div className="header">
                    <h2>Respond.io Platform</h2>
                  </div> */}
                  <div className="body" >
                    <iframe src='https://app.respond.io/user/login' style={{
                    width: '100%',
                    height: '550px'
                  }}></iframe>
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

export default connect(mapStateToProps, {})(Communication);
