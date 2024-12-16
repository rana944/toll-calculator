const API_URL = 'https://crudcrud.com/api';
const API_KEY = 'af60e5b7c9d5485d89b728147c2c5ec4'; // Please change the key here

export const createTrip = async (payload: Record<string, string | number>) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    console.log("Payload", payload)
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(payload),
    };
    return new Promise(async (resolve, reject) => {
        try {
            const textResponse = await fetch(`${API_URL}/${API_KEY}/trips`, requestOptions);
            const jsonResponse = await textResponse.json();
            resolve(jsonResponse);
        } catch (e: any) {
            console.error('Error', e?.message);
            reject(e?.message);
        }
    })
}

export const getTripDetails = (tripID: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };
    return new Promise(async (resolve, reject) => {
        try {
            const textResponse = await fetch(`${API_URL}/${API_KEY}/trips/${tripID}`, requestOptions);
            const jsonResponse = await textResponse.json();
            resolve(jsonResponse);
        } catch (e: any) {
            console.error('Error', e?.message);
            reject(e?.message);
        }
    })
}

export const updateTripDetails = (tripID: string, payload: Record<string, string | number>) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: JSON.stringify(payload),
    };

    console.log("Payload", payload, "Trip ID", tripID);
    return new Promise(async (resolve, reject) => {
        try {
            const textResponse = await fetch(`${API_URL}/${API_KEY}/trips/${tripID}`, requestOptions);
            resolve('Success')
        } catch (e: any) {
            console.error('Error', e);
            reject(e?.message);
        }
    })
}

export const deleteTrip = (tripID: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
    };
    return new Promise(async (resolve, reject) => {
        try {
            await fetch(`${API_URL}/${API_KEY}/trips/${tripID}`, requestOptions);
            resolve('Sucess');
        } catch (e: any) {
            console.error('Error', e?.message);
            reject(e?.message);
        }
    })
}