import z from 'zod';
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback } from 'react';
import { HookFormInput } from '../UI/FormInput';
import { RectangleEllipsis, UserIcon } from 'lucide-react';
import { Button } from '../UI/Button';
import { TextButton } from '../UI/TextButton';
import {useAuth} from "../hooks/useAuth.ts";
import {useMutation} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {useUserContext} from "../store/user.ts";
import {useContextSelector} from "use-context-selector";
import {toastContext} from "../components/Toast.tsx";
import {AxiosError} from "axios";
import {StorageKeys} from "../constants/StorageKeys.ts";

const formSchema = z.object({
  nm_email : z.string(),
  nm_senha : z.string().min(5, { message : "A senha deve ter no mínimo 8 caracteres"})
});

export type FormSchemaType = z.infer<typeof formSchema>;

export const AdminLogin = () => {
  const { signIn } = useAuth();
  const setUser = useUserContext(state => state.setUser);
  const openToast = useContextSelector(toastContext, (c) => c.open)
  const navigate = useNavigate();
  const methods = useForm<FormSchemaType>({ resolver : zodResolver(formSchema) });

  const { mutateAsync : signInAsync, isPending } = useMutation({
    mutationFn : signIn,
    onSuccess :(data) => {
      const accessData = {
        nm_email : data.user.nm_email!,
        nm_usuario : data.user.nm_usuario!,
        access_token : data.access_token,
        id_usuario : data.user.id_usuario!
      }
      setUser(accessData);
      localStorage.setItem(StorageKeys.user, JSON.stringify(accessData));
      navigate('/noticias');
    },
    onError : (err : AxiosError) => {
      if (err.response)
      {
        openToast((err.response.data as { message: string }).message, "error");
      }
    }
  });

  const handleSubmitForm = useCallback(async (data : FormSchemaType) => {
    await signInAsync(data);
  }, [signInAsync]);
  const revokePassword = useCallback(() => {

  }, []);
  return (
    <div className="shadow-lg m-auto p-4 w-full lg:w-fit rounded-lg">
      <FormProvider {...methods}>
        <form
          name="form_admin"
          id="form_admin"
          className='w-full lg:w-fit flex flex-col gap-3  lg:min-w-[600px] rounded-lg'
          onSubmit={methods.handleSubmit(handleSubmitForm)}
        >
          <h1
              className={"text-2xl font-semibold pb-2 border-b border-zinc-200"}
          >
            Login
          </h1>
          <HookFormInput<keyof FormSchemaType>
            name='nm_email'
            id='nm_email'
            label='E-mail'
            requiredInput
            icon={UserIcon}
            placeholder='Entre com E-mail'
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
            disabled={isPending}
            isLoading={isPending}
            form='form_admin'
            type='submit'
          />
        </form>
      </FormProvider>
      


    </div>
  )
}
