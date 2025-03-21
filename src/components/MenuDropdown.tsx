import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { Blend, Landmark, Menu, Newspaper, ShieldUser, UtilityPole, Link as LinkIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CustomDropdownItem } from "./CustomDropdownItem";
import { Separator } from "./Separator";
import {useUserContext} from "../store/user.ts";
import {Dispatch, Fragment, SetStateAction} from "react";
import {Link} from "../@types/Link";
import {CustomDropdownLink} from "./CustomDropdownLink.tsx";
import * as Dialog from "@radix-ui/react-dialog";
import {LinksDialog} from "./Dialogs/LinksDialog.tsx";
import {useQueryClient} from "@tanstack/react-query";
interface Props 
{
    setIsMenuDropdownOpen : Dispatch<SetStateAction<boolean>>;
    isMenuDropdownOpen: boolean;
    isMobile? : boolean;
}
export const MenuDropdown = ({ isMenuDropdownOpen, setIsMenuDropdownOpen, isMobile } : Props) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const links = queryClient.getQueryData(['links']) as Link[] ?? [];
    const user = useUserContext(state => state.user);
    return (
        <Dropdown.Root
            modal={false}
            open={isMenuDropdownOpen}
            onOpenChange={setIsMenuDropdownOpen}
        >
            <Dropdown.Trigger 
                className={`${isMobile ? "bg-zinc-100 w-full items-center justify-center" : ""} hover:bg-blue-200 transition duration-150 py-9 px-10`}
            >
                <Menu />
            </Dropdown.Trigger>
            <Dropdown.Content className="flex flex-col gap-2 -top-10 border bg-zinc-100 -mt-5 border-zinc-200 shadow-lg rounded-lg p-2">
                <CustomDropdownItem 
                    onClick={() => navigate('/noticias')} 
                    title="Notícias" 
                    icon={Newspaper} 
                />
                <Separator />
                <CustomDropdownItem 
                    onClick={() => navigate('/governo')} 
                    title="Governo" 
                    icon={Landmark} 
                />
                <Separator />
                <CustomDropdownItem 
                    onClick={() => navigate('/municipio')} 
                    title="Município" 
                    icon={UtilityPole} 
                />
                <Separator />
                <CustomDropdownItem 
                    onClick={() => navigate('/')}
                    title="Transparência" 
                    icon={Blend} 
                />
                {
                    links && links.length > 0 && (
                        links.map((link) => (
                            <Fragment key={link.id_link}>
                                <Separator />
                                <CustomDropdownLink
                                    to={link.url_link}
                                    title={link.nm_link}
                                    icon={ShieldUser}
                                />
                            </Fragment>
                        ))
                    )
                }

                {
                    !user ? (
                        <>
                            <Separator />
                            <CustomDropdownItem
                                onClick={() => navigate('/login')}
                                title="Acesso administrativo"
                                icon={ShieldUser}
                            />

                        </>
                    ) : (
                        <>
                            <Separator />
                            <Dialog.Root>
                                <Dialog.Trigger className={"p-2 items-center justify-between gap-2 flex hover:bg-zinc-200  hover:outline-none transition duration-150 cursor-pointer rounded-md"}>
                                    <span> Links</span> <LinkIcon size={18}/>
                                </Dialog.Trigger>
                                <Dialog.Portal>
                                    <Dialog.Overlay className={"z-50 fixed inset-0 w-screen bg-zinc-900/30 backdrop-blur-md"}/>
                                    <LinksDialog links={links ?? []}/>
                                </Dialog.Portal>
                            </Dialog.Root>
                        </>
                    )
                }


            </Dropdown.Content>
        </Dropdown.Root>
    );
}

