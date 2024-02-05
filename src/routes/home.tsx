// import AboutSection from '@/components/AboutSection';
// import ContactUs from '@/components/ContactSection';
// import Footer from '@/components/Footer';
// import GetCardsSection from '@/components/GetCardSection';
// import QAndA from '@/components/QAndA';
// import { Link } from 'react-router-dom';

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {

  // useEffect(() => {
  //   setTimeout(() => {
  //     window.location.replace('https://www.ndcgoodgovernancecard.com/')
  //   }, 10000)
  // }, [])

  return (
    <section className="w-full lg:w-1/4 m-auto bg-white/70 rounded-2xl px-12 py-6 flex flex-col items-center">
      <img src="/ndc_card_logo.png" className="w-16 h-auto" />
      <div className="text-left">
        <p className="leading-9 font-semibold">Dear Donor,</p>

        <p>
          Thank you for your interest in the Good Governance Project.
          Click on the button below to visit the updated project site.
        </p>
        <Button asChild className="mt-4">
          <Link to="https://www.ndcgoodgovernancecard.com/" className="space-x-2">
            <span>Go To Site</span>
            <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
      {/* <section className="bg-ndcgreen bg-[url('/mainbg.jpg')] bg-cover bg-center bg-blend-color-burn">
        <div className="container mx-auto flex flex-col flex-wrap items-center px-3 md:flex-row">
          <div className="mt-24 flex w-full flex-col items-start justify-center text-center text-white md:w-2/5 md:text-left xl:mt-0">
            <p className="w-full text-xl font-bold uppercase text-gray-300 md:text-2xl">
              Diverse Support
            </p>
            <h1 className="my-2 w-full text-3xl font-extrabold uppercase leading-tight md:text-5xl">
              LETS ALL HELP TO SUPPORT OUR PARTY
            </h1>
            <div className="mx-auto  flex flex-col py-5 lg:mx-0">
              <Link to="/register">
                <button className="mx-auto mt-4 rounded-fancy bg-gradient-to-r from-ndcred to-ndcred/30  px-4 py-5 font-bold uppercase text-white shadow-lg hover:from-black hover:to-black/40 md:px-10  lg:mx-0">
                  Good Governance Card Registration
                </button>
              </Link>
              <Link to="/arrears">
                <button className="mx-auto mt-4 w-full rounded-fancy bg-gradient-to-r from-white to-white/60 px-10 py-5 font-bold uppercase  text-black shadow-xl hover:from-black hover:to-black/40 hover:text-white lg:mx-0">
                  Check Arrears
                </button>
              </Link>
              <div className="flex w-full items-center justify-between text-xs">
                <Link to="/upgrade">
                  <button className="mx-auto mt-4 rounded-fancy bg-gradient-to-r from-white to-ndcgreen/90 px-10 py-5 font-bold uppercase text-black shadow-lg hover:from-ndcred hover:to-ndcred/30  hover:text-white">
                    Upgrade Card
                  </button>
                </Link>
                <Link to="/reprint">
                  <button className="mx-auto mt-4  rounded-fancy bg-gradient-to-r from-black to-black/40 px-4 py-5 font-bold uppercase text-white shadow-lg hover:from-ndcgreen hover:to-black/80  md:px-10">
                    Request Card Reprint
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full text-center md:w-3/5 ">
            <img
              alt=""
              loading="lazy"
              decoding="async"
              data-nimg="1"
              src="/farmer.png"
              className="h-aut0 w-full"
            />
          </div>
        </div>
      </section>
      <AboutSection />
      <GetCardsSection />
      <QAndA />
      <ContactUs />
      <Footer /> */}
    </section>
  );
}
