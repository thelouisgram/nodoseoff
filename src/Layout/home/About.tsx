import Image from "next/image";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400","500","600","700"],
  subsets: ["latin"],
});

export default function Example() {
  return (
    <div id='about' className={`${poppins.className} max-w-5xl mt-16 mx-auto py-16 px-4 flex flex-col items-center gap-10 bg-gray-900 ss:rounded-xl`}>
      
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-white">About NodoseOff</h1>
        <p className="text-sm text-gray-300 mt-2 max-w-md mx-auto">
          NodoseOff is a telemedicine app designed to help long-term medication users manage their treatments efficiently and safely.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full">

        <div className="relative w-full max-w-sm mx-auto md:mx-0">
          <Image
            src="/assets/hero/old-man.jpg"
            alt="NodoseOff App"
            width={400}
            height={400}
            className="rounded-xl object-cover shadow-lg"
          />
        </div>

        {/* Features */}
        <div className="flex-1 flex flex-col gap-6">
          <h2 className="text-2xl font-semibold text-white text-center md:text-left">Key Features</h2>

          {/* Feature 1 */}
          <div className="flex items-center gap-4">
            <div className="p-6 w-16 h-16 flex items-center justify-center rounded-xl border border-gray-700 bg-gray-800">
              <span className="text-3xl">🛎️</span>
            </div>
            <div>
              <h3 className="text-base font-medium text-white">Medication Reminders</h3>
              <p className="text-sm text-gray-300">
                Never miss a dose — set reminders and receive notifications directly in the app.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-4">
            <div className="p-6 w-16 h-16 flex items-center justify-center rounded-xl border border-gray-700 bg-gray-800">
              <span className="text-3xl">🔄</span>
            </div>
            <div>
              <h3 className="text-base font-medium text-white">Progress Tracking</h3>
              <p className="text-sm text-gray-300">
                Monitor your medication history and adherence with easy-to-read analytics.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-4">
            <div className="p-6 w-16 h-16 flex items-center justify-center rounded-xl border border-gray-700 bg-gray-800">
              <span className="text-3xl">🗂️</span>
            </div>
            <div>
              <h3 className="text-base font-medium text-white">Report Generation</h3>
              <p className="text-sm text-gray-300">
                Generate detailed reports of your medication usage and share them with healthcare providers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
