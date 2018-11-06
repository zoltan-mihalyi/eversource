declare module 'wrtc' {

    interface Event {
        // TODO
    }

    type RTCPeerConnectionState = "new" | "connecting" | "connected" | "disconnected" | "failed" | "closed";

    interface EventInit {
        // TODO
    }

    interface RTCIceCandidate {
        readonly candidate: string;
        // TODO
    }

    interface RTCIceCandidateInit {
        candidate?: string;
        sdpMLineIndex?: number | null;
        sdpMid?: string | null;
        usernameFragment?: string;
    }

    interface RTCPeerConnectionIceEventInit extends EventInit {
        candidate?: RTCIceCandidate | null;
        url?: string | null;
    }

    interface RTCPeerConnectionIceEvent extends Event {
        readonly candidate: RTCIceCandidate | null;
        readonly url: string | null;
    }

    interface EventTarget {
        //
    }

    interface MessageEvent extends Event {
        readonly data: any;
        //
    }

    interface RTCErrorEvent extends Event {
        //
    }


    interface RTCDataChannel extends EventTarget {
        binaryType: string;
        //
        onclose: ((this: RTCDataChannel, ev: Event) => any) | null;
        onerror: ((this: RTCDataChannel, ev: RTCErrorEvent) => any) | null;
        onmessage: ((this: RTCDataChannel, ev: MessageEvent) => any) | null;
        onopen: ((this: RTCDataChannel, ev: Event) => any) | null;

        send(data: string): void;

    }

    interface RTCDataChannelEvent extends Event {
        readonly channel: RTCDataChannel;
    }

    interface RTCOfferOptions{
        //
    }
    type RTCSdpType = "offer" | "pranswer" | "answer" | "rollback";

    interface RTCSessionDescriptionInit {
        sdp?: string;
        type: RTCSdpType;
    }


    interface RTCPeerConnection {
        readonly connectionState: RTCPeerConnectionState;
        // readonly currentLocalDescription: RTCSessionDescription | null;
        // readonly currentRemoteDescription: RTCSessionDescription | null;
        // readonly iceConnectionState: RTCIceConnectionState;
        // readonly iceGatheringState: RTCIceGatheringState;
        // readonly idpErrorInfo: string | null;
        // readonly idpLoginUrl: string | null;
        // readonly localDescription: RTCSessionDescription | null;
        onconnectionstatechange: ((this: RTCPeerConnection, ev: Event) => any) | null;
        ondatachannel: ((this: RTCPeerConnection, ev: RTCDataChannelEvent) => any) | null;
        onicecandidate: ((this: RTCPeerConnection, ev: RTCPeerConnectionIceEvent) => any) | null;
        // onicecandidateerror: ((this: RTCPeerConnection, ev: RTCPeerConnectionIceErrorEvent) => any) | null;
        oniceconnectionstatechange: ((this: RTCPeerConnection, ev: Event) => any) | null;
        // onicegatheringstatechange: ((this: RTCPeerConnection, ev: Event) => any) | null;
        // onnegotiationneeded: ((this: RTCPeerConnection, ev: Event) => any) | null;
        // onsignalingstatechange: ((this: RTCPeerConnection, ev: Event) => any) | null;
        // onstatsended: ((this: RTCPeerConnection, ev: RTCStatsEvent) => any) | null;
        // ontrack: ((this: RTCPeerConnection, ev: RTCTrackEvent) => any) | null;
        // readonly peerIdentity: Promise<RTCIdentityAssertion>;
        // readonly pendingLocalDescription: RTCSessionDescription | null;
        // readonly pendingRemoteDescription: RTCSessionDescription | null;
        // readonly remoteDescription: RTCSessionDescription | null;
        // readonly sctp: RTCSctpTransport | null;
        // readonly signalingState: RTCSignalingState;
        addIceCandidate(candidate: RTCIceCandidateInit | RTCIceCandidate): Promise<void>;
        // addTrack(track: MediaStreamTrack, ...streams: MediaStream[]): RTCRtpSender;
        // addTransceiver(trackOrKind: MediaStreamTrack | string, init?: RTCRtpTransceiverInit): RTCRtpTransceiver;
        close(): void;
        createAnswer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit>;
        // createDataChannel(label: string, dataChannelDict?: RTCDataChannelInit): RTCDataChannel;
        // createOffer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit>;
        // getConfiguration(): RTCConfiguration;
        // getIdentityAssertion(): Promise<string>;
        // getReceivers(): RTCRtpReceiver[];
        // getSenders(): RTCRtpSender[];
        // getStats(selector?: MediaStreamTrack | null): Promise<RTCStatsReport>;
        // getTransceivers(): RTCRtpTransceiver[];
        // removeTrack(sender: RTCRtpSender): void;
        // setConfiguration(configuration: RTCConfiguration): void;
        // setIdentityProvider(provider: string, options?: RTCIdentityProviderOptions): void;
        setLocalDescription(description: RTCSessionDescriptionInit): Promise<void>;
        setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void>;
        // addEventListener<K extends keyof RTCPeerConnectionEventMap>(type: K, listener: (this: RTCPeerConnection, ev: RTCPeerConnectionEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        // addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        // removeEventListener<K extends keyof RTCPeerConnectionEventMap>(type: K, listener: (this: RTCPeerConnection, ev: RTCPeerConnectionEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        // removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }


    interface RTCConfiguration {
        // bundlePolicy?: RTCBundlePolicy;
        // certificates?: RTCCertificate[];
        // iceCandidatePoolSize?: number;
        // iceServers?: RTCIceServer[];
        // iceTransportPolicy?: RTCIceTransportPolicy;
        // peerIdentity?: string;
        // rtcpMuxPolicy?: RTCRtcpMuxPolicy;
    }

    export const RTCPeerConnection: {
        prototype: RTCPeerConnection;
        new(configuration?: RTCConfiguration): RTCPeerConnection;
        // generateCertificate(keygenAlgorithm: AlgorithmIdentifier): Promise<RTCCertificate>;
        // getDefaultIceServers(): RTCIceServer[];
    };
}
