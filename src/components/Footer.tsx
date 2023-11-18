export default function Footer() {
  return (
    <footer className="bg-black/50">
      <div className="container mx-auto">
        <div className="flex flex-col justify-center items-center text-center text-white pt-14 pb-10 border-b-[0.5px]">
          <img
            alt=""
            loading="lazy"
            width="134"
            height="120"
            decoding="async"
            data-nimg="1"
            src="/ndc_logo_footer.png"
          />
          <h1 className="text-xl  mt-5 font-extrabold uppercase">
            National Democratic Congress
          </h1>
          <h3 className="text-lg font-medium uppercase">
            P O Box AN5825 Accra- Ghana
          </h3>
          <div className="text-lg  font-medium">
            <p>0557287496 | 0274022267</p>
            <p>info@ghanandc.com</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto text-center text-white py-3 px-2 text-xs">
        <p>Copyright © 2023 NDC Good Governance All Rights Reserved</p>
      </div>
    </footer>
  )
}