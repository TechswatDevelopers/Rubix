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
import {Helmet} from "react-helmet";
import {
  topProductOption,
  topRevenueOption,
  topRevenueMonthlyOption,
  saleGaugeOption,
  dataManagetOption,
  sparkleCardData,
} from "../../Data/DashbordData";
import {
  updateLoadingMessage,
  updateLoadingController,} from '../../actions';
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import useMediaQuery from '@mui/material/useMediaQuery';
const images = [
  {
    original: require("../../assets/images/stock.png"),
    thumbnail: require("../../assets/images/stock.png"),
  },
];
function useIsMobile() {
  const isMobile = useMediaQuery({ query: '(max-width: 1000px)' });
  console.log("Is Mobile: ", isMobile)
  return isMobile
}
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
      pageTitle: 'Residence Info.',
    }
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    //Set Loading Screen ON
    this.props.updateLoadingController(true);
    this.props.updateLoadingMessage("Loading Residence Information...");


    //Set timer for loading screen
    setTimeout(() => {
      this.props.updateLoadingController(false);
    }, 3000);


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
          console.log("Student Res Details", response)
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
    setTimeout(() => {
      
    postData()
    }, 2000);
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
        else {
          this.setState({
            resManagerPic: 'https://rubiximages.cjstudents.co.za:449/' +  data.post[i].filename
          })
          localStorage.setItem('reManagerPic', 'https://rubiximages.cjstudents.co.za:449/' +  data.post[i].filename)
        }
      }
      /* this.setState({
        gallery: data.post
      }) */
      console.log('In the gallery: ', this.state.gallery)
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
        <Helmet>
                <meta charSet="utf-8" />
                <title>{this.state.pageTitle}</title>
            </Helmet>
        <div>
        
        <div
          className="page-loader-wrapper"
          style={{ display: this.props.MyloadingController ? "block" : "none" }}
        >
          <div className="loader">
            <div className="m-t-30">
              <img
                src={localStorage.getItem('clientLogo')}
                width="20%"
                height="20%"
                alt=" "
              />
            </div>
            <p>{this.props.loadingMessage}</p>
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

                    <div className="login-info shadow-sm p-3 mb-4 bg-white rounded">
                      <h3
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignContent: 'center'
                        }}
                      >About Us</h3>
                      {/* <button onClick={()=>{}}>Check Mobile</button> */}
                      <p>{this.state.resDetails.ResidenceDescription}</p>
                    </div>
                  </div>

                  <div className="row">
                    

                    <div className="px-3">
                      <div className="card profile-header shadow-sm p-3">
                        <h3 >
                          Residence Amenitis
                        </h3>
                        <div className="row">
                        {this.state.amenities.map((amenity, index) => (
                          <>
                          <div className="col-3">
                            {
                              localStorage.getItem('clientID') != 1
                              ? <img src= {amenity.RubixResidencesAmenitieDescription} style={{
                                width: "120px",
                                height: "120px"
                              }}></img>

                             : <img src= {'icons/' + amenity.RubixResidencesAmenitieImageKey}
                          style={{
                            width: "70px",
                            height: "70px"
                          }}
                          ></img>
                          
                          }
                          <br></br>
                            {
                              localStorage.getItem('clientID') != 1
                              ? null
                              : <span>{amenity.RubixResidencesAmenitieDescription}</span>}
                            </div>
                            </>
                          ))}
                          </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-6">
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
                              backgroundColor: "blue",
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

                          <h4 className="margin-0 pt-3">Beds</h4>
                          
                        </div>
                      </div>
                    </div>

                    <div className=" col-3">
                      <div className="card">
                        <div className="header text-center">
                          <h3>Our Socials</h3>
                        </div>
                        {
                          this.state.socials.map((social, index) =>(
                            <div className="row col-8">
                            <img className="pl-3 pr-2 pb-2" src={"icons/" + social.ResidenceSocialImage}
                            style={{
                              height: "30px",
                              width: "50px"
                            }}
                            ></img>
                            <a  className="" href={social.ResidenceSocialLink}><span>{this.state.resDetails.ClientName}</span></a>
                          </div>
                          ))
                        }

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
                   items={
                     this.state.gallery.length == 0
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

const mapStateToProps = ({ ioTReducer, navigationReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,

  MyloadingController: navigationReducer.loadingController,
  loadingMessage: navigationReducer.loadingMessage,
});

export default connect(mapStateToProps, {
  updateLoadingMessage,
  updateLoadingController,})(Residence);
