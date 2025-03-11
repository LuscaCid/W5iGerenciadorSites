import * as Dropdown from '@radix-ui/react-dropdown-menu';
import DefaultUser from "../../public/default-avatar.png";
import { CustomDropdownItem } from './CustomDropdownItem';
import { LogOut, Mail } from 'lucide-react';
import { useUserContext } from '../store/user';
import { useNavigate } from 'react-router-dom';
import { Separator } from './Separator';

export const UserDropdown = () => {
    const { user, setUser } = useUserContext();
    const navigate = useNavigate();
    const handleLogout = () => {
        setUser(undefined);
        navigate('/');
    }
    return (
        <Dropdown.Root
            modal={false}
        >
            <Dropdown.Trigger 
                asChild
                className='flex items-center gap-2'
            >
                <div
                    className='flex items-center gap-1  cursor-pointer'      
                >
                    <main
                        className='rounded-full h-12 w-12 hover:ring-[6px] outline-3 outline-zinc-50 contain-content shadow-lg hover:ring-blue-500 transition duration-150  flex items-center justify-center bg-zinc-50'   
                    >
                        <img src={DefaultUser} alt="Imagem do usuário"/>
                    </main>
                    <span className='select-none hover:underline'>Olá, {user?.nm_usuario}</span>

                </div>
            </Dropdown.Trigger>
            <Dropdown.Content className='rounded-lg shadow-lg bg-zinc-100 p-2 flex flex-col gap-2' >
                <CustomDropdownItem 
                    icon={Mail}
                    title={user!.nm_email}
                    onClick={() => console.log("email")}
                />
                <Separator />
                <CustomDropdownItem 
                    icon={LogOut}
                    title={"Sair"}
                    onClick={handleLogout}
                />
            </Dropdown.Content>
        </Dropdown.Root>
    );
}