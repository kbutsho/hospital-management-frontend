import Image from "next/image";
import header3 from "../../../assets/home/header/3.jpg"
import header1 from "../../../assets/home/header/1.jpg"
import header2 from "../../../assets/home/header/2.jpg"
import header4 from "../../../assets/home/header/4.jpg"
import Carousel from 'react-bootstrap/Carousel';
// import Image from 'next/legacy/image'

const Header = () => {
    return (
        // container py-4 mt-4
        <div className="pb-4">
            <Carousel controls={false} indicators interval={2500} pause={false}>
                <Carousel.Item>
                    <Image
                        layout="responsive"
                        className="d-block w-100"
                        src={header1}
                        alt="First slide"
                        style={{
                            height: "100vh",
                            objectFit: "cover"
                        }}
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <Image
                        layout="responsive"
                        className="d-block w-100"
                        src={header2}
                        alt="First slide"
                        style={{
                            height: "100vh",
                            objectFit: "cover"
                        }}
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <Image
                        layout="responsive"
                        className="d-block w-100"
                        src={header3}
                        alt="First slide"
                        style={{
                            height: "100vh",
                            objectFit: "cover"
                        }}
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <Image
                        layout="responsive"
                        className="d-block w-100"
                        src={header4}
                        alt="First slide"
                        style={{
                            borderRadius: "5px",
                            height: "110vh",
                            objectFit: "cover"
                        }}
                    />
                </Carousel.Item>
            </Carousel>
        </div>
    );
};

export default Header;