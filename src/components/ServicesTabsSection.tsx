import {Link} from "../@types/Link";
import { Tabs } from "radix-ui";
import { Link as LinkNav } from "react-router-dom";
import {SquareArrowOutUpRight} from "lucide-react";
interface Props {
    services : Link[]
}
export const ServicesTabsSection = ({ services } : Props) => {
    const pjServices : Link[] = [];
    const pfServices : Link[] = [];

    services.forEach(s => {
        if (s.fl_cidadao)return pfServices.push(s);
        pjServices.push(s);
    })
    return (
        <div>
            <Tabs.Root
                className={"rounded-lg w-full border border-zinc-200 dark:border-zinc-700/40 p-4"}
                defaultValue="tab1"
            >
                <Tabs.List
                    className="flex gap-2 mb-4"
                    aria-label="Manage your account"
                >
                    <Tabs.Trigger
                        className={"select-none cursor-pointer w-1/2 hover:bg-zinc-100 data-[state=active]:bg-zinc-200 data-[state=active]:dark:bg-zinc-800 dark:hover:bg-zinc-800 p-2 rounded-lg transition duration-150"}
                        value="tab1"
                    >
                        Cidadão
                    </Tabs.Trigger>
                    <div className={"h-10 w-[1px] bg-zinc-200 dark:bg-zinc-800"}/>
                    <Tabs.Trigger
                        className={"select-none cursor-pointer w-1/2 hover:bg-zinc-100 data-[state=active]:bg-zinc-200 data-[state=active]:dark:bg-zinc-800  dark:hover:bg-zinc-800 p-2 rounded-lg transition duration-150"}
                        value="tab2"
                    >
                        Empresa
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content
                    value="tab1"
                >
                    <ServicesSection services={pfServices}/>
                </Tabs.Content>
                <Tabs.Content
                    value="tab2"
                >
                    <ServicesSection services={pjServices}/>
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
}

const ServicesSection = ({services} : {services : Link[]}) => {
    return (
        <section className={"grid gap-2 2xl:gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 "}>
            {
                services.length > 0 ? (
                    services.map((s) => (
                        <ServiceCard key={s.id_link} service={s}/>
                    ))
                ) : (
                    <span className={"text-zinc-400 font-bold text-2xl"}>
                        Nenhum serviço encontrado
                    </span>
                )

            }
        </section>
    )
}

const ServiceCard = ({service} : {service : Link}) => {
    return (
        <LinkNav
            to={service.url_link}
            target={"_blank"}
            className={"w-full lg:min-w-[260px] rounded-lg px-5 py-10 transition duration-200   bg-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 dark:bg-zinc-800 flex items-center justify-between"}
        >
            {service.nm_link}
            <SquareArrowOutUpRight />
        </LinkNav>
    );
}