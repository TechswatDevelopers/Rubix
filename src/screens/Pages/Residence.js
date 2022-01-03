import React from "react";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import ReactEcharts from "echarts-for-react";
import "echarts-gl";
import echarts from "echarts";
import axios from "axios";
import ImageGallery from "react-image-gallery";
import ResManagerCard from "../../components/ResManagerCard";
import {
  topProductOption,
  topRevenueOption,
  topRevenueMonthlyOption,
  saleGaugeOption,
  dataManagetOption,
  sparkleCardData,
} from "../../Data/DashbordData";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
const images = [
  {
    original: require("../../assets/images/stock.png"),
    thumbnail: require("../../assets/images/stock.png"),
  },
];
class Residence extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      resDetails: {},
      resDetailTag: '',
      resCapacity: 0,
      amenities: [],
      gallery: [],
      socials: [],
      resManagerPic: '',
    }
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    //Set timer for loading screen
  setTimeout(() => {
    this.setState({
      isLoad: false,
      currentClientId: this.props.match.params.clientID
    })
  }, 2000);

    const pingData = {
      'RubixRegisterUserID': localStorage.getItem('userID'),
    };
    //Ping Request Headers
    const requestOptions = {
      title: 'Get residence Details',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: pingData
    };

    const postData = async () => {
      //Ping email address
      await axios.post('https://rubixapi.cjstudents.co.za:88/api/RubixStudentResDetails', pingData, requestOptions)
        .then(response => {
          console.log("Student Res Details", response.data.PostRubixUserData)
          const temp = response.data.PostRubixUserData;
          this.setState({
            resDetails: response.data.PostRubixUserData[0],
            resDetailTag: "Total Capacity",
            resCapacity: response.data.PostRubixUserData[0].Capacity
          });

          //Load amenities
          for(let i = 4; i <= temp.length - 1; ++i){
            this.state.amenities.push(temp[i])
          }

          //Load social links
          for(let i = 1; i<=3; ++i){
            this.state.socials.push(temp[i])
          }

          //Load Residence Images
          this.fetchImages(response.data.PostRubixUserData[0].RubixResidenceID)
        })
    }
    postData()
    //console.log('amenities', this.state.amenities)
  }

  //Fetch Res Gallery Images
  fetchImages(resID) {
    const fetchData = async () => {
    await fetch('https://rubixdocuments.cjstudents.co.za:86/feed/post/' + resID)
    .then(response => response.json())
    .then(data => {
      console.log("Images:", data.post)
      for(let i = 0; i <= data.post.length - 1; ++i){

       if(data.post[i].FileType != "ResManager"){ 
         this.state.gallery.push(
          {
            original: 'https://rubiximages.cjstudents.co.za:449/' + data.post[i].filename,
            thumbnail: 'https://rubiximages.cjstudents.co.za:449/' + data.post[i].filename
          }
        )
        }
        else (
          this.setState({
            resManagerPic: 'https://rubiximages.cjstudents.co.za:449/' +  data.post[i].filename
          })
        )
      }
      /* this.setState({
        gallery: data.post
      }) */
    })
  }
  fetchData()
  }

  //Function for changing res capacity
  toggleCapacity(e, keyString) {
    e.preventDefault();
    switch (keyString) {
      case 'total':
        {
          this.setState({ resDetailTag: "Total Capacity" })
          this.setState({ resCapacity: this.state.resDetails.Capacity })
        }
        break
      case 'occupied':
        {
          this.setState({ resDetailTag: "Currently Occupied" })
          this.setState({ resCapacity: this.state.resDetails.Occupied })
        }
        break
      case 'available':
        {
          this.setState({ resDetailTag: "Currently Available" })
          this.setState({ resCapacity: this.state.resDetails.Capacity - this.state.resDetails.Occupied })
        }
    }
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
        <div className="page-loader-wrapper" style={{ display: this.state.isLoad ? 'block' : 'none' }}>
          <div className="loader">
            <div className="m-t-30"><img src={localStorage.getItem('clientLogo')} width="170" height="70" alt="Lucid" /></div>
            <p>Please wait...</p>
          </div>
        </div>
          <div className="container-fluid">
            <div className="row clearfix">
              <div className="w-100 p-3">
                <div className="body w-100 p-3">
                  <div>
                    <div className="has-bg-img w-100 p-3" id="top-div"
                      style={{
                        backgroundImage: 'url(' + this.state.resDetails.ResidencePhoto + ')',
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
                      <h1 className=""
                        style={{
                          color: "white",
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignContent: 'center'
                        }}
                      >
                        {this.state.resDetails.ResidenceName}
                      </h1>
                      <hr style={{
                        border: '1px solid green',
                        width: '100%'
                      }} />
                      <span className=""
                        style={{
                          color: "white",
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignContent: 'center'
                        }}>
                        {this.state.resDetails.ResidenceLocation}
                      </span>

                    </div>

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
                      <p>{this.state.resDetails.ResidenceDescription}</p>
                    </div>
                  </div>

                  <div className="row">
                    <div className=" col-3">
                      <div className="card profile-header pt-3">
                          <h3>Occupancy</h3>
                        <div className="header">
                          <h2>{this.state.resDetailTag}</h2>
                          <Dropdown as="ul" className="header-dropdown">
                            <Dropdown.Toggle
                              variant="success"
                              as="li"
                              id="dropdown-basic"
                            >
                              <Dropdown.Menu
                                as="ul"
                                className="dropdown-menu dropdown-menu-right"
                              >
                                <li>
                                  <a
                                    href="#!"
                                    onClick={(e) => this.toggleCapacity(e, 'total')}
                                  >Total Capacity</a>
                                </li>

                                <li>
                                  <a
                                    href="#!"
                                    onClick={(e) => this.toggleCapacity(e, 'occupied')}
                                  >Currently Occupied</a>
                                </li>

                                <li>
                                  <a
                                    href="#!"
                                    onClick={(e) => this.toggleCapacity(e, 'available')}
                                  >Currently Available</a>
                                </li>
                              </Dropdown.Menu>
                            </Dropdown.Toggle>
                          </Dropdown>
                        </div>
                        <div className="body text-center"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignContent: 'center'
                          }}
                        >
                          <div className="rounded-circle margin-0"
                            style={{
                              width: "120px",
                              height: "120px",
                              backgroundColor: "purple",
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              alignContent: 'center'
                            }}
                          >
                            <h4 className="margin-0"
                              style={{
                                color: "white",
                                fontSize: "50px",
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignContent: 'center'
                              }}
                            >{this.state.resCapacity}</h4>
                          </div>

                          <h4 className="margin-0">Beds</h4>
                          
                        </div>
                      </div>
                    </div>

                    <div className="col-9">
                      <div className="card profile-header pt-3">
                        <h3 >
                          Residence Amenitis
                        </h3>
                        <div className="row">
                        {this.state.amenities.map((amenity, index) => (
                          <>
                          <div className="col-3">
                            <img src= {'icons/' + amenity.RubixResidencesAmenitieImageKey}
                          style={{
                            width: "70px",
                            height: "70px"
                          }}
                          ></img>
                          <br></br>
                            <span>{amenity.RubixResidencesAmenitieDescription}</span>
                            </div>
                            </>
                          ))}
                          </div>
                          
                        
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-7">
                      <div className="card">
                        <ResManagerCard
                          Name={this.state.resDetails.ResidenceManagerName}
                          Surname={this.state.resDetails.ResidenceManagerSurname}
                          Email={this.state.resDetails.ResidenceManagerEmail}
                          Office={this.state.resDetails.ResidenceManagerOffice}
                          Bio={this.state.resDetails.ResidenceManagerShortBio}
                          Phone={this.state.resDetails.ResidenceManagerPhoneNumber}
                          ProfilePic={this.state.resManagerPic}
                        />
                      </div>
                    </div>

                    <div className=" col-5">
                      <div className="card">
                        <div className="header text-center">
                          <h3>Our Socials</h3>
                        </div>
                        {
                          this.state.socials.map((social, index) =>(
                            <div className="row col-8">
                            <img className="pl-3 pr-2 pb-2" src={"icons/" + social.ResidenceSocialImage}></img>
                            <a  className="pt-1" href={social.ResidenceSocialLink}><span>CJ Students</span></a>
                          </div>
                          ))
                        }

                       {/*  <div>
                          <div className="row col-8">
                            <img className="pl-3" src='icons/fb.png'></img>
                            <span className="pt-2">Rubix Intake System</span>
                          </div>

                          <div className="row col-8">
                            <img className="pl-3" src='icons/insta.png'></img>
                            <span className="px-0">Rubix Intake System</span>
                          </div>

                          <div className="row col-8">
                            <img className="pl-3" src='icons/twitter.png'></img>
                            <span className="px-0">Rubix Intake System</span>
                          </div>
                        </div> */}

                      </div>
                    </div>
                  </div>

                  <div className="card text-center pt-3">
                    <h2>Our Gallery</h2>
                    <div style={{
                    
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center'
                  }}>
                  <ImageGallery 
                   items={this.state.gallery.length == 0
                   ? images
                   : this.state.gallery
                   } />
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

export default connect(mapStateToProps, {})(Residence);
