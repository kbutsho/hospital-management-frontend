import Image from "next/image";
import header from "../../../assets/home/header.jpg"

const Header = () => {
    return (
        <div className="container">
            <Image src={header} height={100} width={100} layout="responsive" />
        </div>
    );
};

export default Header;