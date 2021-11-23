import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { Tabs, Tab, Row, Col } from "react-bootstrap";
import ProfileV1Setting from "../../components/Pages/ProfileV1Setting";
import ResidenceInformation from "../../components/Pages/ResInformation";
import DocumentManager from "../../components/Pages/documentsSetting";
import axios from "axios";
import FileFolderCard from "../../components/FileManager/FileFolderCard";
import FileStorageCard from "../../components/FileManager/FileStorageCard";
import FileStorageStatusCard from "../../components/FileManager/FileStorageStatusCard";
import SignatureCanvas from 'react-signature-canvas'
import {
  fileFolderCardData,
  fileStorageStatusCardData,
  areaChartFileReport,
} from "../../Data/FileManagerData";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

class ProfileV1Page extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      residence: {},
      numPages: null,
      pageNumber: 1,
      imgUpload: null,
      selectedFile: null,
      keyString: 'id-document',
      myUserID: null,
      doc: {},
      docs: [],
      tempDoc: {},
      isSelected: false,
      base64Pdf: null,
      docUrl: '',
      trimmedDataURL: null,
    }
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    const userID = localStorage.getItem('userID');
    this.setState({ myUserID: userID });
    this.postSignature('https://www.drupal.org/files/issues/test-transparent-background.png')

    //Generate base64 for dummy image
    //this.getBase64FromSTorage('sign.png') 

    const fetchData = async () => {
      //Get documents from DB
      await fetch('https://rubixdocuments.cjstudents.co.za/feed/post/' + userID)
        .then(response => response.json())
        .then(data => {
          console.log("calleed")
          console.log("documents data:", data)
          this.setState({ doc: data.post[0]})
          this.setState({ docs: data.post })
        });

      //Get Rubix User Residence Details
      await fetch('https://rubixapi.cjstudents.co.za:88/api/RubixStudentResDetails/' + userID)
        .then(response => response.json())
        .then(data => {
          console.log("Residence Data:", data)
          this.setState({ residence: data })
        });


    };
    fetchData()
  }
  //Page navigation functions
  goToPrevPage = () =>
    this.setState(state => ({ pageNumber: state.pageNumber - 1 }));
  goToNextPage = () =>
    this.setState(state => ({ pageNumber: state.pageNumber + 1 }));

  //Switch to different Document
  changeDocument = (file) => {
    const temp = this.state.docs.filter(doc => doc.FileType == file)
    this.setState({isSelected: false})
    this.setState({ selectedFile: null })
    //console.log("file type", file)
    //console.log("temp object", temp)
    this.setState({ keyString: file })
    //console.log("current file type", this.state.keyString)
    if (temp.length != 0) {
      this.setState({ doc: temp[0] })
    } else {
      this.setState({ doc: null })
    }
    //this.setState(state => ({ document: {file: file}}));
  }

  //convert to base64
  getBase64(e) {
    var file = e.target.files[0]
    //console.log('My document before base64', e.target.files[0])
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      this.setState({
        base64Pdf: reader.result
      })
      //console.log("This is the img:", this.state.imgUpload)
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    }
  }

  //Post File Using Mongo
  onPressUpload() {
    //var file = e.target.files[0]
    //console.log("selected file is:", file)
    //this.setState({selectedFile: file})
    const postDocument = async () => {
      const data = new FormData()
      data.append('image', this.state.selectedFile)
      data.append('FileType', this.state.keyString,)
      data.append('RubixRegisterUserID', this.state.myUserID)
      const requestOptions = {
        title: 'Student Document Upload',
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data', },
        body: data
      };
      for (var pair of data.entries()) {
        console.log(pair[0], ', ', pair[1]);
      }
      await axios.post('https://rubixdocuments.cjstudents.co.za/feed/post?image', data, requestOptions)
        .then(response => {
          console.log("Upload details:", response)
          this.setState({ mongoID: response.data.post._id })
        })
    }
    postDocument()
  }
  onPressCancel() {
    this.setState({ selectedFile: null })
    this.setState({ isSelected: false })
  }
  changeHandler(event) {
    this.setState({selectedFile: event.target.files[0] })
    console.log("selcted file1", event.target.files[0])
    this.setState({isSelected: true })
    this.getBase64(event)
  }
  handleUpdate(e) {
    const inputFile = document.getElementById('upload-button')
    inputFile.click()
  }
  //Signature Pad array of lines
  sigPad = {}
  //Function for clearing signature pad
  clear = () => {
    this.sigPad.clear()
  }
  //Function for triming Signature Pad array and save as one png file
  trim = () => {
    if (this.sigPad.getTrimmedCanvas().toDataURL('image/png') != null) {
      this.setState({ trimmedDataURL: this.sigPad.getTrimmedCanvas().toDataURL('image/png') })
      this.postSignature(this.state.trimmedDataURL)
    } else {
      alert("Please provide a signature")
    }
  }
  //Function to post signature to API
  postSignature(signature) {
    console.log('I am called ')
    const postDocument = async () => {
      const data = {
        'RubixRegisterUserID': this.state.myUserID,
        'ClientId': 1,
        'image': signature
      }
      const requestOptions = {
        title: 'Student Signature Upload',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: data
      };
      await axios.post('https://rubixpdf.cjstudents.co.za/PDFSignature', data, requestOptions)
        .then(response => {
          console.log("Signature upload details:", response)
          this.setState({ docUrl: response.data.Base })
        })
    }
    postDocument()
  }

  render() {
    let myBody;
    if (!this.state.isSelected) {
      myBody = <> {this.state.doc != null 
        ? <>
        <input style={{ display: 'none' }} id='upload-button' type="file" onChange={(e) => this.changeHandler(e)} />
        <button className="btn btn-primary" variant="contained" color="primary" component="span" onClick={(e) => this.handleUpdate(e)}>Upload A New File</button>
          <Document className="border border-primary border-2"
            file={{ url: "data:application/pdf;base64," + this.state.doc.image }}
            onLoadSuccess={this.onDocumentLoadSuccess}
          >
            <Page pageNumber={this.state.pageNumber} />
          </Document>
  
          <nav>
            <button className="btn btn-signin-social" onClick={this.goToPrevPage}>Prev</button>{" "}
            &nbsp;&nbsp;
            <button className="btn btn-signin-social" onClick={this.goToNextPage}>Next</button>
          </nav>
        </>
        
        :<>
        <div></div>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
          <p style={{ textAlign: 'center'}} className="lead">Oops, it seems that you have not uploaded a document yet, to enable viewer, please upload a document.</p>
          <div>
            <input style={{ display: 'none' }} id='upload-button' type="file" onChange={(e) => { this.changeHandler(e) }} />
            <button className="btn btn-primary" variant="contained" color="primary" component="span" onClick={(e) => this.handleUpdate(e)}>Upload A File</button>
          </div>
        </div>
      </>
    }
    </>
        
    } else {
      myBody = <>
      <button className="btn btn-primary" onClick={() => this.onPressUpload()}>Confirm Upload</button>{" "}
      &nbsp;&nbsp;
      <button className="btn btn-default" type="button" onClick={() => this.onPressCancel()}>
        Cancel
      </button>
      <Document className="border border-primary border-2"
        file={{ url: this.state.base64Pdf }}
        onLoadSuccess={this.onDocumentLoadSuccess}
      >
        <Page pageNumber={this.state.pageNumber} />
      </Document>

      <div style={{ margin: 'auto', display: 'inline-block' }}>
        <nav>
          <button className="btn btn-signin-social" onClick={this.goToPrevPage}>Prev</button>{" "}
          &nbsp;&nbsp;
          <button className="btn btn-signin-social" onClick={this.goToNextPage}>Next</button>
        </nav>
      </div>
    </>
    }
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
              HeaderText="Rubix User Profile"
              Breadcrumb={[
                { name: "Page", navigate: "" },
                { name: "My Profile", navigate: "" },
              ]}
            />
            <div
              className="progress-bar progress-bar-warning"
              data-transitiongoal={`44`}
              aria-valuenow={`44`}
              style={{ width: `44%` }}
            >
              Profile is 44% complete
            </div>
            <div className="row clearfix">
              <div className="col-lg-12">
                <div className="card">
                  <div className="body">
                    <Tabs
                      defaultActiveKey="settings"
                      id="uncontrolled-tab-example"
                    >
                      <Tab eventKey="settings" title="Personal Information">
                        <ProfileV1Setting />
                      </Tab>
                      <Tab eventKey="Billing" title="Billing">
                        <div className="tab-pane active show" id="billings">
                          <div className="body">
                            <h6>Payment Method</h6>
                            <div className="payment-info">
                              <h3 className="payment-name">
                                <i className="fa fa-paypal"></i> PayPal ****2222
                              </h3>
                              <span>Next billing charged $29</span>
                              <br />
                              <em className="text-muted">
                                Autopay on May 12, 2018
                              </em>
                              <a className="edit-payment-info">
                                Edit Payment Info
                              </a>
                            </div>
                            <p className="margin-top-30">
                              <a>
                                <i className="fa fa-plus-circle"></i> Add
                                Payment Info
                              </a>
                            </p>
                          </div>

                          <div className="body">
                            <h6>Billing History</h6>
                            <table className="table billing-history">
                              <thead className="sr-only">
                                <tr>
                                  <th>Plan</th>
                                  <th>Amount</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <h3 className="billing-title">
                                      Basic Plan{" "}
                                      <span className="invoice-number">
                                        #LA35628
                                      </span>
                                    </h3>
                                    <span className="text-muted">
                                      Charged at April 17, 2018
                                    </span>
                                  </td>
                                  <td className="amount">$29</td>
                                  <td className="action">
                                    <a>View</a>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <h3 className="billing-title">
                                      Pro Plan{" "}
                                      <span className="invoice-number">
                                        #LA3599
                                      </span>
                                    </h3>
                                    <span className="text-muted">
                                      Charged at March 18, 2018
                                    </span>
                                  </td>
                                  <td className="amount">$59</td>
                                  <td className="action">
                                    <a>View</a>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <h3 className="billing-title">
                                      Platinum Plan{" "}
                                      <span className="invoice-number">
                                        #LA1245
                                      </span>
                                    </h3>
                                    <span className="text-muted">
                                      Charged at Feb 02, 2018
                                    </span>
                                  </td>
                                  <td className="amount">$89</td>
                                  <td className="action">
                                    <a>View</a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <button type="button" className="btn btn-primary">
                              Update
                            </button>
                            <button type="button" className="btn btn-default">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </Tab>
                      <Tab eventKey="Preferences" title="Residence Information">
                        <div className="row clearfix">
                          <div className="w-100 p-3">
                            <div className="body">
                              <h6 style={{textAlign:'center'}}>My Residence Information</h6>
                              <ul className="list-unstyled list-login-session w-80 p-3">
                                <li>
                                <h3 className="login-title">
                                       {this.state.residence.ResidenceName}
                                      </h3>
                                      <li>
                                      <h3 className="login-title">
                                         {this.state.residence.ResidenceUniversity}
                                      </h3>
                                      </li>
                                </li>
                                
                                <li>
                                    <div className="login-info">
                                      <span className="login-detail">
                                        {this.state.residence.ResidenceLocation}
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
                                  src={this.state.residence.ResidencePhoto} />
                               
                                  <li>
                                    <p>{this.state.residence.ResidenceDescription}</p>
                                  </li>
                                <li>
                                  <div className="login-session">
                                    <div className="login-info">
                                      <h3 className="login-title">
                                        Residence Amenitis
                                      </h3>
                                      <p>{this.state.residence.ResidenceAmenities}</p>
                                    </div>

                                  </div>
                                </li>
                                
                              </ul>
                            </div>
                          </div>
                        </div>
                      </Tab>
                      <Tab eventKey="documents" title="Documents">
                        <div
                          style={{ flex: 1 }}
                          onClick={() => {
                            document.body.classList.remove("offcanvas-active");
                          }}
                        >
                          <div>
                            <div className="container-fluid">
                              <div className="row clearfix">
                                <div className="col-lg-3 col-md-5 col-sm-12">
                                  <FileStorageCard TotalSize="Storage Used" UsedSize={90} />
                                  {fileStorageStatusCardData.map((data, index) => {
                                    return (
                                      <div key={index + "sidjpidj"} onClick={() => this.changeDocument(data.FileType)}> 
                                      <FileStorageStatusCard
                                        key={index + "sidjpidj"}
                                        TotalSize=''
                                        UsedSize={data.UsedSize}
                                        Type={data.status}
                                        UsedPer={data.UsedPer}
                                        ProgressBarClass={`${data.ProgressBarClass}`}
                                      />
                                      </div>
                                    );
                                  })}
                                  <div>
                                  </div>
                                </div>
                                <div className="col-lg-9 col-md-7 col-sm-12">
                                  {/* <LineChartCard
                  HeaderText="View File"
                  ChartOption={areaChartFileReport}
                /> */}
                                  <div style={{height: '100%'}} className="pdf-div">
                                    <p className="lead" style={{ textAlign: 'center' }}>{this.state.keyString}</p>
                                    {myBody}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab>
                      <Tab eventKey="signing" title="Lease Agreement">
                        <div className = "w-auto p-3">
                          <Document className="border border-primary border-2"
                            file={{ url: "data:application/pdf;base64," + this.state.docUrl }}
                            onLoadSuccess={this.onDocumentLoadSuccess}
                          >
                            <Page pageNumber={this.state.pageNumber} />
                          </Document>
                          <nav>
                            <button className="btn btn-signin-social" onClick={this.goToPrevPage}>Prev</button>{" "}
                            &nbsp;&nbsp;
                            <button className="btn btn-signin-social" onClick={this.goToNextPage}>Next</button>
                          </nav>
                          <p>To agree to the above document, please enter your signature:</p>
                          <div className="border border-primary border-2 w-auto p-3"><SignatureCanvas className="border border-primary border-2 w-100 p-3" penColor='black' 
                            canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} ref={(ref) => { this.sigPad = ref }} /></div>,




                          <button className="btn btn-primary" onClick={() => this.trim()}>
                            Submit Signature
                          </button>
                          <button className="btn btn-default" onClick={this.clear}>
                            Clear
                          </button>

                        </div>

                      </Tab>
                    </Tabs>
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

const mapStateToProps = ({ navigationReducer, ioTReducer }) => ({
  rubixUserID: navigationReducer.userID,
  isSecuritySystem: ioTReducer.isSecuritySystem,
});

export default connect(mapStateToProps, {})(ProfileV1Page);
