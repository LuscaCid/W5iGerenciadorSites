import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { CustomDropdownItem } from './CustomDropdownItem';
import {Link as LinkIcon, LogOut, Mail} from 'lucide-react';
import { useUserContext } from '../store/user';
import { useNavigate } from 'react-router-dom';
import { Separator } from './Separator';
import {UserAvatar} from "./UserAvatar.tsx";
import {StorageKeys} from "../constants/StorageKeys.ts";
import * as Dialog from "@radix-ui/react-dialog";
import {LinksDialog} from "./Dialogs/LinksDialog.tsx";
import {Link} from "../@types/Link";
import {useQueryClient} from "@tanstack/react-query";

export const UserDropdown = () => {
    const { user, setUser } = useUserContext();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const links = queryClient.getQueryData(['links']) as Link[] ?? [];

    const handleLogout = () => {
        setUser(undefined);
        localStorage.removeItem(StorageKeys.user)
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
                <Separator />
                <Dialog.Root>
                    <Dialog.Trigger className={"p-2 items-center justify-between gap-2 flex hover:bg-zinc-200  hover:outline-none transition duration-150 cursor-pointer rounded-md"}>
                        <span> Links</span> <LinkIcon size={18}/>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <Dialog.Overlay className={"z-50 fixed inset-0 w-screen bg-zinc-900/30 backdrop-blur-md"}/>
                        <LinksDialog links={links}/>
                    </Dialog.Portal>
                </Dialog.Root>
            </Dropdown.Content>
        </Dropdown.Root>
    );
}