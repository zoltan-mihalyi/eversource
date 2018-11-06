import { Express, Response } from 'express';
import { RTCDataChannel, RTCPeerConnection, RTCSessionDescriptionInit } from 'wrtc';
import { PeerInfo, PeerInfoCollector } from '../../../common/webrtc/PeerInfo';
import { Connection, Connector, MessageData } from '../protocol/net/Connector';
import { EventEmitter } from 'events';

export function registerWebRTCEndpoint(app: Express): Connector {
    const connector = new WebRTCConnector();

    app.get('/webrtc', (req, res) => {
        const dataStr = req.query.data;
        try {
            const peerInfo = JSON.parse(dataStr) as PeerInfo;
            connector.handle(peerInfo, res);
        } catch (e) {
            console.log(e);
            res.end();
        }
    });

    return connector;
}

class WebRTCConnector extends EventEmitter implements Connector {
    close() {
    }

    handle(peerInfo: PeerInfo, res: Response) {
        const connection = new RTCPeerConnection(); // TODO use params? : servers, pcConstraint

        connection.oniceconnectionstatechange = function (e) {
            console.log('ICE STATE', e);
        };

        connection.onconnectionstatechange = function (event) {
            console.log('STATE', connection.connectionState);
            // switch(connection.connectionState) {
            //     case "connected":
            //
            //         break;
            //     case "disconnected":
            //     case "failed":
            //         // One or more transports has terminated unexpectedly or in an error
            //         break;
            //     case "closed":
            //         // The connection has been closed
            //         break;
            // }
        };

        const collector = new PeerInfoCollector((peerInfo) => {
            res.end(JSON.stringify(peerInfo));
        });

        connection.onicecandidate = function (e) {
            console.log('onicecandidate', e);
            collector.onCandidate(e.candidate);
            // alert(e);
            // onIceCandidate(remoteConnection, e);
        };
        connection.ondatachannel = (e) => {
            console.log('DATA channel', e);

            const fakeConnection = new WebRTCConnection(connection, e.channel);

            this.emit('connection', fakeConnection);

            e.channel.onclose = (e) => {
                console.log('CLOSE', e)
            };

            e.channel.onmessage = (e) => {
                console.log('MSG', e);
                fakeConnection.emit('message', e.data);
            };

            // setInterval(() => {
            //     e.channel.send('HELLO')
            // }, 1000);
        };

        connection.setRemoteDescription(peerInfo.description);
        for (const candidate of peerInfo.candidates) {
            connection.addIceCandidate(candidate)
                .then(
                    function () {
                        console.log('ADD ICE SUCCESS!');
                    },
                    function (err) {
                        console.log('onAddIceCandidateError ', err);
                    }
                );
        }

        connection.createAnswer().then(
            gotDescription,
            onCreateSessionDescriptionError
        );

        function onCreateSessionDescriptionError(error: any) {
            console.error('Failed to create session description: ' + error.toString());
        }

        function gotDescription(desc: RTCSessionDescriptionInit) {
            connection.setLocalDescription(desc);
            console.log('Answer from remoteConnection \n' + desc.sdp);
            collector.setDescription(desc);
        }
    }
}

class WebRTCConnection extends EventEmitter implements Connection {
    bufferedAmount: number = 0;
    readyState: number = 1; // TODO

    constructor(private peerConnection: RTCPeerConnection, private channel: RTCDataChannel) {
        super();
    }

    close(): void {
        this.peerConnection.close();
    }

    ping(data: MessageData): void {
        this.emit('pong', Buffer.from(data as any)); //TODO
    }

    send(data: string): void {
        this.channel.send(data);
    }
}