import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { CustomDropdownItem } from './CustomDropdownItem';
import {Link as LinkIcon, LogOut, Mail, RectangleHorizontal} from 'lucide-react';
import { useUserContext } from '../store/user';
import { useNavigate } from 'react-router-dom';
import { Separator } from './Separator';
import {UserAvatar} from "./UserAvatar.tsx";
import {StorageKeys} from "../constants/StorageKeys.ts";
import * as Dialog from "@radix-ui/react-dialog";
import {LinksDialog} from "./Dialogs/LinksDialog.tsx";
import {CustomOverlay} from "./Dialogs/CustomOverlay.tsx";
import {BannerDialog} from "./Dialogs/BannerDialog.tsx";

export const UserDropdown = () => {
    const { user, setUser } = useUserContext();
    const navigate = useNavigate();

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
                    title={`Olá, ${user?.nm_user}`}
                />
            </Dropdown.Trigger>
            <Dropdown.Content className='rounded-lg shadow-lg bg-zinc-100 dark:bg-zinc-800 p-2 flex flex-col gap-2' >
                <CustomDropdownItem 
                    icon={Mail}
                    title={user!.nm_email}
                />

                <Separator />
                <Dialog.Root>
                    <Dialog.Trigger className={"p-2 items-center justify-between gap-2 flex hover:bg-zinc-200 dark:hover:bg-zinc-900  hover:outline-none transition duration-150 cursor-pointer rounded-md"}>
                        <span>Links</span> <LinkIcon size={18}/>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <CustomOverlay />
                        <LinksDialog/>
                    </Dialog.Portal>
                </Dialog.Root>
                <Separator />
                <Dialog.Root>
                    <Dialog.Trigger
                        className={"p-2 items-center justify-between gap-2 flex hover:bg-zinc-200 dark:hover:bg-zinc-900  hover:outline-none transition duration-150 cursor-pointer rounded-md"}
                    >
                        <span>Banners</span> <RectangleHorizontal  size={18}/>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <CustomOverlay />
                        <BannerDialog/>
                    </Dialog.Portal>
                </Dialog.Root>
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