export type Position = {
    latitude: number 
    longitude: number
}

export interface User {
    id: number
    username: string
    profileUrl: string 
    position: Position 
    geohash: string
    phoroUrl?: string 
    email?: string
    techs?: Array<string>
}

export type ListUserParams = {
    type: keyof User
    start: any;
    end: any;
} | undefined