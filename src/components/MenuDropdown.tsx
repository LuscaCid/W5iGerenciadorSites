import * as Dropdown from "@radix-ui/react-dropdown-menu";
import {
    Landmark,
    Menu,
    Newspaper,
    ShieldUser,
    UtilityPole,
    Link as LinkIcon,
    SquareArrowOutUpRight, RectangleHorizontal
} from "lucide-react";
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
import {CustomOverlay} from "./Dialogs/CustomOverlay.tsx";
import {BannerDialog} from "./Dialogs/BannerDialog.tsx";
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
                className={`${isMobile ? "bg-zinc-100  items-center py-1 px-2 justify-center" : "py-9 px-10"} hover:bg-blue-200 dark:hover:bg-blue-500 dark:bg-zinc-900 transition duration-150  `}
            >
                <Menu />
            </Dropdown.Trigger>
            <Dropdown.Content className="flex flex-col gap-2 -top-10 border bg-zinc-100 dark:bg-zinc-800 -mt-5 border-zinc-200 dark:border-zinc-800 shadow-lg rounded-lg p-2">
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

                {
                    links && links.length > 0 && (
                        links.map((link) => (
                            <Fragment key={link.id_link}>
                                <Separator />
                                <CustomDropdownLink
                                    to={link.url_link}
                                    title={link.nm_link}
                                    icon={SquareArrowOutUpRight}
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
                                <Dialog.Trigger className={"p-2 items-center justify-between gap-2 flex dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-900 hover:outline-none transition duration-150 cursor-pointer rounded-md"}>
                                    <span> Links</span> <LinkIcon size={18}/>
                                </Dialog.Trigger>
                                <Dialog.Portal>
                                    <Dialog.Overlay className={"z-50 fixed inset-0 w-screen bg-zinc-900/30 backdrop-blur-md"}/>
                                    <LinksDialog/>
                                </Dialog.Portal>
                            </Dialog.Root>
                            <Separator />
                            <Dialog.Root>
                                <Dialog.Trigger
                                    className={"p-2 items-center justify-between gap-2 flex hover:bg-zinc-200 dark:hover:bg-zinc-900 hover:outline-none transition duration-150 cursor-pointer rounded-md"}
                                >
                                    <span>Banners</span> <RectangleHorizontal  size={18}/>
                                </Dialog.Trigger>
                                <Dialog.Portal>
                                    <CustomOverlay />
                                    <BannerDialog/>
                                </Dialog.Portal>
                            </Dialog.Root>
                        </>
                    )
                }


            </Dropdown.Content>
        </Dropdown.Root>
    );
}

