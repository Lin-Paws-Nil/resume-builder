"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit, Trash2, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ResumeData } from '@/lib/types/resume';

interface SavedResume extends ResumeData {
  bucket?: string;
  companyName?: string;
  status?: 'draft' | 'sent' | 'accepted' | 'rejected';
  notes?: string;
}

interface ResumeDataTableProps {
  resumes: SavedResume[];
  onEdit: (resume: SavedResume) => void;
  onDelete: (id: string) => void;
  onUpdateBucket: (id: string, bucket: string) => void;
  buckets: string[];
}

const statusVariants = cva("capitalize text-white", {
  variants: {
    variant: {
      draft: "bg-gray-500 hover:bg-gray-600",
      sent: "bg-blue-500 hover:bg-blue-600",
      accepted: "bg-green-500 hover:bg-green-600",
      rejected: "bg-red-500 hover:bg-red-600",
    },
  },
  defaultVariants: {
    variant: "draft",
  },
});

export const ResumeDataTable = ({ 
  resumes, 
  onEdit, 
  onDelete, 
  onUpdateBucket,
  buckets 
}: ResumeDataTableProps) => {
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeInOut",
      },
    }),
  };

  const sortedResumes = [...resumes].sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="rounded-lg border border-gray-800 bg-black shadow-xl overflow-hidden">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-800 hover:bg-transparent bg-gray-950">
              <TableHead className="text-gray-300 font-semibold">Resume</TableHead>
              <TableHead className="text-gray-300 font-semibold">Name</TableHead>
              <TableHead className="text-gray-300 font-semibold">Bucket</TableHead>
              <TableHead className="text-gray-300 font-semibold">Created</TableHead>
              <TableHead className="text-gray-300 font-semibold">Updated</TableHead>
              <TableHead className="text-gray-300 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedResumes.length > 0 ? (
              sortedResumes.map((resume, index) => (
                <motion.tr
                  key={resume.id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                  className="border-b border-gray-800 transition-colors hover:bg-gray-900"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-indigo-400" />
                      <span className="text-white">{resume.title || 'Untitled Resume'}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-gray-300">
                    {resume.personalInfo?.fullName || 'N/A'}
                  </TableCell>
                  
                  <TableCell>
                    <select
                      value={resume.bucket || ''}
                      onChange={(e) => onUpdateBucket(resume.id, e.target.value)}
                      className="px-3 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:bg-gray-700 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="" className="bg-gray-900 text-gray-300">Select bucket</option>
                      {buckets
                        .filter((b) => b !== 'all')
                        .map((bucket) => (
                          <option key={bucket} value={bucket} className="bg-gray-900 text-gray-300">
                            {bucket}
                          </option>
                        ))}
                    </select>
                  </TableCell>
                  
                  <TableCell className="text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {resume.createdAt
                        ? new Date(resume.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {resume.updatedAt
                        ? new Date(resume.updatedAt).toLocaleDateString()
                        : 'N/A'}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(resume)}
                        className="hover:bg-gray-800 text-blue-400 hover:text-blue-300"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(resume.id)}
                        className="hover:bg-gray-800 text-red-400 hover:text-red-300"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-400">
                  No resumes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
