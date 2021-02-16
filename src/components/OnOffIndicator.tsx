import React, { useState, useEffect } from 'react';

class OnOffIndicator extends React.Component{
    state = {
        isConnected: true,
        text: '',
        state: ''
    }

    handleClick = () => {
        this.setState({
            text: this.state.isConnected ? 'Connected':'Disconnected',
            state: this.state.isConnected ? 'connected':'disConnected',
            isConnected: !this.state.isConnected
        })
    }

    render(){
        return(
            <div className = {this.state.state}>
                <div className ="indicator">
                    <span className = "dot">
                    </span>
                    <p className="indicatorText">
                        {this.state.text}
                    </p>
                </div>
                <button onClick={this.handleClick}>kule knappen</button>
            </div>
        )
    }
}

export default OnOffIndicator
