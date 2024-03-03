import Image from "next/image";
import header from "../../../assets/home/header.jpg"

const Header = () => {
    return (
        <div className="container">
            <Image style={{ borderRadius: "6px" }} src={header} height={100} width={100} layout="responsive" />
        </div>
    );
};

export default Header;