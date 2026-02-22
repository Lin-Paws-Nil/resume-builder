'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Plus, Edit, Trash2, Download, Tag, Calendar, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ResumeData } from '@/lib/types/resume';

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
  const [selectedBucket, setSelectedBucket] = useState<string>('all');
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

  const handleUpdateBucket = (id: string, bucket: string) => {
    const updated = resumes.map((r) => (r.id === id ? { ...r, bucket } : r));
    if (typeof window !== 'undefined') {
      const username = sessionStorage.getItem('username') || 'SwapnilD';
      localStorage.setItem(`resumes_${username}`, JSON.stringify(updated));
    }
    setResumes(updated);
  };

  const buckets = ['all', 'Google', 'Amazon', 'Microsoft', 'Accepted', 'Pending', 'Draft'];
  const filteredResumes = resumes.filter((resume) => {
    const matchesSearch =
      resume.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.personalInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.bucket?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBucket = selectedBucket === 'all' || resume.bucket === selectedBucket;
    return matchesSearch && matchesBucket;
  });

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveSubTab('resume')}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            activeSubTab === 'resume'
              ? 'text-blue-600 border-b-2 border-blue-600'
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
              ? 'text-blue-600 border-b-2 border-blue-600'
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
        <div className="space-y-4">
          {/* Actions Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search resumes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedBucket}
                onChange={(e) => setSelectedBucket(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {buckets.map((bucket) => (
                  <option key={bucket} value={bucket}>
                    {bucket === 'all' ? 'All Buckets' : bucket}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={() => router.push('/builder')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Resume
            </Button>
          </div>

          {/* Resumes Table */}
          {filteredResumes.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No resumes found</p>
              <Button
                onClick={() => router.push('/builder')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Resume
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Bucket
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredResumes.map((resume) => (
                    <tr key={resume.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {resume.title || 'Untitled Resume'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {resume.personalInfo?.fullName || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          value={resume.bucket || ''}
                          onChange={(e) => handleUpdateBucket(resume.id, e.target.value)}
                          className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="">Select bucket</option>
                          {buckets
                            .filter((b) => b !== 'all')
                            .map((bucket) => (
                              <option key={bucket} value={bucket}>
                                {bucket}
                              </option>
                            ))}
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {resume.createdAt
                            ? new Date(resume.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {resume.updatedAt
                            ? new Date(resume.updatedAt).toLocaleDateString()
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(resume)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(resume.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'cover-letters' && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Cover letters feature coming soon!</p>
        </div>
      )}
    </div>
  );
}

