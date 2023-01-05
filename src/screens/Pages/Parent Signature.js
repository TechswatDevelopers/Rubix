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
      await fetch('https://adowadocuments.rubix.mobi:86/feed/post/' + this.state.userID)
      .then(response => response.json())
      .then(data => {
        console.log("check: ", data)
        if(data.post.length != 0 && data.post != null){
          this.setState({
           bookingDoc: '17_surety-doc_Samkelo_Zondi_21458321.pdf',
            leaseDoc: data.post.filter(doc => doc.FileType == "lease-agreement")[0].filename,
            currentDoc: data.post.filter(doc => doc.FileType == "lease-agreement")[0].filename
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
    
     if (this.sigPad.getTrimmedCanvas().toDataURL('image/png') != null) {
      this.setState({ trimmedDataURL: this.sigPad.getTrimmedCanvas().toDataURL('image/png') })
      
      this.postSignature(this.sigPad.getTrimmedCanvas().toDataURL('image/png'), this.state.leasDoc)

      setTimeout(() => {
        this.postDeed(this.sigPad.getTrimmedCanvas().toDataURL('image/png'))
      }, 3000)

    } else {
      alert("Please provide a signature")
    } 
  }
    //Function to post signature to API
    postSignature(signature, image) {
      const data = {
        'RubixRegisterUserID': this.state.userID,
        'ClientId': 1,
        'Time_and_Date': this.state.dateAndTime,
        'ImageUrl': image,
        'Signature': signature,
      }
      const requestOptions = {
        title: 'Parent Signature Upload',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: data
      };
      console.log("Posted Data:", data)
      const postDocument = async () => {
        
        await axios.post('https://adowarest.rubix.mobi:88/api/RubixGeneratePDFNEKSign', data, requestOptions)
          .then(response => {
            console.log("Signature upload details:", response)
            this.setState({ docUrl: response.data.PostRubixUserData })
            const dataUrl = 'data:application/pdf;base64,' + response.data.PostRubixUserData
            const temp = this.dataURLtoFile(dataUrl, 'Lease agreement')
            this.onPressUpload(temp, 'lease-agreement', 'signing')
          })
      }
      postDocument()
    }


    postDeed(signature) {
      const data = {
        'RubixRegisterUserID': this.state.userID,
        'ClientId': 1,
        'Time_and_Date': this.state.dateAndTime,
        'Signature': signature,
      }
      const requestOptions = {
        title: 'Parent Signature Upload',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: data
      };
      console.log("Posted Data:", data)
      const postDocument = async () => {
        
        await axios.post('https://adowarest.rubix.mobi:88/api/RubixGenerateDeedofSuretyPDF', data, requestOptions)
          .then(response => {
            console.log("Signature upload details:", response)
            this.setState({ docUrl: response.data.PostRubixUserData })
            const dataUrl = 'data:application/pdf;base64,' + response.data.PostRubixUserData
            const temp = this.dataURLtoFile(dataUrl, 'Deed of Surety')
            this.onPressUpload(temp, 'surety-doc', 'signing')
           
          })
      }
      postDocument()
    }

/*     postKey(signature, tryval) {
      const data = {
        'RubixRegisterUserID': 105,
        'ClientId': 1,
        'Time_and_Date': this.state.dateAndTime,
        'Signature': signature,
      }
      const requestOptions = {
        title: 'Parent Signature Upload',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: data
      };
      console.log("Posted Data:", data)
      const postDocument = async () => {
        
        await axios.post('https://adowarest.rubix.mobi:88/api/RubixGenerateKeyReceiptFormPDF', data, requestOptions)
          .then(response => {
            console.log("Signature upload details:", response)
            this.setState({ docUrl: response.data.PostRubixUserData })
            const dataUrl = 'data:application/pdf;base64,' + response.data.PostRubixUserData
            const temp = this.dataURLtoFile(dataUrl, 'Deed of Surety')
            this.onPressUpload(temp, 'surety-doc', 'signing')
           
          })
      }
      postDocument()
    } */
    
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
  //this.props.updateLoadingMessage("Uploading Lease Document...");
  
  const postDocument = async () => {
    const data = new FormData()
    data.append('image', image)
    data.append('FileType', filetype)
    data.append('RubixRegisterUserID', this.state.userID)

    const requestOptions = {
      title: 'Student Document Upload',
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data', },
      body: data
    };
    
    for (var pair of data.entries()) {
      console.log(pair[0], ', ', pair[1]);
    }
    await axios.post('https://adowadocuments.rubix.mobi:86/feed/post?image', data, requestOptions)
      .then(response => {
        console.log("Upload details:", response)
        this.setState({ mongoID: response.data.post._id })
      })
  }
  postDocument().then(() => {
    //alert("Document uploaded successfully")
    //Set timer for loading screen
  setTimeout(() => {
    this.props.updateLoadingController(false);
    this.props.onPresPopUpEvent()
  }, 3000);
    window.location.reload()
    
 
  })
}
  //Set Theme Color
  setThemeColor(client){
    switch(client){
      case '1':{
        this.props.updateClientLogo("adowa-logo.png");
        this.props.updateClientName("Adowa Living");
        this.props.onPressThemeColor("adowa");
        //this.props.updateClientBackG("https://github.com/TechswatDevelopers/Media/raw/main/project-4-1.jpg")
        this.setState({
          backImage:
            "https://github.com/TechswatDevelopers/Media/raw/main/project-4-1.jpg",
          pageTitle: "Adowa Living",
        });

        localStorage.setItem("clientLogo", "adowa-logo.png");
        localStorage.setItem("clientName", "Adowa Living");
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
      case 'surety-doc':
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
        UsedSize: "Deed of Surety",
        Type: "Documents",
        status: localStorage.getItem('bookFormProgress'),
        FileType: "surety-doc",
        TotalSize: "1tb",
        UsedPer: localStorage.getItem('bookFormProgress'),
        ProgressBarClass:
          "progress progress-xs progress-transparent custom-color-blue mb-0",
      },
       {
        UsedSize: "Lease Agreement",
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
                                    <iframe src={'https://adowaimages.rubix.mobi:449/' + this.state.currentDoc} width="100%" height="500px">
           </iframe>
           <p>I: </p>
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
