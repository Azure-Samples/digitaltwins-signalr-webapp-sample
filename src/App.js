import React, { Component } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr'
import ReactSpeedometer from "react-d3-speedometer"

export default class App extends Component {
    displayName = App.name

    constructor(props) {
        super(props);

        this.state = {
            signalRMessage: '',
            hubConnection: null,
            hubState: false,
        };
    }


    componentDidMount() {
        const hubConnection = new HubConnectionBuilder()
            .withUrl('<Azure Function Endpoint>')
            .build();

        this.setState({ hubConnection }, () => {
            this.setState({ hubState: true });
            this.state.hubConnection.start()
                .then(() => console.log('SignalR Started'))
                .catch(err => console.log('Error connecting SignalR - ' + err));

            this.state.hubConnection.on('newMessage', (message) => {
                const signalRMessage = message;
                this.setState({ signalRMessage });
            });
        });
    }

    render() {
        let page =
            <div style={{ marginLeft: '600px', marginTop: '200px' }}>
                <ReactSpeedometer
                    maxValue={100}
                    value={this.state.signalRMessage.temperatureInFahrenheit}
                    currentValueText={"Temperature(F): " + this.state.signalRMessage.temperatureInFahrenheit}
                    needleColor="black"
                    startColor="lightblue"
                    segments={10}
                    endColor="tomato"
                    width={500}
                />
            </div>

        let contents = !this.state.hubState
            ? <p><em>Loading...</em></p>
            : page

        return (
            contents
        );
    }
}
