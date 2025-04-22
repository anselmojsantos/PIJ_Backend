import { Prisma } from "@prisma/client";
import { prisma } from "../../libs/prisma";
import * as bcrypt from 'bcrypt';

export const createUser = async(data: Prisma.logdashCreateInput)=>{
    try{
      
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(data.password, salt);

        const user = await prisma.logdash.create({
            data:{
                ...data,
                password:hash
            }
        });
        return {user:true};
    }catch(error){
        return false;
    }               
}

