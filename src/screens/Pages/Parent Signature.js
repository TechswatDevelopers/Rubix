import React from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import axios from "axios";
import PageHeader from "../../components/PageHeader";
import SignatureCanvas from 'react-signature-canvas';
import FileStorageStatusCard from "../../components/FileManager/FileStorageStatusCard"
import {onPresPopUpEvent, updateEmail, updatePassword,onLoggedin, updateUserID, 
  updateClientID,onPressThemeColor,updateClientName, updateClientLogo } from "../../actions";

class ParentSignature extends React.Component {
  //Initial State
constructor(props) {
  super(props)
  this.state = {
    isLoad: true,
    activationCode: null,
    errorMessage: '',
    errorMessage: '',
    //rubixClientLogo: this.props.match.params.clientID,
    bookingDoc: null,
    leasDoc: null,
    userData: {},
    currentDoc: '',
    placeOfSign: '',
    fullName: '',
    trimmedDataURL: '',
    dateAndTime: '',
    userID: this.props.match.params.userID,
  }
}
  componentDidMount() {
    window.scrollTo(0, 0);
    this.setThemeColor('1')
    //localStorage.setItem('clientID', this.props.match.params.clientID)
    const DATE_OPTIONS = { year: 'numeric', month: 'long', day: 'numeric', time: 'long' };
    const myDate = new Date().toLocaleDateString('en-ZA', DATE_OPTIONS)
    const myTime = new Date().toLocaleTimeString('en-ZA')
    this.setState({ dateAndTime: myDate + myTime })

    const fetchDocs = async()=> {
      //Get documents from DB
      await fetch('https://jjpdocument.rubix.mobi:86/feed/post/103' /* + userID */)
      .then(response => response.json())
      .then(data => {
        console.log("check: ", data)
        if(data.post.length != 0 && data.post != null){
          this.setState({
            bookingDoc: data.post.filter(doc => doc.FileType == 'booking-doc')[0].filename,
            leaseDoc: data.post.filter(doc => doc.FileType == "lease-agreement")[0].filename,
            currentDoc: data.post.filter(doc => doc.FileType == 'booking-doc')[0].filename
          })
        }
      })
    }
    fetchDocs()

     //Set timer for loading screen
  setTimeout(() => {
    this.setState({
      isLoad: false,
      activationCode: this.props.match.params.activeCode
    })
  }, 2000);
  }

  //Function to clear signature and input data
  clear = () => {
    //Clear Inputs
    document.getElementById('RubixPlace').value = ''
    document.getElementById('NameSurname').value = ''
    //Clear SIgnature
    this.sigPad.clear()
  }

  //Function for triming Signature Pad array and save as one png file
  trim = () => {
    //var myBlob = this.sigPad.getTrimmedCanvas().toBlob
    //var myFile = new File([myBlob], 'mySignature', { type: "image/png", })
   // var my2ndFile = this.dataURLtoFile(this.sigPad.getTrimmedCanvas().toDataURL('image/png'), 'Parent signature')
    //console.log('The file: ', my2ndFile)
   // this.onPressSignatureUpload(my2ndFile)
    //this.setLoadingPage(3000)
     if (this.sigPad.getTrimmedCanvas().toDataURL('image/png') != null) {
      this.setState({ trimmedDataURL: this.sigPad.getTrimmedCanvas().toDataURL('image/png') })
      //console.log("IP Address:", this.state.userIPAddress)
      this.postSignature(this.sigPad.getTrimmedCanvas().toDataURL('image/png'), 1)
    } else {
      alert("Please provide a signature")
    } 
  }
    //Function to post signature to API
    postSignature(signature, tryval) {
      const data = {
        'NameSurname': document.getElementById('NameSurname').value,
        'ClientId': this.state.userID,
        'RubixPlace': document.getElementById('RubixPlace').value,
        'Time_and_Date': this.state.dateAndTime,
        'Signature': signature,
        'PDFDocumentUrl': this.state.leaseDoc
      }
      const requestOptions = {
        title: 'Parent Signature Upload',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: data
      };
      //console.log("Posted Data:", data)
      const postDocument = async () => {
        
        await axios.post('https://jjppdf.rubix.mobi:94/PDFNEKSignature', data, requestOptions)
          .then(response => {
            //console.log("Signature upload details:", response)
            this.setState({ docUrl: response.data.Base })
            if (tryval === 1) {
              const dataUrl = 'data:application/pdf;base64,' + response.data.Base
              const temp = this.dataURLtoFile(dataUrl, 'Lease Agreement') //this.convertBase64ToBlob(response.data.Base)
              //console.log("temp file:", temp)
              this.onPressUpload(temp, 'lease-agreement', 'signing')
            } else if (tryval === 0) {
              const dataUrl = 'data:application/pdf;base64,' + response.data.Base
              const temp = this.dataURLtoFile(dataUrl, 'unsigned Agreement') //this.convertBase64ToBlob(response.data.Base)
              //console.log("temp file:", temp)
              this.onPressUpload(temp, 'unsigned-agreement', 'signing')
            }
          })
      }
      if( document.getElementById('RubixPlace').value =='' ||  document.getElementById('NameSurname').value == ''){

      } else {
        postDocument()
      }
    }
    
