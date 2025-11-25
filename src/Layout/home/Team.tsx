import { Poppins } from "next/font/google";
import Image from "next/image";

const poppins = Poppins({
  weight: ["100","200","300","400","500","600","700","800","900"],
  style: ["normal","italic"],
  subsets: ["latin"],
});

export default function TeamCard() {
  const navyBlue = "hsl(218,89%,21%)"; // optional if needed elsewhere

  return (
    <div id='team' className={`${poppins.className} flex flex-col items-center justify-center py-12`}>
      <h1 className="text-3xl font-medium text-slate-800 text-center">Meet Our Team</h1>
      <p className="text-slate-500 text-center mt-2">
        The people behind the product, passionate about what they do.
      </p>

      <div className="mt-12">
        <div className="max-w-xs bg-black text-white rounded-2xl overflow-hidden shadow-lg">
          {/* Image wrapper */}
          <div className="relative h-[270px] w-[240px] overflow-hidden">
            <Image
              src="/assets/hero/adesanoye.jpg"
              alt="Adesanoye Adeyeye"
              width={5326}
              height={7990}
              className="object-cover object-top transition-transform duration-300 transform hover:scale-125"
            />
            <div className="absolute bottom-0 h-40 w-full bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
          </div>

          {/* Text */}
          <div className="px-4 pb-6 text-center">
            <p className="mt-4 text-md">Dr. Adesanoye Adeyeye</p>
            <p className="text-sm font-medium bg-gradient-to-r from-[#8B5CF6] via-[#9938CA] to-[#E0724A] text-transparent bg-clip-text">
              Fullstack Developer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
