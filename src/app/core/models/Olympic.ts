// TODO: create here a typescript interface for an olympic country
/*
example of an olympic country:
{
    id: 1,
    country: "Italy",
    participations: []
}
*/
export interface Participation{
    id: number;
    year: number;
    city: string;
    medalsCount: number;
    athleteCount: number;
}
export interface Country{
    id: number;
    country: string;
    participations: Participation[];
}