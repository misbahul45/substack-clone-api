import z from 'zod'
export default class AuthValidations{
   static readonly register=z.object({
      name:z.string(),
      email:z.string().email({ message: 'Invalid email address' }),
      password:z.string().min(8),
      confirmPassword:z.string(),
   }).refine((data) => data.password === data.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

   static readonly login=z.object({
      email:z.string().email({ message: 'Invalid email address' }),
      password:z.string().min(8),
   })

   static readonly forgotPassword=z.object({
      email:z.string().email({ message: 'Invalid email address' }),
   })

   static readonly VerifyOtp=z.object({
      email:z.string().email({ message: 'Invalid email address' }),
      otp:z.number(),
   })

   static readonly updatePassword=z.object({
      email:z.string().email({ message: 'Invalid email address' }),
      password:z.string().min(8),
      confirmPassword:z.string(),
   }).refine((data) => data.password === data.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });
}

export type RegisterBody= z.infer<typeof AuthValidations.register>
export type LoginBody= z.infer<typeof AuthValidations.login>
export type VerifyOtpBody= z.infer<typeof AuthValidations.VerifyOtp>
export type UpdatePasswordBody= z.infer<typeof AuthValidations.updatePassword>