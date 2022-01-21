import React from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import navigationReducer from "../../reducers/navigationReducer";
import axios from "axios";

class AdminDashboard extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    
    setTimeout(() => {
      this.getReport()
    }, 3000);
  }

    //Get Admin Report
    getReport() {
    
      const data = {
        'UserCode':  localStorage.getItem('userCode'),
        'RubixClientID': localStorage.getItem('clientID'),
        'RubixResidenceID': this.props.resID,
      }
      
      const requestOptions = {
        title: 'Sending Vetted Status Form',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data
      };
  
      console.log("Posted:", data)
      const postData = async () => {
        await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixAdminRemoveRubixUserResidencesRoom', data, requestOptions)
        .then(response=>{
          console.log("DB response: ", response)
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
          <div className="container-fluid">
            <PageHeader
              HeaderText="Admin Dashboard"
              Breadcrumb={[
                { name: "Page", navigate: "" },
              ]}
            />
            <div className="row clearfix">
              <div className="col-lg-12 col-md-12">
                <div className="card planned_task">
                  <div className="header">
                    <h2>Admin Dashboard</h2>
                    
                  </div>
                  <div className="body">

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

const mapStateToProps = ({ ioTReducer, navigationReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
  resID: navigationReducer.studentResID
});

export default connect(mapStateToProps, {})(AdminDashboard);
