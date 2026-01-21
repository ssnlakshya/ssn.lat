import { FaGithub } from "react-icons/fa";

export default function About() {
  return (
    // <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center px-4">
      <div className="bg-black rounded-2xl shadow-lg w-full p-8 md:p-12 text-white">  
        {/* About */}
        <h1 className="text-3xl font-bold mb-6">About</h1>
        <p className="mb-4 leading-relaxed text-gray-200">
          Welcome to <span className="font-semibold text-white">ssn.lat</span> – 
          the official URL shortener built for SSN College students by 
          <span className="font-semibold text-white"> SSN Lakshya</span>, 
          the official entrepreneurship club of SSN.
          <br /><br />
          We here at <span className="font-semibold text-white">Lakshya's Technical Team </span> 
          hope to solve real-life problems faced by SSN students.
          <br /><br />
          Our goal is to simplify sharing long, messy links into clean, 
          short ones that are easy to use and remember. We envision building 
          tools that make campus life smoother, fostering innovation, and 
          encouraging students to take ownership of solving everyday challenges.
        </p>

        {/* Contact Info */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">Contact Info</h2>
        <p className="text-gray-300">Email: <a href="mailto:lakshya@ssn.edu.in" className="text-orange-400">lakshya@ssn.edu.in</a></p>
        <p className="text-gray-300">
          Instagram: <span className="text-orange-400"><a href="https://www.instagram.com/ssnlakshya?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==">@ssnlakshya</a></span>
        </p>

        {/* Disclaimer */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">Disclaimer</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          ssn.lat is provided as a student initiative. We strive for accuracy, 
          but we are not responsible for misuse of shortened links or downtime 
          caused by third-party services. Use at your own discretion.
        </p>

        {/* GitHub + Footer */}
        <div className="mt-10 flex justify-center items-center gap-2">
          <a 
            href="https://github.com/ssnlakshya/ssn.lat" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-orange-400 hover:text-orange-500 transition"
          >
            <FaGithub size={22} />
            View on GitHub
          </a>
        </div>

        <p className="mt-6 text-sm text-gray-400">
          Made with <span className="text-orange-400">🧡</span> by Lakshya's Technical Team
        </p>
        <p className="mt-6 text-sm text-gray-400">
          <span className="text-orange-400">(Prawin, Yuvashree, Harini, Yuvashree, Nanditha)</span> 
        </p>
      </div>
    // </div>
  );
}
