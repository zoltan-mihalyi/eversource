interface RTCIceCandidate {
    readonly candidate: string;
}

type RTCSdpType = "offer" | "pranswer" | "answer" | "rollback";

interface RTCSessionDescriptionInit {
    sdp?: string;
    type: RTCSdpType;
}

export interface PeerInfo {
    candidates: RTCIceCandidate[];
    description: RTCSessionDescriptionInit;
}

export class PeerInfoCollector {
    private candidates: RTCIceCandidate[] = [];
    private description?: RTCSessionDescriptionInit;

    constructor(private callback: (peerInfo: PeerInfo) => void) {
    }

    onCandidate(candidate: RTCIceCandidate | null) {
        if (candidate === null) {
            this.check();
        } else {
            this.candidates.push(candidate);
        }
    }

    setDescription(description: RTCSessionDescriptionInit) {
        this.description = description;
        this.check();
    }

    private check() {
        if (this.candidates.length === 0 || !this.description) {
            return;
        }

        const peerInfo: PeerInfo = { candidates: this.candidates, description: this.description };
        this.callback(peerInfo);
    }
}