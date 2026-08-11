import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="py-16 relative z-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.jpeg"
                alt="createresume.co logo"
                width={44}
                height={44}
                className="rounded-xl"
              />
              <span className="text-white font-semibold text-lg">createresume.co</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              AI-powered free resume builder. Create professional, ATS-friendly resumes in minutes and land your dream job.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resume Builder</h3>
            <ul className="space-y-3">
              <li><Link href="/templates" className="text-sm text-gray-400 hover:text-white transition-colors">Resume Templates</Link></li>
              <li><Link href="/resume-examples" className="text-sm text-gray-400 hover:text-white transition-colors">Resume Examples</Link></li>
              <li><Link href="/builder" className="text-sm text-gray-400 hover:text-white transition-colors">Build Your Resume</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/how-to-write-a-resume" className="text-sm text-gray-400 hover:text-white transition-colors">How to Write a Resume</Link></li>
              <li><Link href="/resume-format" className="text-sm text-gray-400 hover:text-white transition-colors">Resume Format Guide</Link></li>
              <li><Link href="/ats-resume" className="text-sm text-gray-400 hover:text-white transition-colors">ATS-Friendly Resumes</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} createresume.co by White Hill. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Mangalore, India
          </p>
        </div>
      </div>
    </footer>
  );
}
