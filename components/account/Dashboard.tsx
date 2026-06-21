'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Plus, Edit, Trash2, Download, Tag, Calendar, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ResumeData } from '@/lib/types/resume';
import { ResumeDataTable } from '@/components/ui/resume-data-table';

interface SavedResume extends ResumeData {
  bucket?: string;
  companyName?: string;
  status?: 'draft' | 'sent' | 'accepted' | 'rejected';
  notes?: string;
}

type SubTab = 'resume' | 'cover-letters';

export function Dashboard() {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('resume');
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = () => {
    if (typeof window !== 'undefined') {
      const username = sessionStorage.getItem('username') || 'SwapnilD';
      const savedResumes = localStorage.getItem(`resumes_${username}`);
      if (savedResumes) {
        setResumes(JSON.parse(savedResumes));
      }
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      const updated = resumes.filter((r) => r.id !== id);
      if (typeof window !== 'undefined') {
        const username = sessionStorage.getItem('username') || 'SwapnilD';
        localStorage.setItem(`resumes_${username}`, JSON.stringify(updated));
      }
      setResumes(updated);
    }
  };

  const handleEdit = (resume: SavedResume) => {
    // Store resume in store and navigate to builder
    if (typeof window !== 'undefined') {
      const { useResumeStore } = require('@/store/resume-store');
      useResumeStore.getState().setResume(resume);
      useResumeStore.getState().setPreviewResume(resume);
      router.push('/builder');
    }
  };

  const filteredResumes = resumes.filter((resume) => {
    const matchesSearch =
      resume.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.personalInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Sub-tabs - White on Active */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveSubTab('resume')}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            activeSubTab === 'resume'
              ? 'text-white bg-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Resume
          </div>
        </button>
        <button
          onClick={() => setActiveSubTab('cover-letters')}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            activeSubTab === 'cover-letters'
              ? 'text-white bg-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Cover Letters
          </div>
        </button>
      </div>

      {activeSubTab === 'resume' && (
        <div className="space-y-6">
          {/* Actions Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search resumes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-indigo-500"
                />
              </div>
            </div>
            <Button
              onClick={() => router.push('/builder')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Resume
            </Button>
          </div>

          {/* Resumes Table */}
          {filteredResumes.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No resumes found</p>
              <Button
                onClick={() => router.push('/builder')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Resume
              </Button>
            </div>
          ) : (
            <ResumeDataTable
              resumes={filteredResumes}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      )}

      {activeSubTab === 'cover-letters' && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Cover letters feature coming soon!</p>
        </div>
      )}
    </div>
  );
}

