import React from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
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
    rubixClientLogo: this.props.match.params.clientID,
    bookingDoc: null,
    leasDoc: null,
    userData: {},
    currentDoc: '',
  }
}

  componentDidMount() {
    window.scrollTo(0, 0);
    this.setThemeColor(this.props.match.params.clientID )
    localStorage.setItem('clientID', this.props.match.params.clientID)

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

  //console.log("client ID:", localStorage.getItem('clientID'))
  //Send verification
  const verify = async() => {
    await fetch('https://jjprest.rubix.mobi:88/api/RubixVerifyEmails/'  + this.props.match.params.activeCode)
      .then(response => response.json())
      .then(data => {
        console.log("response data:", data)
        this.setState({userData: data.PostEmailVerification})
          //alert("Account verified successfully!")
          });
  }
  //verify()
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
      <div className={localStorage.getItem('clientTheme')}
      >
        <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
          <div className="loader">
            <div className="m-t-30"><img src={localStorage.getItem('clientLogo')} width="170" height="70" alt="Lucid" /></div>
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
           <p>If you agree to the above document, please enter your signature:</p>
                  <div className="border border-primary border-2 p-3" style={{
                    width: '100%'
                    }}>
                    <SignatureCanvas className="border border-primary border-2" penColor='black'
                    canvasProps={{  height: '100%', width: '400px', className: 'sigCanvas' }} ref={(ref) => { this.sigPad = ref }} />
                    </div>
                  <button className="btn btn-primary rounded-0" onClick={() => this.trim()}>
                    Submit Signature
                  </button>
                  <button className="btn btn-default" onClick={this.clear}>
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
