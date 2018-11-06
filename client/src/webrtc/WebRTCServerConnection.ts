import { ajax } from '../utils';
import { PeerInfo, PeerInfoCollector } from '../../../common/webrtc/PeerInfo';

export interface AbstractNetConnection {
    onopen: (() => void) | null;
    onclose: (() => void) | null;
    onmessage: ((e: MessageEvent) => void) | null;

    close(): void;

    send(data: string): void;
}

export class WebRTCServerConnection implements AbstractNetConnection {
    onopen: (() => void) | null = null;
    onclose: (() => void) | null = null;
    onmessage: ((e: MessageEvent) => void) | null = null;

    private dataChannel: RTCDataChannel;

    constructor(private url: string) {
        const connection = new RTCPeerConnection();

        (window as any).conn = connection;

        connection.oniceconnectionstatechange = (e: Event) => {
            switch (connection.iceConnectionState) {
                case 'failed':
                    if (this.onclose) {
                        this.onclose();
                    }
            }
        };

        const peerInfoCollector = new PeerInfoCollector((peerInfo => {
            ajax(`${this.url}/webrtc?data=${JSON.stringify(peerInfo)}`, (response) => { // TODO handle error and close
                const serverPeerInfo = JSON.parse(response) as PeerInfo;

                connection.setRemoteDescription(serverPeerInfo.description);
                for (const candidate of serverPeerInfo.candidates) {
                    connection.addIceCandidate(candidate);
                }
            });
        }));

        connection.onicecandidate = function (event) {
            peerInfoCollector.onCandidate(event.candidate);
        };

        const dataChannel = connection.createDataChannel('data');
        this.dataChannel = dataChannel;
        dataChannel.onopen = (e) => {
            if (this.onopen) {
                this.onopen();
            }
        };

        dataChannel.onclose = (e) => {
            // TODO console.log('CLOSE', e)
        }; //onSendChannelStateChange;


        dataChannel.onmessage = (e) => {
            if (this.onmessage) {
                this.onmessage(e);
            }
        };

        connection.createOffer().then((desc) => { // TODO miért kell a createChannel után???
            connection.setLocalDescription(desc).then(() => {
                peerInfoCollector.setDescription(desc);
            });
        });
    }

    close() {
        // TODO
        throw new Error('IMPL');
    }

    send(data: string) {
        this.dataChannel.send(data);
    }
}
