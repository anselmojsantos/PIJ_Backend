import { prisma } from "../../libs/prisma";
import * as bcrypt from 'bcrypt';

interface AuthResult {
    success: boolean;
    message?: string;
    user?: {
        id: number;
        name: string;
    };
  }

export const authUser = async(credentials:{email: string, password:string} ) : Promise<AuthResult> => {
    try{
        if(!credentials.email || !credentials.password){
            
        return {
                success: false,
                message: 'Email e senha são obrigatórios!'
            };
        }
        const user = await prisma.logdash.findUnique({
            where:{
                email:credentials.email
            }
        });
        if(!user){
            return {
                success: false,
                message: 'Email não encontrado. Verifique e tente novamente.'
            };
        };

        const passwordMatch = await bcrypt.compare(
            credentials.password, 
            user.password
        );

        if(!passwordMatch){
            return{
                success: false,
                message: 'Senha errada. Tente novamente.'
            }
        };
        const {password, ...userPassword} = user;
        
        return {
            success: true,
            message: 'Login realizada com sucesso!',
            user: {
                id: user.id,
                name: user.name
            }
        };
    }catch(error){
        return {
            success: false,
            message: 'Erro na autenticação. Tente novamente mais tarde!'
        };
    }
}