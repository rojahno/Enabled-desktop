import React from 'react'
import SetProfile from './../components/setProfile'
import ConnectedIndicator from './../components/connectedIndicator'

class TestPage extends React.Component{
    constructor(props: any){
        super(props);
    }
    render(){
        return(
            <div className = "testnavn">
                <div>
                    <SetProfile/>
                </div>
                <div className = 'phoneIndicator'>
                    <ConnectedIndicator/>
                </div>
            </div>
        )
    }
}
export default TestPage