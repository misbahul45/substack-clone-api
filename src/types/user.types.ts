export interface UserResponse {
    user:{
        id:string,
        email:string,
        name?:string | null,
        role:'USER' | 'WRITER' | 'ADMIN',
        isVerified:boolean,
        bio?:string | null,
        createdAt:Date
    }
}

export type AllUserResponse=UserResponse['user'][]