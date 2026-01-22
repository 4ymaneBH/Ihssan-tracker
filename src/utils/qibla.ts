import { Coordinates, Qibla } from 'adhan';

export const calculateQibla = (latitude: number, longitude: number): number => {
    const coordinates = new Coordinates(latitude, longitude);
    return Qibla(coordinates);
};
