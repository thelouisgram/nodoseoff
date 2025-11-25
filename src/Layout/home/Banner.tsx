import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const poppins = Poppins({
  weight: [
    "100","200","300","400","500","600","700","800","900"
  ],
  style: ["normal","italic"],
  subsets: ["latin"],
});

export default function Banner() {
  const navyBlue = "hsl(218,89%,15%)"; // darker navy
  const deepBlue = "hsl(218,89%,10%)"; // for gradient and button

  const avatars = [
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop"
  ];

  return (
    <div
      className={`${poppins.className} max-w-5xl py-16 md:pl-24 md:w-full mx-2 md:mx-auto flex flex-col items-start justify-center text-left rounded-2xl p-10`}
      style={{
        background: `linear-gradient(to bottom, ${navyBlue}, ${deepBlue})`,
        color: "white",
      }}
    >
      <div className="flex items-center">
        <div className="flex -space-x-3 pr-3">
          {avatars.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt={`user ${i + 1}`}
              width={32}
              height={32}
              className={`rounded-full hover:-translate-y-px transition z-[${i + 1}]`}
            />
          ))}
        </div>

        {/* Stars */}
        <div className="ml-3 flex flex-col items-start gap-1">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                width="13"
                height="12"
                viewBox="0 0 13 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.85536 0.463527C6.00504 0.00287118 6.65674 0.00287028 6.80642 0.463526L7.82681 3.60397C7.89375 3.80998 8.08572 3.94946 8.30234 3.94946H11.6044C12.0888 3.94946 12.2901 4.56926 11.8983 4.85397L9.22687 6.79486C9.05162 6.92219 8.97829 7.14787 9.04523 7.35388L10.0656 10.4943C10.2153 10.955 9.68806 11.338 9.2962 11.0533L6.62478 9.11244C6.44954 8.98512 6.21224 8.98512 6.037 9.11244L3.36558 11.0533C2.97372 11.338 2.44648 10.955 2.59616 10.4943L3.61655 7.35388C3.68349 7.14787 3.61016 6.92219 3.43491 6.79486L0.763497 4.85397C0.37164 4.56927 0.573027 3.94946 1.05739 3.94946H4.35944C4.57606 3.94946 4.76803 3.80998 4.83497 3.60397L5.85536 0.463527Z"
                  fill="#FF8F20"
                />
              </svg>
            ))}
          </div>
          <p className="text-sm text-white/70">Built by Doctors</p>
        </div>
      </div>

      <h1 className="text-4xl md:text-[46px] md:leading-[60px] font-semibold max-w-xl mt-5">
        Track your medications better
      </h1>

      <p className="mt-3 text-white/80 max-w-lg">
        NoDoseOff helps long-term drug users stay on track with their medication, ensuring safety, reminders, and expert guidance.
      </p>
        <Link href="/signup">

      <button
        className="px-12 py-2.5 border border-transparent bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 transition-all rounded-full text-sm mt-8 text-white"
      >
        Get Started
      </button>
      </Link>
    </div>
  );
}
