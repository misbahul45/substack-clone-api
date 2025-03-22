import { z } from "zod";

export class PostsValidations {
    static createPost =z.object({
        title:z.string().min(1, { message: "Title tidak boleh kosong" }),
        body:z.string().min(1, { message: "Body tidak boleh kosong" }),
        authorId:z.string().min(1, { message: "AuthorId tidak boleh kosong" }),
        
    })
}