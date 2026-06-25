import Link from 'next/link';
import { FileText } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-16 relative z-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2.5 rounded-xl">
                <FileText className="h-5 w-5 text-white" />
              </div>
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
              <li><Link href="/builder" className="text-sm text-gray-400 hover:text-white transition-colors">Build Your Resume</Link></li>
              <li><Link href="/signup" className="text-sm text-gray-400 hover:text-white transition-colors">Create Free Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Sign In</Link></li>
              <li><Link href="/signup" className="text-sm text-gray-400 hover:text-white transition-colors">Create Account</Link></li>
              <li><a href="mailto:whitehillpvt@gmail.com" className="text-sm text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} createresume.co. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Free AI-powered resume builder with ATS-friendly templates
          </p>
        </div>
      </div>
    </footer>
  );
}
