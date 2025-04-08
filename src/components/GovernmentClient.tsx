import {Government} from "../@types/Government";
import Default from "/default-image.png";
import {Title} from "./Title.tsx";
interface Props {
    govData : Government;
}
export const GovernmentClient = ({govData} : Props) => {
    return (
        <article className={"flex flex-col gap-4 mb-10"}>
            <Title
                title={"O governo"}
                id={"government-client"}
            />
            <section className={"flex flex-col gap-14"}>
                <PoliticianSection
                    title={"O prefeito"}
                    nm_politician={govData.nm_prefeito}
                    nm_email={govData.nm_emailprefeito}
                    ds_about={govData.ds_sobreprefeito}
                    url_img={govData.mayorImage.url ??""}
                    nu_phone={govData.nu_telefoneprefeito}
                    ds_address={govData.ds_enderecoprefeito}
                />
                <div className={"w-full h-[1px] bg-zinc-100 dark:bg-zinc-800"}/>
                <PoliticianSection
                    title={"O vice-prefeito"}
                    nm_politician={govData.nm_viceprefeito}
                    nm_email={govData.nm_emailviceprefeito}
                    ds_about={govData.ds_sobreviceprefeito}
                    url_img={govData.deputyMayorImage.url ?? ""}
                    nu_phone={govData.nu_telefoneviceprefeito}
                    ds_address={govData.ds_enderecoviceprefeito}
                />
            </section>
            <div className={"w-full h-[1px] bg-zinc-100 dark:bg-zinc-800"}/>
            {govData.organizationalChart && (
                <footer className={"flex items-center flex-col justify-center w-full gap-4"}>
                    <h3>
                        Organograma
                    </h3>
                    <img
                        src={govData.organizationalChart.url}
                        alt={"Imagem do organograma"}
                        className={""}
                    />
                </footer>
            )}
        </article>


    );
}
interface PoliticianProps {
    title : string;
    nm_politician : string;
    nm_email : string;
    ds_about : string;
    url_img : string;
    nu_phone : string;
    ds_address : string;
}
const PoliticianSection = (props : PoliticianProps) => (
    <main className={"flex flex-col gap-5"}>
        <h2 className={"text-lg font-bold pb-2 border-b border-zinc-100 dark:border-zinc-800 w-fit px-4"}>
            {props.title}
        </h2>
        <header className={"flex lg:flex-row flex-col gap-4 items-center"}>
            <img
                src={props.url_img ?? Default}
                alt={"Imagem de perfil do prefeito"}
                className={"rounded-full w-[300px] h-[300px] object-cover lg:w-[400px]  md:h-[400px] 2xl:w-1/3  2xl:h-[500px] "}
            />
            <aside className={"flex flex-col gap-4"}>
                <h3 className={"text-2xl font-semibold"}>
                    {props.nm_politician}
                </h3>
                <p className={"w-full lg:max-w-2/3"}>
                    {props.ds_about}
                </p>
            </aside>
        </header>
        <footer className={"flex flex-col gap-4 rounded-md dark:border border-zinc-800 w-fit p-4"}>
            <span>{props.nm_email}</span>
            <span>{props.nu_phone}</span>
            <span>{props.ds_address}</span>
        </footer>
    </main>
)