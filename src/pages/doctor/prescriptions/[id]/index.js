import { useRouter } from "next/router";

const Prescribe = () => {
    const router = useRouter();
    const { id } = router.query;
    return (
        <div>
            {id}
        </div>
    );
};

export default Prescribe;