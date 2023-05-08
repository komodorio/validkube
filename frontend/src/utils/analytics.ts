import {randomUUID} from "crypto";


const TRACK_EVENT_TYPE = "track"
const IDENTIFY_EVENT_TYPE = "identify"
const BASE_ANALYTIC_MSG: RequestInit = {
    method: "POST",
    mode: "cors" as RequestMode,
    cache: "no-cache" as RequestCache,
    headers: {
        "Content-Type": "application/json",
        "api-key": "komodor.analytics@admin.com",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer" as ReferrerPolicy,
}


function createBody(
    segmentCallType: string,
    params: { [p: string]: unknown },
    eventName: string | undefined
): Record<string, unknown> {
    const data: Record<string, unknown> = {userId: getUserId()};
    if (segmentCallType === IDENTIFY_EVENT_TYPE) {
        data["traits"] = params;
    } else if (segmentCallType === TRACK_EVENT_TYPE) {
        if (!eventName) {
            throw new Error("no eventName parameter on segment track call");
        }
        data["properties"] = params;
        data["eventName"] = eventName;
    }
    return data;
}


export default function sendToSegment(
    eventName: string,
    properties: { [p: string]: unknown }) {
    sendToSegmentThroughAPI(eventName, properties);
}

function sendToSegmentThroughAPI(
    eventName: string,
    properties: { [p: string]: unknown }
) {
    sendData(properties, TRACK_EVENT_TYPE, eventName);
}

function sendData(
    data: { [p: string]: unknown },
    eventType: string,
    eventName?: string
): Promise<Response | undefined> {
    const body = createBody(eventType, data, eventName);
    return fetch(`https://api.komodor.com/analytics/segment/${eventType}`, {
        ...BASE_ANALYTIC_MSG,
        body: JSON.stringify(body),
    });
}

const getUserId = (() => {
    let userId: string = ''
    return () => {
        if (!userId) {
            userId = randomUUID();
        }
        return userId;
    };
})();
