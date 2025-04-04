import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Controller, Navigation} from "swiper/modules";

import {Link} from "react-router-dom";
import {Banner} from "../@types/Banner";

interface Props {
    banners: Banner[]
}
/**
 *
 * @constructor
 */
export const BannerSection = ({ banners } : Props) => {

    return (
        <section className={"w-full "}>
            <Swiper
                modules={[Autoplay, Navigation, Controller]}
                slidesPerView={1}
                autoplay={{ delay: 7000 }}
                spaceBetween={20}
                navigation={true}
                grabCursor
                className="w-full"
            >
                {
                    banners && banners.length > 0 && (
                        banners.map((fake) => (
                            <SwiperSlide
                                className="w-full shadow-lg "
                                key={fake.id_banner}
                            >
                                <Link
                                    className={"w-full shadow-lg "}
                                    target={"_blank"}
                                    to={fake.url_link}
                                >
                                    <img className={"w-full rounded-2xl"} src={fake.url_thumbnail} alt={"imagem do banner"}/>
                                </Link>
                            </SwiperSlide>
                            )
                        )
                    )
                }
            </Swiper>
        </section>
    );
}