// import Image from "next/image";
import header from "../../../assets/home/header.jpg"
import Image from 'next/legacy/image'

const Header = () => {
    return (
        <div className="container pt-5">
            <Image style={{ borderRadius: "6px" }} src={header} layout="responsive" alt="img" />
        </div>
    );
};

export default Header;