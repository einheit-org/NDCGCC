export default function ContactUs() {
  return (
    <section id="contact" className="bg-white/80 py-5">
      <div className="container max-w-3xl mx-auto m-8 px-3">
        <h1 className="w-full text-3xl font-bold leading-tight text-center text-gray-800 uppercase">
          Contact Us
        </h1>
        <div className="w-full mx-auto max-w-3xl pt-5">
          <div className="">
            <p className="text-gray-500 font-light mb-0 uppercase">
              <span className="text-red-700 font-semibold mr-1.5">
                Customer
              </span>
              Service
            </p>
            <h4 className="text-xl text-black  font-medium mt-1">
              <i className="fas fa-phone text-ndcgreen mr-2"></i> 0598122865
              | 0504013113
            </h4>
          </div>
          <p className="text-gray-500  font-light  uppercase my-5">
            <span className="text-red-700 font-semibold mr-1.5">
              Contact
            </span>
            Form
          </p>
          <form className="w-full ">
            <div className="flex flex-wrap -mx-3 ">
              <div className="w-full  px-3 mb-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Full Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border  border-gray-200   rounded py-3 px-4  leading-tight focus:outline-none focus:bg-white"
                  id="grid-first-name"
                  type="text"
                  placeholder="Full Name"
                  name="full_name"
                />
                <p className="mt-1 text-xs text-red-600 italic"></p>
              </div>
            </div>
            <div className="relative w-full mb-4">
              <label
                className="block uppercase text-black text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Phone Number
              </label>
              <input
                type="text"
                className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4  leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                placeholder="Phone Number"
                name="phone_number"
              />
              <p className="text-gray-600 text-xs italic mt-1">
                * 0240000000 | 0262222222 | 0271111111.
              </p>
            </div>
            <div className="flex flex-wrap -mx-3 mb-3">
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  Message
                </label>
                <textarea
                  className=" no-resize appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4  leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-48 resize-none"
                  id="message"
                  placeholder="Message"
                  name="message"
                ></textarea>
                <p className="mt-1 text-xs text-red-600 italic"></p>
              </div>
            </div>
            <div className="md:flex md:items-center">
              <div className="w-full mt-2">
                <button
                  className="shadow bg-ndcred hover:bg-black focus:shadow-outline focus:outline-none text-white font-bold py-3 px-4  w-full"
                  type="submit"
                >
                  Send Message
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}