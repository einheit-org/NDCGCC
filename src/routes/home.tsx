import AboutSection from "@/components/AboutSection";
import ContactUs from "@/components/ContactSection";
import Footer from "@/components/Footer";
import GetCardsSection from "@/components/GetCardSection";
import QAndA from "@/components/QAndA";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className="bg-ndcgreen bg-[url('/mainbg.jpg')] bg-cover bg-center bg-blend-color-burn">
        <div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
          <div className="flex flex-col w-full md:w-2/5 justify-center items-start text-center md:text-left text-white mt-24 xl:mt-0">
            <p className="uppercase w-full text-xl md:text-2xl font-bold text-gray-300">
              Diverse Support
            </p>
            <h1 className="my-2 text-3xl md:text-5xl leading-tight font-extrabold w-full uppercase">
              LETS ALL HELP TO SUPPORT OUR PARTY
            </h1>
            <div className="py-5  flex flex-col mx-auto lg:mx-0">
              <Link to="/register">
                <button className="mx-auto uppercase lg:mx-0 bg-gradient-to-r hover:from-black hover:to-black/40  from-ndcred to-ndcred/30 text-white font-bold mt-4 py-5 px-4 md:px-10 shadow-lg  rounded-fancy">
                  Good Governance Card Registration
                </button>
              </Link>
              <Link to="/donate">
                <button className="uppercase w-full mx-auto lg:mx-0 bg-gradient-to-r from-white to-white/60 hover:from-black hover:to-black/40 hover:text-white mt-4  text-black font-bold py-5 px-10 shadow-xl rounded-fancy">
                  Monthly Donation
                </button>
              </Link>
              <div className="w-full flex justify-between items-center text-xs">
                <Link to="/upgrade">
                  <button className="mx-auto uppercase bg-gradient-to-r text-black from-white to-ndcgreen/90 hover:from-ndcred hover:to-ndcred/30 hover:text-white font-bold mt-4 py-5 px-10 shadow-lg  rounded-fancy">
                    Upgrade Card
                  </button>
                </Link>
                <Link to="/reprint">
                  <button className="mx-auto uppercase  bg-gradient-to-r from-black to-black/40 hover:from-ndcgreen hover:to-black/80 text-white font-bold mt-4 py-5 px-4 md:px-10 shadow-lg  rounded-fancy">
                    Request Card Reprint
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full md:w-3/5 text-center ">
            <img alt="" loading="lazy" decoding="async" data-nimg="1" src="/farmer.png" className="w-full h-aut0" />
          </div>
        </div>
      </section>
      <AboutSection />
      <GetCardsSection />
      <QAndA />
      <ContactUs />
      <Footer />
    </>
  )
}