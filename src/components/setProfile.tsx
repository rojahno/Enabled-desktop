import React,{useState,useEffect} from 'react';

class SetProfile extends React.Component{
    state = {
        profileList: ['123',432,435,656,24,65,76,65,3],
    }
    render(){
        //REMEMBER KEY
        return(
            <div>
            <div className = 'sidebar'>
            <ul className = "profiles">
                
                {this.state.profileList.map((profile: React.ReactNode) => {
                    return(
                        <button className="profile">{profile}</button>
                    )
                })}
            </ul>
            <button className = "loadButton">Load Profiles</button>
            </div>
            </div>
        )
    }
}
export default SetProfile