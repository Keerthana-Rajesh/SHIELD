import * as Location from "expo-location";

const sendAlert = (message: string) => {
    console.log("Sending alert:", message);

    // later connect your contacts system here
};

const getLocation = async () => {

    let location = await Location.getCurrentPositionAsync({});

    return location.coords;

};

export const triggerLowRisk = async () => {

    const coords = await getLocation();

    const message = `Low Risk Alert!
Location:
https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;

    sendAlert(message);

};

export const triggerHighRisk = async () => {

    const coords = await getLocation();

    const message = `HIGH RISK ALERT!
Location:
https://maps.google.com/?q=${coords.latitude},${coords.longitude}`;

    sendAlert(message);

    console.log("Start camera and audio recording here");

};