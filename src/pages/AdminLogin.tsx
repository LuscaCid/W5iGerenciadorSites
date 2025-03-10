import z from 'zod';
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback } from 'react';
import { HookFormInput } from '../UI/FormInput';
import { RectangleEllipsis, UserIcon } from 'lucide-react';
import { Typography } from '@mui/material';
import { Button } from '../UI/Button';
import { TextButton } from '../UI/TextButton';
const formSchema = z.object({
  nm_login : z.string(),
  nm_senha : z.string().min(8, { message : "A senha deve ter no mínimo 8 caracteres"})
});
type FormSchemaType = z.infer<typeof formSchema>;
export const AdminLogin = () => {
  const methods = useForm<FormSchemaType>({ resolver : zodResolver(formSchema) });
  
  const handleSubmitForm = useCallback(() => {

  }, []);
  const revokePassword = useCallback(() => {

  }, []);
  return (
    <div className="shadow-lg m-auto p-4 w-fit rounded-lg">
      <FormProvider {...methods}>
        <form 
          action=""
          className='w-fit flex flex-col gap-3 min-w-[600px] rounded-lg'
          onSubmit={methods.handleSubmit(handleSubmitForm)}
        >
          <Typography 
            variant='h4'
          >
            Login
          </Typography>
          <HookFormInput<keyof FormSchemaType>
            name='nm_login'
            id='nm_login'
            label='Credencias'
            requiredInput
            icon={UserIcon}
            placeholder='E-mail ou CPF'
          />
          <HookFormInput<keyof FormSchemaType>
            label="Entre com a senha"
            name='nm_senha'
            id='nm_senha'
            placeholder='Senha'
            requiredInput
            buttonPasswordVisible
            icon={RectangleEllipsis}
            type='password'
          />
        
          <TextButton 
            title='Esqueci minha senha'
            className='hover:underline'
            onClick={revokePassword}
            type='button'
          />
          <Button 
            title='Entrar'
            onClick={handleSubmitForm}
            className=''
            type='submit'
          />
        </form>
      </FormProvider>
      


    </div>
  )
}
