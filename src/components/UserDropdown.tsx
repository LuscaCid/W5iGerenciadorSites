import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { CustomDropdownItem } from './CustomDropdownItem';
import { LogOut, Mail } from 'lucide-react';
import { useUserContext } from '../store/user';
import { useNavigate } from 'react-router-dom';
import { Separator } from './Separator';
import {UserAvatar} from "./UserAvatar.tsx";

export const UserDropdown = () => {
    const { user, setUser } = useUserContext();
    const navigate = useNavigate();
    const handleLogout = () => {
        setUser(undefined);
        localStorage.removeItem('@gerenciador-user')
        navigate('/');
    }
    return (
        <Dropdown.Root
            modal={false}
        >
            <Dropdown.Trigger 
                className='flex items-center gap-2'
            >
                <UserAvatar
                    title={`Olá, ${user?.nm_usuario}`}
                />
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