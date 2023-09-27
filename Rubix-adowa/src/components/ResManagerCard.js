import React from "react";
import User from "../assets/images/user.png";
import Avatar1 from "../assets/images/xs/avatar1.jpg";
import Avatar2 from "../assets/images/xs/avatar2.jpg";
import Avatar3 from "../assets/images/xs/avatar3.jpg";
import Avatar4 from "../assets/images/xs/avatar4.jpg";
import Avatar5 from "../assets/images/xs/avatar5.jpg";

class ResManagerCard extends React.Component {
  render() {
    const { Name, Surname, Email, Office, Bio, Phone, ProfilePic } = this.props;
    return (
      <div className="body">
        <div className="text-left">
          <div className="row">
            <div>
          <img src={ProfilePic == null || ProfilePic == ''
        ? "user.png"
        : ProfilePic
        } className="rounded-circle m-b-0 pl-4" alt="" 
          style={{
            height: "150px",
            justifyContent: "center",
            alignItems: 'center',
            alignContent: 'center'
          }}
          />
          <h4 className="m-b-0 pl-3">
              {Name} {Surname}
            </h4>
          </div>
          
          <div>
            <h2 className="m-b-0">
              Res Manager
            </h2>
            
            {/* <span>
              <strong>Office: </strong>
              {Office}
            </span> 

            <br></br>*/}
           <span>
              <strong>Email: </strong>
              {Email}
            </span>

            <br></br>
            <span>
              <strong>Phone No: </strong>
              {Phone}
            </span>
          </div>
          </div>

          
        </div>
        <hr />
        <p>
          {Bio}
        </p>
        
      </div>
    );
  }
}

export default ResManagerCard;
