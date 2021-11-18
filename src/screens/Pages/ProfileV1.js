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
import { Document, Page, pdfjs  } from "react-pdf";

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
      tempDoc:{},
      isSelected: false,
      base64Pdf: null,
      trimmedDataURL: null,
    }
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    const userID = localStorage.getItem('userID');
    this.setState({myUserID: userID});
    
    const fetchData = async() =>{
       //Get documents from DB
       await fetch('http://192.168.88.10:3001/feed/post/' + userID)
       .then(response => response.json())
       .then(data => {
         console.log("calleed")
         console.log("documents data:", data)
         this.setState({doc: data.post[0]})
         this.setState({tempDoc: data.post[1]})
         this.setState({docs: data.post})
           });

      //Get Rubix User Residence Details
            await fetch('http://192.168.88.10:3300/api/RubixStudentResDetails/' + userID)
        .then(response => response.json())
        .then(data => {
            this.setState({residence: data})
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
  //console.log("file type", file)
  console.log("temp object", temp)
  this.setState({keyString: file})
  console.log("current file type", this.state.keyString)
  if(temp.length != 0){
    this.setState({doc: temp[0]})
  } else {
    this.setState({doc: null})
  }
   //this.setState(state => ({ document: {file: file}}));
 }

 //Post file using SQL
 postFile(e) {
  //console.log("I am called")
  var file = e.target.files[0]
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      this.setState({
        imgUpload: reader.result
      })
      postDocument()
      
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    }
    console.log("This is the img:", reader.result)

  const postDocument = async() =>{
    const data = {
      'RubixRegisterUserID': this.state.myUserID, //'2356',
      'FileType': this.state.keyString,
      'image': this.state.imgUpload,
      'imageUrl': 'sent from frontend',
      'FileName': file.name,
      'FileExtension': file.type,
      'FileSize': file.size
  };
  const requestOptions = {
    title: 'Student Document Upload',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept':  'application/json'},
    body: data
};
//console.log('File being sent:', file)
console.log('Information sent:', data)
await axios.post(' http://192.168.88.10:3300/api/RubixPostDocuments', data, requestOptions)
                .then(response => {
                    console.log("Upload details:",response)
                    //this.setState({residence: response.data.PostRubixUserData[0]})
                }) 
  };
}

//convert to base64
getBase64(e) {
  var file = e.target.files[0]
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
  const postDocument = async() =>{
    const data = new FormData()
    data.append('image', this.state.selectedFile)
    data.append('FileType', this.state.keyString,)
    data.append('RubixRegisterUserID', this.state.myUserID)
    const requestOptions = {
      title: 'Student Document Upload',
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data',},
      body: data
  };
  for (var pair of data.entries()) {
    console.log(pair[0], ', ',pair[1]); 
}
await axios.post('http://192.168.88.10:3001/feed/post?image', data, requestOptions)
                .then(response => {
                    console.log("Upload details:",response)
                    this.setState({mongoID: response.data.post._id})
                }) 
  }
  postDocument()
}
onPressCancel(){
  this.setState({selectedFile: null})
  this.setState({isSelected: false})
}
changeHandler = (event) => {
  this.setState({selectedFile: event.target.files[0]})
  console.log("selcted file", event.target.files[0])
  this.setState({isSelected: true})
  this.getBase64(event)
}
handleUpdate(){
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
   this.setState({trimmedDataURL: this.sigPad.getTrimmedCanvas()
     .toDataURL('image/png')})

     console.log(this.sigPad.getTrimmedCanvas()
     .toDataURL('image/png'))
 }
//Function to post signature to API
postSignature(){
  console.log('I am called ')
  const postDocument = async() =>{
    const data = {
      'RubixRegisterUserID': this.state.myUserID,
      'ClientId': 1,
      'image': this.state.trimmedDataURL
    }
    const requestOptions = {
      title: 'Student Signature Upload',
      method: 'POST',
      headers: { 'Content-Type': 'application/json',},
      body: data
  };
  await axios.post('http://192.168.88.10:3005/PDFSignature', data, requestOptions)
                .then(response => {
                    console.log("Signature upload details:",response)
                }) 
  }
  postDocument()
}

  render() {
    let myBody;
    if(this.state.doc == null || this.state.doc == undefined){
      myBody = <> {this.state.isSelected
      ? <>
      <button className="btn btn-primary" onClick={()=>this.onPressUpload()}>Confirm Upload</button>{" "}
          &nbsp;&nbsp;
          <button className="btn btn-default" type="button" onClick={()=>this.onPressCancel()}>
            Cancel
          </button>
      <Document
      file= {{url: this.state.base64Pdf}}
      onLoadSuccess={this.onDocumentLoadSuccess}
    >
      <Page pageNumber={this.state.pageNumber} />
    </Document>
    
    <div style= {{margin: 'auto', display: 'inline-block'}}>
    <nav>
          <button className="btn btn-signin-social" onClick={this.goToPrevPage}>Prev</button>{" "}
          &nbsp;&nbsp;
          <button className="btn btn-signin-social" onClick={this.goToNextPage}>Next</button>
        </nav>
        </div>
        <br></br>
        <button className="btn btn-primary" onClick={()=>this.onPressUpload()}>Confirm Upload</button>{" "}
          &nbsp;&nbsp;
          <button className="btn btn-default" type="button" onClick={()=>this.onPressCancel()}>
            Cancel
          </button>
      </>
        : <>
        <div></div>
        <div style={{margin: 'auto', width: '75%'}}>
        <p style={{textAlign: 'center'}} className="lead">Oops, it seems that you have not uploaded a document yet, to enable viewer, please upload a document.</p>
        <div style={{margin: 'auto', width: '25%'}}>
        <input style={{ display: 'none' }} id='upload-button' type="file" onChange={(e)=>{this.changeHandler(e)}} />
        <button className="btn btn-primary" variant="contained" color="primary" component="span" onClick={()=>this.handleUpdate()}>Upload File</button>
        </div>
        </div>
        </>
      }
      </>
    } else {
      myBody = <>
      <Document
      file= {{url: "data:application/pdf;base64," + this.state.doc.image}}
      onLoadSuccess={this.onDocumentLoadSuccess}
    >
      <Page pageNumber={this.state.pageNumber} />
    </Document>
    
    <nav>
          <button className="btn btn-signin-social" onClick={this.goToPrevPage}>Prev</button>{" "}
          &nbsp;&nbsp;
          <button className="btn btn-signin-social" onClick={this.goToNextPage}>Next</button>
        </nav>
        <input style={{ display: 'none' }} id='upload-button' type="file" onChange={(e)=>{this.changeHandler(e)}} />
        <button className="btn btn-primary" variant="contained" color="primary" component="span" onClick={()=>this.handleUpdate()}>Upload A New File</button>
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
                          <div className="col-lg-6 col-md-12">
                            <div className="body">
                              <h6>My Residence Information</h6>
                              <ul className="list-unstyled list-login-session">
                               
                                <li>
                                  <div className="login-session">
                                    <div className="login-info">
                                      <h3 className="login-title">
                                        University - {this.state.residence.ResidenceUniversity}
                                      </h3>
                                      
                                    </div>
                                   
                                  </div>
                                </li>
                                <li>
                                  <div className="login-session">
                                    <div className="login-info">
                                      <h3 className="login-title">
                                        Residence Name - {this.state.residence.ResidenceName}
                                      </h3>
                                      <span className="login-detail">
                                      {this.state.residence.ResidenceLocation}
                                      </span>
                                      <br></br>
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
                                      </span>
                                    </div>
                                   
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                          {/* <div className="col-lg-6 col-md-12">
                            <div className="body">
                              <h6>Connected Social Media</h6>
                              <ul className="list-unstyled list-connected-app">
                                <li>
                                  <div className="connected-app">
                                    <i className="fa fa-facebook app-icon"></i>
                                    <div className="connection-info">
                                      <h3 className="app-title">FaceBook</h3>
                                      <span className="actions">
                                        <a>View Permissions</a>{" "}
                                        <a className="text-danger">
                                          Revoke Access
                                        </a>
                                      </span>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div className="connected-app">
                                    <i className="fa fa-twitter app-icon"></i>
                                    <div className="connection-info">
                                      <h3 className="app-title">Twitter</h3>
                                      <span className="actions">
                                        <a>View Permissions</a>{" "}
                                        <a className="text-danger">
                                          Revoke Access
                                        </a>
                                      </span>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div className="connected-app">
                                    <i className="fa fa-instagram app-icon"></i>
                                    <div className="connection-info">
                                      <h3 className="app-title">Instagram</h3>
                                      <span className="actions">
                                        <a>View Permissions</a>{" "}
                                        <a className="text-danger">
                                          Revoke Access
                                        </a>
                                      </span>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div className="connected-app">
                                    <i className="fa fa-linkedin app-icon"></i>
                                    <div className="connection-info">
                                      <h3 className="app-title">Linkedin</h3>
                                      <span className="actions">
                                        <a>View Permissions</a>{" "}
                                        <a className="text-danger">
                                          Revoke Access
                                        </a>
                                      </span>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div className="connected-app">
                                    <i className="fa fa-vimeo app-icon"></i>
                                    <div className="connection-info">
                                      <h3 className="app-title">Vimeo</h3>
                                      <span className="actions">
                                        <a>View Permissions</a>{" "}
                                        <a className="text-danger">
                                          Revoke Access
                                        </a>
                                      </span>
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div> */}
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
          {/* <Row>
                  <Col>
                  <button className="btn btn-signin-social" onClick={()=>this.changeDocument("id-document")}><i className="fa fa-folder m-r-10"></i>ID Document</button>
                  </Col>
                  <Col>
                  <button className="btn btn-signin-social" onClick={()=>this.changeDocument("proof-of-res")}><i className="fa fa-folder m-r-10"></i>Proof of Residence</button>
                  </Col>
                  <Col>
                  <button className="btn btn-signin-social" onClick={()=>this.changeDocument("proof-of-reg")}><i className="fa fa-folder m-r-10"></i>Proof of Registration</button>
                  </Col>
                  <Col>
                  <button className="btn btn-signin-social" onClick={()=>this.changeDocument("next-of-kin")}><i className="fa fa-folder m-r-10"></i>Next of Kin ID</button>
                  </Col>
                </Row> */}
                
            {/* <div className="row clearfix">
              {fileFolderCardData.map((data, index) => {
                return <FileFolderCard key={index} HeaderText={data.Header} onClick={()=>this.changeDocument(data.file)}/>;
              })}
            </div> */}
            <div className="row clearfix">
              <div className="col-lg-3 col-md-5 col-sm-12">
                <FileStorageCard TotalSize="Storage Used" UsedSize={90} />
                {fileStorageStatusCardData.map((data, index) => {
                  return (
                   <div onClick={()=>this.changeDocument(data.FileType)}> <FileStorageStatusCard
                      key={index + "sidjpidj"}
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
                <div className="pdf-div">
                  {myBody}
        </div>
              </div>
            </div>
          </div>
        </div>
      </div>
                      </Tab>
                      <Tab eventKey="signing" title="Lease Agreement">
                        <div>
                        {/* <Document
            file= {{url: "data:application/pdf;base64," + this.state.tempDoc.image}}
            onLoadSuccess={this.onDocumentLoadSuccess}
          >
            <Page pageNumber={this.state.pageNumber} />
          </Document> */}
          <p>To agree to the above document, please enter your signature:</p>
          <div><SignatureCanvas penColor='blue'
    canvasProps={{width: 500, height: 200, className: 'sigCanvas'}} ref={(ref) => { this.sigPad = ref }}/></div>,
    
        

        {this.state.trimmedDataURL
        ? <><img 
          src={this.state.trimmedDataURL} />
          <button className="btn btn-primary"  onClick={()=>this.postSignature()}>
          Submit Signature
        </button>
          </>
        : <>
        <button className="btn btn-primary"  onClick={this.trim}>
          Save as Image
        </button>
        <button className="btn btn-default"  onClick={this.clear}>
          Clear
        </button>
        </>}
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
