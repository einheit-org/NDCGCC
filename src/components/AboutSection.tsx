export default function AboutSection() {
  return (
    <section className="py-5 bg-white/70" id="about">
      <div className="container max-w-5xl mx-auto m-5">
        <h1 className="w-full text-3xl font-bold leading-tight text-center text-gray-800 uppercase">About</h1>
        <p className="font-bold uppercase px-6 py-3 text-lg text-center">
          {"Introducing the Good Governance Card:"}
          <br />
          {" Shaping Ghana's Future through Inclusive Participation"}
        </p>
        <div className="flex flex-wrap text-lg leading-normal">
          <div className="w-5/6 sm:w-1/2 p-6">
            <p className="text-gray-800 mb-8 ">Welcome to the innovative realm of the Good Governance Card, a transformative initiative crafted by the National Democratic Congress (NDC) to reshape the landscape of campaign funding in Ghana. With a visionary commitment to inclusivity, this groundbreaking endeavour is set to empower everyday Ghanaians and the middle class, ushering them into the heart of the political process.
              <br />
              <br />
              In a bold departure from the norm, the Good Governance Card embarks on a mission to engage individuals who have long stood at the periphery of active party politics. By tapping into the collective resources, expertise, and enthusiasm of this previously untapped demographic, the NDC endeavours to counteract the economic tumult stemming from corruption and mismanagement under the current administration, the New Patriotic Party (NPP).
              <br />
              <br />
              <span className="italic font-bold text-ndcred my-2 uppercase text-xl text-center">EMPOWERING CHANGE: GET YOUR CARD, SHAPE YOUR FUTURE!</span>
            </p>
          </div>
          <div className="w-full sm:w-1/2 p-5 pt-0 md:pt-5">
            <p className="text-gray-800 mb-5 md:mb-8  ">
              Embodying the NDC&apos;s unwavering dedication to the welfare of the nation, the Good Governance Card is a beacon of opportunity, offering a platform for shaping a brighter tomorrow for Ghana. Through this transformative vehicle, we strive to cultivate an environment of good governance, laying the groundwork for a sustainable future that resonates throughout our beloved nation.
              <br />
              <br />
              The Good Governance Card is more than just a financial instrument; it&apos;s a catalyst for positive change. It symbolizes a movement that embraces diversity, elevates voices, and champions transparency. Together, as we harness the power of the ordinary citizen and the middle class, we embark on a journey toward progress, unity, and collective prosperity. Join us in this historic endeavour as we revolutionize campaign funding, empower our fellow Ghanaians, and pave the way for a better future.
              <br />
              <br />
              The Good Governance Card is not just a card it&apos;s a key to a more inclusive, prosperous, and harmonious Ghana.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}