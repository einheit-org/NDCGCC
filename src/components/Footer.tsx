export default function Footer() {
  return (
    <footer className="bg-black/50">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center border-b-[0.5px] pb-10 pt-14 text-center text-white">
          <img
            alt=""
            loading="lazy"
            width="134"
            height="120"
            decoding="async"
            data-nimg="1"
            src="/ndc_logo_footer.png"
          />
          <h1 className="mt-5  text-xl font-extrabold uppercase">
            National Democratic Congress
          </h1>
          <h3 className="text-lg font-medium uppercase">
            P O Box AN5825 Accra- Ghana
          </h3>
          <div className="text-lg  font-medium">
            <p>0598953919 | 0534000261 | 0598953914 | 0598953915</p>
            <p>info@ghanandc.com</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-2 py-3 text-center text-xs text-white">
        <p>Copyright © 2023 NDC Good Governance All Rights Reserved</p>
      </div>
    </footer>
  );
}
