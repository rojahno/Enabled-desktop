import React, { useState, useEffect } from 'react';
import {Cortex} from './../modules/cortex_code_example'

class frontPage extends React.Component {
    
    state = {
        count: 0,
        profiles:  "",
    }

    async componentDidMount(){
        /*
    let socketUrl = 'wss://localhost:6868'
    let user = {
        "license": "",
        "clientId": "0wyWnYNd61cedWF0Bp7AbZ10ogKlpa6EvgsH4DCV",
        "clientSecret": "HFxX7S8qWPVF7DC5nVqMoIgkBNAYAvy78c759qWHbSnJuV9IvepnTI6EXHjoPxZc1wpAwHZGIiZHj1S8JNZTyNWENQ91Kn3YxFubw3obcMPvOUIuzuGJXFD86MN4kRcQ",
        "debit": 1
    };

    try{
    let cortex = new Cortex(user, socketUrl);
    console.log(69);
    const profiles = await cortex.getProfiles();
    console.log(profiles);
    this.setState({profiles: await cortex.getProfiles()});
    console.log("typeof: "+typeof profiles);
    }
    catch(error){
        console.log("Error: "+ error);
        }
        */
        const profiles = await this.getHeadsethInfo();
        this.setState({profiles:profiles});

    }

     async getHeadsethInfo(){
        let socketUrl = 'wss://localhost:6868'
        let user = {
            "license": "",
            "clientId": "0wyWnYNd61cedWF0Bp7AbZ10ogKlpa6EvgsH4DCV",
            "clientSecret": "HFxX7S8qWPVF7DC5nVqMoIgkBNAYAvy78c759qWHbSnJuV9IvepnTI6EXHjoPxZc1wpAwHZGIiZHj1S8JNZTyNWENQ91Kn3YxFubw3obcMPvOUIuzuGJXFD86MN4kRcQ",
            "debit": 1
        };
        let cortex = new Cortex(user, socketUrl);
        
        console.log("before await")
        let profiles = await cortex.getProfiles();
        console.log("after await:" + profiles);
        console.log("profiles:" + profiles);
        return profiles;

    };

    incrementCount = ()=> {
        // Note: this will *not* work as intended.
        this.setState({count: this.state.count + 1});
      }



   render() {
    return(
        <div>
        <div className="Hello">
        <h1>{this.state.profiles}</h1>
            <button onClick={this.getHeadsethInfo}>
                se shit
            </button>
            <button onClick={this.getHeadsethInfo}>
                {this.state.profiles}
            </button>
            <ul>
        </ul>
        </div>
      </div>
    )
   }
}

export default frontPage;