import About from "@/components/home/about/About";
import Contact from "@/components/home/contact/Contact";
import Department from "@/components/home/department/Department";
import Doctor from "@/components/home/doctor/Doctor";
import Header from "@/components/home/header/Header";
import MainLayout from "@/layouts/MainLayout";

const Index = () => {
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