  //Set Theme Color
  setThemeColor(client){
    switch(client){
      case '1':{
        this.props.updateClientLogo("jjp-logo.png")
        this.props.updateClientName("Varsity Lodge")
        this.props.onPressThemeColor("blush")
        this.setState({
          backImage: "https://github.com/TechswatDevelopers/Media/raw/main/a7a8f6fb-32f3-42d7-8658-df16eebc9752.jpg"
        })

        localStorage.setItem('clientLogo', "jjp-logo.png")
        localStorage.setItem('clientName', "Varsity Lodge")
        localStorage.setItem('clientTheme', "blush")
      }
        break
      case '2': { 
      this.props.onPressThemeColor('purple')
      this.props.updateClientLogo('opal.png')
      this.props.updateClientName('Opal Students')
      this.setState({
        backImage: 'https://github.com/TechSwat/ResidencesImages/raw/main/Outside%20Building%201-min.jpg'

      })


      localStorage.setItem('clientLogo', 'opal.png')
      localStorage.setItem('clientName', 'Opal Students')
      localStorage.setItem('clientTheme', 'purple')
    }
    }
    //console.log('client:', this.state.backImage)
  }

  //Change Doc
  changeDocument(key){
    switch(key){
      case 'booking-doc':
        {
          this.setState({
            currentDoc: this.state.bookingDoc
          })
        }
        break;
        case "lease-agreement":
          {
            this.setState({
              currentDoc: this.state.leaseDoc
            })
          }
    }

  }
  
  render() {
    let fileStorageStatusCardData = [
     {
        UsedSize: "Booking Form",
        Type: "Documents",
        status: localStorage.getItem('bookFormProgress'),
        FileType: "booking-doc",
        TotalSize: "1tb",
        UsedPer: localStorage.getItem('bookFormProgress'),
        ProgressBarClass:
          "progress progress-xs progress-transparent custom-color-blue mb-0",
      },
       {
        UsedSize: "My Lease Agreement",
        Type: "Documents",
        status: localStorage.getItem('leaseProgressMsg'),
        FileType: "lease-agreement",
        TotalSize: "1tb",
        UsedPer: localStorage.getItem('leaseProgress'),
        ProgressBarClass:
          "progress progress-xs progress-transparent custom-color-red mb-0",
      },
    ]
    return (
      <div className={"theme-grey"/* localStorage.getItem('clientTheme') */}
      >
        <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
          <div className="loader">
            <div className="m-t-30"><img src={localStorage.getItem('clientLogo')} width="10%" height="10%" alt="" /></div>
            <p>Please wait...</p>
          </div>
        </div>
        <div>
        <div
                          style={{ flex: 1 }}
                          onClick={() => {
                            document.body.classList.remove("offcanvas-active");
                          }}
                        >
                          <div>
                            <div className="container-fluid">
                                <p className="pt-3">Please read and sign the following docs.</p>
                              <div className="row clearfix">
                                <div className="col-lg-3 col-md-5 col-sm-12 p-3">
                                  {/* <FileStorageCard TotalSize="Storage Used" UsedSize={90} /> */}
                                  {fileStorageStatusCardData.map((data, index) => {
                                    return (
                                      <div 
                                      key={index + "sidjpidj"} 
                                      onClick={() => this.changeDocument(data.FileType)}
                                      onAnimationEnd={() => this.setState({ fade: false,
                                        currentProgress: data.UsedPer,
                                      })}
                                      >
                                        <FileStorageStatusCard
                                          key={index + "sidjpidj"}
                                          TotalSize={data.RubixVettedResult}
                                          UsedSize={data.UsedSize}
                                          Type={" "}
                                          UsedPer={0}
                                          ProgressBarClass={`${data.ProgressBarClass}`}
                                          MyFunction = {()=>{this.props.onPresPopUpConfirm()}}
                                        />
                                      </div>
                                    );
                                  })}
                                  <div>
                                  </div>
                                </div>
                                <div className="col-lg-9 col-md-7 col-sm-12">
                                  <div style={{ height: '100%' }} className="pdf-div">
                                    <p className="lead" style={{ textAlign: 'center' }}>{this.state.docType}</p>
                                    <iframe src={'http://129.232.144.154:449/' + this.state.currentDoc} width="100%" height="500px">
           </iframe>
           <p>I:</p>
           <input
                            className="form-control"
                            id="NameSurname"
                            placeholder="Full Name"
                            type="text"
                            name= "NameSurname"
                          />
                          <p>Confirm that I have read, understood and agree the above agreement.</p>
                  <div className="border border-primary border-2 p-3" style={{
                    width: '100%'
                    }}>
                    <SignatureCanvas className="border border-primary border-2" penColor='black'
                    canvasProps={{  height: '100%', width: '400px', className: 'sigCanvas' }} ref={(ref) => { this.sigPad = ref }} />
                    </div>
                    <p>Signed at:</p>
           <input
                            className="form-control"
                            id="RubixPlace"
                            placeholder="Location"
                            type="text"
                            name= "RubixPlace"
                          />
                  <button className="btn btn-primary rounded-0 mt-2" onClick={() => this.trim()}>
                    Submit Signature
                  </button>
                  <button className="btn btn-default mt-2 ml-1" onClick={this.clear}>
                    Clear
                  </button>
                                  </div>
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
  
  updateUserID,
  updateClientID,
  onPressThemeColor,
  updateEmail,
  updateClientLogo,
  updateClientName,
})(ParentSignature);
