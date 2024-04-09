import About from "@/components/home/about/About";
import Contact from "@/components/home/contact/Contact";
import Department from "@/components/home/department/Department";
import Doctor from "@/components/home/doctor/Doctor";
import Header from "@/components/home/header/Header";
import MainLayout from "@/layouts/MainLayout";
import { config } from "@/config";
import { useDispatch } from 'react-redux';
import { useEffect } from "react";
import { storeSiteInfo } from "@/redux/slice/public/siteInfoSlice";
import { toast } from 'react-toastify';

const Index = ({ data, error }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (data) {
      dispatch(storeSiteInfo(data?.data));
    }
  }, [data, dispatch]);
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  return (
    <div>
      <Header />
      <About />
      <Department />
      <Doctor />
      <Contact />
    </div>
  );
};

export default Index;
Index.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export async function getStaticProps() {
  try {
    const response = await fetch(`${config.api}/site-info`);
    if (!response.ok) {
      return { props: { data: [], error: 'internal server error!' } };
    }
    const data = await response.json();
    return {
      props: {
        data,
        error: null,
      },
      revalidate: 30,
    };
  } catch (error) {
    console.log(error)
    return { props: { data: [], error: 'internal server error!' } };
  }
}
