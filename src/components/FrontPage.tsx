import React from 'react';

import { Cortex } from './../modules/cortex';


class frontPage extends React.Component {
    
    state = {
        count: 0,
        profiles:  [],
        loaded: [],
    }

    async componentDidMount(){
        await this.getHeadsethInfo();
       // await this.loadProfile();
     
        this.getStream();
        
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
        
        let profiles = await cortex.getProfiles();
        console.log("profiles:" + profiles);
        this.setState({profiles:profiles});
    };

    async loadProfile(){
        let socketUrl = 'wss://localhost:6868'
        let user = {
            "license": "",
            "clientId": "0wyWnYNd61cedWF0Bp7AbZ10ogKlpa6EvgsH4DCV",
            "clientSecret": "HFxX7S8qWPVF7DC5nVqMoIgkBNAYAvy78c759qWHbSnJuV9IvepnTI6EXHjoPxZc1wpAwHZGIiZHj1S8JNZTyNWENQ91Kn3YxFubw3obcMPvOUIuzuGJXFD86MN4kRcQ",
            "debit": 1
        };
        let cortex = new Cortex(user, socketUrl);
        
        let profiles = await cortex.loadProfile("D7");
        console.log("loaded:" + profiles);
        this.setState({loaded:profiles});
    };
    async getStream(){
        let socketUrl = 'wss://localhost:6868'
        let user = {
            "license": "",
            "clientId": "0wyWnYNd61cedWF0Bp7AbZ10ogKlpa6EvgsH4DCV",
            "clientSecret": "HFxX7S8qWPVF7DC5nVqMoIgkBNAYAvy78c759qWHbSnJuV9IvepnTI6EXHjoPxZc1wpAwHZGIiZHj1S8JNZTyNWENQ91Kn3YxFubw3obcMPvOUIuzuGJXFD86MN4kRcQ",
            "debit": 1
        };
        let cortex = new Cortex(user, socketUrl);
        

       

        let profiles = await cortex.live("D7");
        console.log("loaded:" + profiles);
        this.setState({loaded:profiles});
    };

   render() {
    return(
        <div>
        <div className="Hello">
        <ul className="profileButtons"> 
                {this.state.profiles.map((profile: React.ReactNode) => {
                    return <button>{profile}</button>
                })} 

            </ul>

            <p>
                {this.state.loaded}
            </p>
            <button onClick={this.getHeadsethInfo}>
                se shit
            </button>
            <button onClick={this.getHeadsethInfo}>
                
            </button>
            
        </div>
      </div>
    )
   }
}

export default frontPage;