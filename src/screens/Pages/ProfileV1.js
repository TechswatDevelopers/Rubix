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
import SignatureCanvas from 'react-signature-canvas';
//import tempfile from 'tempfile';
//import DocViewer from "react-doc-viewer";

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
      docType: 'ID Document',
      myUserID: null,
      doc: {},
      docs: [],
      tempDoc: {},
      isSelected: false,
      base64Pdf: null,
      docUrl: '',
      showPad: false,
      trimmedDataURL: null,
      userIPAddress: null,
      userBrowser: null,
      dateAndTime: null,
      testDoc: {},
      numPages: null,
      progress: '',
      myLease: '',
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const userID = localStorage.getItem('userID');
    const userProgress = localStorage.getItem('progress');
    this.setState({ myUserID: userID });
    this.setState({ progress: userProgress });
    this.getUserBrowser()
    this.getUserWitnessData()
    const DATE_OPTIONS = { year: 'numeric', month: 'long', day: 'numeric', time: 'long' };
    const myDate = new Date().toLocaleDateString('en-ZA', DATE_OPTIONS)
    const myTime = new Date().toLocaleTimeString('en-ZA')
    this.setState({ dateAndTime: myDate + myTime })
    /* console.log("The date is:", myDate)
    console.log("The time is:", myTime) */
    this.loadDocuments(userID)
    this.loadData()
  }

  //Fetch All documents from DB
  loadDocuments(userID) {
    const fetchData = async () => {
      //Get documents from DB
      await fetch('https://rubixdocuments.cjstudents.co.za:86/feed/post/' + userID)
        .then(response => response.json())
        .then(data => {
          console.log("documents data:", data)

          //Set Documents list to 'docs'
          this.setState({ docs: data.post })

          //Load initial PDF as ID Document
          const tempList = data.post.filter(doc => doc.FileType == 'id-document')[0]

          if(tempList != null || tempList != undefined){
            //Set ID Document to initial Document
          const string = "data:application/pdf;base64," + data.post.filter(doc => doc.FileType == 'id-document')[0].image
          this.setState({ doc: data.post.filter(doc => doc.FileType == 'id-document')[0] })

          //Convert base64 to file
          const image = this.dataURLtoFile(string, "document.pdf")
          this.setState({ testDoc: image })
          }
          else {
            this.setState({doc: null})
          }
          //console.log("Documents: ", data.post)
          this.checkLease(userID)
        });

    };
    fetchData()
  }


  //Load Local Storage Data
  loadData() {
    const myProfile = localStorage.getItem('profile');
    this.setState({ myUserProfile: myProfile })
  }

  //Page navigation functions
  goToPrevPage = () =>
    this.setState(state => ({ pageNumber: state.pageNumber - 1 }));
  goToNextPage = () =>
    this.setState(state => ({ pageNumber: state.pageNumber + 1 }));

  //Check Lease Agreement Doc
  checkLease(userId) {
    const temp = this.state.docs.filter(doc => doc.FileType == 'lease-agreement')
    //console.log(temp[0].image)
    if (temp.length != 0) {
      this.setState({ docUrl: temp[0].image, myLease: temp[0].filename })
      //tempfile('.png');
      this.setState({ showPad: false })
    }
    else {
      this.postSignature('https://cdn.hipwallpaper.com/i/96/13/QOhrVz.png', userId, 0)
      this.setState({ showPad: true })
    }
  }


  //Switch to different Document
  changeDocument = (file) => {
    this.setLoadingDocumentPage()
    const temp = this.state.docs.filter(doc => doc.FileType == file)
    this.setState({ isSelected: false })
    this.setState({ selectedFile: null })
    //console.log("file type", file)
    //console.log("temp object", temp)
    this.setState({ keyString: file })
    this.changeHeading(file)
    //console.log("current file type", this.state.keyString)
    if (temp.length != 0) {
      this.setState({ doc: temp[0] })
    } else {
      this.setState({ doc: null })
    }
    //this.setState(state => ({ document: {file: file}}));
  }

  //Change heading
  changeHeading(file) {
    switch (file) {
      case 'id-document':
        {
          this.setState({ docType: "My ID Document" })
        }
        break
      case 'proof-of-res':
        {
          this.setState({ docType: "My Proof of Residence" })
        }
        break
      case 'proof-of-reg':
        {
          this.setState({ docType: "My Proof of Registration" })
        }
        break
      case 'next-of-kin':
        {
          this.setState({ docType: "Next of Kin ID" })
        }
    }
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


  //Converts base64 to file
  dataURLtoFile(dataurl, filename) {

    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  //Post File Using Mongo
  onPressUpload(image, filetype, currentActiveKey) {
    //var file = e.target.files[0]
    //console.log("selected file is:", file)
    //this.setState({selectedFile: file})
    this.setLoadingPage(5000)
    const postDocument = async () => {
      const data = new FormData()
      data.append('image', image)
      data.append('FileType', filetype)
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
      await axios.post('https://rubixdocuments.cjstudents.co.za:86/feed/post?image', data, requestOptions)
        .then(response => {
          console.log("Upload details:", response)
          this.setState({ mongoID: response.data.post._id })
        })
    }
    postDocument().then(() => {
      alert("Document uploaded successfully")
      window.location.reload()
      document.getElementById('uncontrolled-tab-example').activeKey = currentActiveKey
    })
  }

  //When User Presses Cancel on Document Uploading
  onPressCancel() {
    this.setState({ selectedFile: null })
    this.setState({ isSelected: false })
  }

  //Handle File Selection input
  changeHandler(event) {
    this.setState({ selectedFile: event.target.files[0] })
    console.log("selcted file1", event.target.files[0])
    this.onPressUpload(event.target.files[0], this.state.keyString, 'documents')
    this.setState({ isSelected: true })
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
    this.setLoadingPage(3000)
    if (this.sigPad.getTrimmedCanvas().toDataURL('image/png') != null) {
      this.setState({ trimmedDataURL: this.sigPad.getTrimmedCanvas().toDataURL('image/png') })
      console.log("IP Address:", this.state.userIPAddress)
      //this.postSignature(this.sigPad.getTrimmedCanvas().toDataURL('image/png'), this.state.myUserID, 1)
    } else {
      alert("Please provide a signature")
    }
  }

  //Coleect User Signing Info
  getUserWitnessData() {
    //Fetch IP Address
    const getData = async () => {
      const res = await axios.get('https://geolocation-db.com/json/')
      console.log(res.data);
      this.setState({userIPAddress: res.data.IPv4 })
    }
    getData()
  }

  //Get user browser information
  getUserBrowser() {

    var browser
    // Opera 8.0+
    var isOpera = (!!window.opr) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    console.log("Opera:", isOpera)
    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';
    console.log("Firefox:", isFirefox)

    // Safari 3.0+ "[object HTMLElementConstructor]" 
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] /* || (typeof safari !== 'undefined' && safari.pushNotification) */);
    console.log("Safari:", isSafari)

    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    console.log("Internet Explorer:", isIE)

    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;
    console.log("Edge:", isEdge)

    // Chrome 1 - 71
    var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    console.log("Chrome:", isChrome)

    // Blink engine detection
    var isBlink = (isChrome || isOpera) && !!window.CSS;
    console.log("Blink:", isBlink)

    if (isChrome) {
      this.setState({ userBrowser: 'Chrome' })
      console.log("is chrome", isChrome)
    }
    else if (isEdge) {
      this.setState({ userBrowser: 'Edge' })
    }
    else if (isIE) {
      this.setState({ userBrowser: 'Internet Explorer' })
    }
    else if (isSafari) {
      this.setState({ userBrowser: 'Safari' })
    }
    else if (isFirefox) {
      this.setState({ userBrowser: 'Firefox' })
    }
    else if (isOpera) {
      this.setState({ userBrowser: 'Opera' })
    }

  }


  //Function to post signature to API
  postSignature(signature, userid, tryval) {
    const postDocument = async () => {
      const data = {
        'RubixRegisterUserID': userid,
        'ClientIdFronEnd': localStorage.getItem('clientID'),
        'IP_Address': this.state.userIPAddress,
        'Time_and_Date': this.state.dateAndTime,
        'image': signature
      }
      const requestOptions = {
        title: 'Student Signature Upload',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: data
      };
      console.log("Posted Data:", data)
      await axios.post('https://rubixpdf.cjstudents.co.za:94/PDFSignature', data, requestOptions)
        .then(response => {
          console.log("Signature upload details:", response)
          this.setState({ docUrl: response.data.Base })
          if (tryval === 1) {
            const dataUrl = 'data:application/pdf;base64,' + response.data.Base
            const temp = this.dataURLtoFile(dataUrl, 'Lease Agreement') //this.convertBase64ToBlob(response.data.Base)
            console.log("temp file:", temp)
            this.onPressUpload(temp, 'lease-agreement', 'signing')
          }
        })
    }
    postDocument()
  }
  //On Press loading data
  setLoadingPage(time,) {
    this.setState({ isLoad: true, })
    setTimeout(() => {
      this.setState({
        isLoad: false,
      })
    }, time);
  }
  //On Press loading data
  setLoadingDocumentPage() {
    this.setState({ isDocLoad: true, })
    setTimeout(() => {
      this.setState({
        isDocLoad: false,
      })
    }, 700);
  }


  render() {
    let myBody;
    if (!this.state.isSelected) {
      myBody = <> {this.state.doc != null
        ? <>
        <input style={{ display: 'none' }} id='upload-button' type="file" onChange={(e) => this.changeHandler(e)} />
        <button className="btn btn-primary" variant="contained" color="primary" component="span" onClick={(e) => this.handleUpdate(e)}>Upload A New File</button>
          {/* <Document className="border border-primary border-2"
            file={{ url: "data:application/pdf;base64," + this.state.doc.image }}
            onLoadSuccess={this.onDocumentLoadSuccess}
          >
          
            <Page pageNumber={this.state.pageNumber} renderAnnotationLayer={false}
      renderTextLayer={false} />
          </Document> */}

          <iframe src={'https://rubiximages.cjstudents.co.za:449/' + this.state.doc.filename}width="100%" height="500px">
    </iframe>

          {/* <nav>
            <button className="btn btn-signin-social" onClick={this.goToPrevPage}>Prev</button>{" "}
            &nbsp;&nbsp;
            <button className="btn btn-signin-social" onClick={this.goToNextPage}>Next</button>
          </nav> */}
        </>

        : <>
          <div></div>
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
            <p style={{ textAlign: 'center' }} className="lead">Oops, it seems that you have not uploaded a document yet, to enable viewer, please upload a document.</p>
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
        <button className="btn btn-primary" onClick={() => this.onPressUpload(this.state.selectedFile, this.state.keyString, 'documents')}>Confirm Upload</button>{" "}
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
        <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
          <div className="loader">
            <div className="m-t-30"><img src={localStorage.getItem('clientLogo')} width="170" height="70" alt="Lucid" /></div>
            <p>Please wait...</p>
          </div>
        </div>
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
              className="progress-bar bg-success progress-bar-striped"
              data-transitiongoal={this.state.progress}
              aria-valuenow={this.state.progress}
              style={{ width: this.state.progress + `%` }}
            >
              Profile is {this.state.progress}% complete
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
                      {/* <Tab eventKey="Billing" title="Billing">
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
                      </Tab> */}

                      
                      {/* <Tab eventKey="Preferences" title="Residence Information">
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
                      </Tab> */}
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
                                  <div style={{ height: '100%' }} className="pdf-div">
                                    <p className="lead" style={{ textAlign: 'center' }}>{this.state.docType}</p>
                                    

                                    {myBody}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab>
                      <Tab eventKey="signing" title="Lease Agreement">
                        <div className="w-auto p-3">
                          { !this.state.myLease
                            ? <><Document className="border border-primary border-2"
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
                          </>
                          :<iframe src={'https://rubiximages.cjstudents.co.za:449/' + this.state.myLease} width="100%" height="500px">
                         </iframe>}
                          
                          {
                            this.state.showPad
                              ? <>
                                <p>If you agree to the above document, please enter your signature:</p>
                                <div className="border border-primary border-2 w-auto p-3"><SignatureCanvas className="border border-primary border-2 w-100 p-3" penColor='black'
                                  canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }} ref={(ref) => { this.sigPad = ref }} /></div>,
                                <button className="btn btn-primary" onClick={() => this.trim()}>
                                  Submit Signature
                                </button>
                                <button className="btn btn-default" onClick={this.clear}>
                                  Clear
                                </button>
                              </>
                              : null
                          }

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