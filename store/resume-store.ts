import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ResumeData, ResumeSection, CustomSection } from '@/lib/types/resume';

interface HistoryState {
  past: ResumeData[];
  present: ResumeData;
  future: ResumeData[];
}

type StandardResumeSection = 
  | 'personalInfo'
  | 'summary'
  | 'experiences'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'hobbies';

interface ResumeStore {
  resume: ResumeData | null;
  previewResume: ResumeData | null; // Separate state for preview - only updates on Preview and Save
  selectedSection: ResumeSection | null;
  selectedTemplate: string | null;
  savedAt: string | null;
  history: HistoryState | null;
  parsedResume: ResumeData | null;
  setResume: (resume: ResumeData) => void;
  setPreviewResume: (resume: ResumeData | null) => void;
  setParsedResume: (resume: ResumeData | null) => void;
  updateSection: <T extends StandardResumeSection>(section: T, data: ResumeData[T]) => void;
  addItem: <T extends StandardResumeSection>(
    section: T,
    item: ResumeData[T] extends Array<infer U> ? Omit<U, 'id'> : never
  ) => void;
  removeItem: <T extends StandardResumeSection>(
    section: T,
    itemId: string
  ) => void;
  updateItem: <T extends StandardResumeSection>(
    section: T,
    itemId: string,
    updates: Partial<ResumeData[T] extends Array<infer U> ? U : never>
  ) => void;
  setSelectedSection: (section: ResumeSection | null) => void;
  setSelectedTemplate: (templateId: string) => void;
  reorderSections: (newOrder: string[]) => void;
  renameSection: (sectionId: string, newName: string) => void;
  deleteSection: (sectionId: string) => void;
  addCustomSection: (name: string, type: 'text' | 'list' | 'items') => void;
  updateCustomSection: (sectionId: string, updates: Partial<CustomSection>) => void;
  setProfileImage: (image: string | null) => void;
  setShowProfileImage: (show: boolean) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveResume: () => void;
  resetResume: () => void;
  hasUnsavedChanges: () => boolean;
}

const defaultSectionOrder = [
  'personalInfo',
  'summary',
  'experiences',
  'education',
  'skills',
  'projects',
  'certifications',
  'hobbies',
];

const defaultSectionNames: Record<string, string> = {
  personalInfo: 'Personal Information',
  summary: 'Summary',
  experiences: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  hobbies: 'Hobbies',
};

const createInitialResume = (): ResumeData => ({
  id: crypto.randomUUID(),
  title: 'My Resume',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
  },
  summary: '',
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  hobbies: [],
  customSections: [],
  sectionOrder: [...defaultSectionOrder],
  sectionNames: { ...defaultSectionNames },
  templateId: 'aurora',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const initialResume = createInitialResume();

// Helper to add to history
const addToHistory = (resume: ResumeData, history: HistoryState | null): HistoryState => {
  if (!history) {
    return {
      past: [],
      present: resume,
      future: [],
    };
  }
  return {
    past: [...history.past, history.present].slice(-50), // Keep last 50 states
    present: resume,
    future: [],
  };
};

// Helper to update resume with history
const updateResumeWithHistory = (resume: ResumeData, state: any) => {
  const newResume = { ...resume, updatedAt: new Date().toISOString() };
  const newHistory = addToHistory(newResume, state.history);
  return {
    resume: newResume,
    history: newHistory,
  };
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resume: initialResume,
      previewResume: initialResume, // Initialize preview with initial resume
      selectedSection: null,
      selectedTemplate: 'aurora',
      savedAt: null,
      history: null,
      parsedResume: null,
      setResume: (resume) => {
        const normalizedResume = {
          ...resume,
          sectionOrder: resume.sectionOrder || [...defaultSectionOrder],
          sectionNames: resume.sectionNames || { ...defaultSectionNames },
          customSections: resume.customSections || [],
        };
        set({ 
          resume: normalizedResume, 
          savedAt: null,
          parsedResume: null, // Clear parsed resume when applying
          history: addToHistory(normalizedResume, null),
        });
      },
      setParsedResume: (resume) => set({ parsedResume: resume }),
      setPreviewResume: (resume) => set({ previewResume: resume }),
      updateSection: (section, data) =>
        set((state) => {
          if (!state.resume) return state;
          const updated = { ...state.resume, [section]: data };
          return updateResumeWithHistory(updated, state);
        }),
      addItem: (section, item) =>
        set((state) => {
          if (!state.resume) return state;
          const currentArray = state.resume[section] as any[];
          const updated = {
            ...state.resume,
            [section]: [...currentArray, { ...item, id: crypto.randomUUID() }],
          };
          return updateResumeWithHistory(updated, state);
        }),
      removeItem: (section, itemId) =>
        set((state) => {
          if (!state.resume) return state;
          const currentArray = state.resume[section] as any[];
          const updated = {
            ...state.resume,
            [section]: currentArray.filter((item: any) => item.id !== itemId),
          };
          return updateResumeWithHistory(updated, state);
        }),
      updateItem: (section, itemId, updates) =>
        set((state) => {
          if (!state.resume) return state;
          const currentArray = state.resume[section] as any[];
          const updated = {
            ...state.resume,
            [section]: currentArray.map((item: any) =>
              item.id === itemId ? { ...item, ...updates } : item
            ),
          };
          return updateResumeWithHistory(updated, state);
        }),
      setSelectedSection: (section) => set({ selectedSection: section }),
      setSelectedTemplate: (templateId) =>
        set((state) => {
          if (!state.resume) {
            return { ...state, selectedTemplate: templateId };
          }
          const updated = {
            ...state.resume,
            templateId: templateId,
          };
          return {
            ...updateResumeWithHistory(updated, state),
            selectedTemplate: templateId,
          };
        }),
      reorderSections: (newOrder) =>
        set((state) => {
          if (!state.resume) return state;
          const updated = {
            ...state.resume,
            sectionOrder: newOrder,
          };
          return updateResumeWithHistory(updated, state);
        }),
      renameSection: (sectionId, newName) =>
        set((state) => {
          if (!state.resume) return state;
          const updated = {
            ...state.resume,
            sectionNames: {
              ...state.resume.sectionNames,
              [sectionId]: newName,
            },
          };
          return updateResumeWithHistory(updated, state);
        }),
      deleteSection: (sectionId) =>
        set((state) => {
          if (!state.resume) return state;
          // Don't allow deleting default sections - they can only be hidden if empty
          const defaultSections = ['personalInfo', 'summary', 'experiences', 'education', 'skills', 'projects', 'certifications', 'hobbies'];
          if (defaultSections.includes(sectionId)) return state;
          
          const isCustomSection = sectionId.startsWith('custom_');
          let updated: ResumeData;
          
          if (isCustomSection) {
            // Remove custom section
            updated = {
              ...state.resume,
              customSections: state.resume.customSections.filter(s => s.id !== sectionId),
              sectionOrder: state.resume.sectionOrder.filter(id => id !== sectionId),
            };
          } else {
            // Remove from section order but keep data (for undo)
            updated = {
              ...state.resume,
              sectionOrder: state.resume.sectionOrder.filter(id => id !== sectionId),
            };
          }
          return updateResumeWithHistory(updated, state);
        }),
      addCustomSection: (name, type) =>
        set((state) => {
          if (!state.resume) return state;
          const newSection: CustomSection = {
            id: `custom_${crypto.randomUUID()}`,
            name,
            type,
            content: type === 'text' ? '' : type === 'list' ? [] : [],
            order: state.resume.sectionOrder.length,
          };
          const updated = {
            ...state.resume,
            customSections: [...state.resume.customSections, newSection],
            sectionOrder: [...state.resume.sectionOrder, newSection.id],
            sectionNames: {
              ...state.resume.sectionNames,
              [newSection.id]: name,
            },
          };
          return updateResumeWithHistory(updated, state);
        }),
      updateCustomSection: (sectionId, updates) =>
        set((state) => {
          if (!state.resume) return state;
          const updated = {
            ...state.resume,
            customSections: state.resume.customSections.map(s =>
              s.id === sectionId ? { ...s, ...updates } : s
            ),
          };
          return updateResumeWithHistory(updated, state);
        }),
      setProfileImage: (image) =>
        set((state) => {
          if (!state.resume) return state;
          const updated = {
            ...state.resume,
            profileImage: image || undefined,
          };
          return {
            ...updateResumeWithHistory(updated, state),
            previewResume: updated,
          };
        }),
      setShowProfileImage: (show) =>
        set((state) => {
          if (!state.resume) return state;
          const updated = {
            ...state.resume,
            showProfileImage: show,
          };
          return {
            ...updateResumeWithHistory(updated, state),
            previewResume: updated,
          };
        }),
      undo: () =>
        set((state) => {
          if (!state.history || state.history.past.length === 0) return state;
          const previous = state.history.past[state.history.past.length - 1];
          const newPast = state.history.past.slice(0, -1);
          return {
            resume: previous,
            history: {
              past: newPast,
              present: previous,
              future: [state.history.present, ...state.history.future],
            },
          };
        }),
      redo: () =>
        set((state) => {
          if (!state.history || state.history.future.length === 0) return state;
          const next = state.history.future[0];
          const newFuture = state.history.future.slice(1);
          return {
            resume: next,
            history: {
              past: [...state.history.past, state.history.present],
              present: next,
              future: newFuture,
            },
          };
        }),
      canUndo: () => {
        const state = get();
        return state.history ? state.history.past.length > 0 : false;
      },
      canRedo: () => {
        const state = get();
        return state.history ? state.history.future.length > 0 : false;
      },
      saveResume: () => {
        const state = get();
        if (state.resume) {
          const savedAt = new Date().toISOString();
          set({ savedAt });
          
          // Save to localStorage for backward compatibility
          if (typeof window !== 'undefined') {
            const username = sessionStorage.getItem('username') || 'SwapnilD';
            const savedResumes = localStorage.getItem(`resumes_${username}`);
            let resumes: ResumeData[] = savedResumes ? JSON.parse(savedResumes) : [];
            
            // Update or add resume
            const existingIndex = resumes.findIndex((r) => r.id === state.resume!.id);
            const resumeToSave = {
              ...state.resume,
              updatedAt: savedAt,
            };
            
            if (existingIndex >= 0) {
              resumes[existingIndex] = resumeToSave;
            } else {
              resumes.push(resumeToSave);
            }
            
            localStorage.setItem(`resumes_${username}`, JSON.stringify(resumes));

            // Also save to Supabase if user is logged in (fire and forget)
            (async () => {
              try {
                const { createClient } = await import('@/lib/supabase/client');
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                
                if (user) {
                  const { saveResumeToSupabase } = await import('@/lib/utils/save-resume');
                  await saveResumeToSupabase(state.resume!, user.id);
                }
              } catch (error) {
                console.error('Error saving to Supabase:', error);
                // Don't throw - localStorage save succeeded
              }
            })();
          }
        }
      },
      hasUnsavedChanges: () => {
        const state = get();
        if (!state.resume || !state.savedAt) {
          return state.resume !== null;
        }
        return state.resume.updatedAt > state.savedAt;
      },
      resetResume: () => {
        const newResume = createInitialResume();
        set({ 
          resume: newResume, 
          selectedSection: null, 
          savedAt: null,
          history: addToHistory(newResume, null),
        });
      },
    }),
    {
      name: 'resume-storage',
      partialize: (state) => {
        const { previewResume, ...rest } = state;
        return rest;
      },
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            return JSON.parse(str);
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            const valueToStore = { ...value };
            if (valueToStore.state?.resume?.profileImage && 
                valueToStore.state.resume.profileImage.length > 100000) {
              valueToStore.state = {
                ...valueToStore.state,
                resume: {
                  ...valueToStore.state.resume,
                  profileImage: undefined,
                },
              };
            }
            localStorage.setItem(name, JSON.stringify(valueToStore));
          } catch (error: any) {
            if (error?.name === 'QuotaExceededError') {
              console.warn('Storage quota exceeded, saving without profile image');
              try {
                const reducedValue = { ...value };
                if (reducedValue.state?.resume) {
                  reducedValue.state = {
                    ...reducedValue.state,
                    resume: {
                      ...reducedValue.state.resume,
                      profileImage: undefined,
                    },
                    history: null,
                  };
                }
                localStorage.setItem(name, JSON.stringify(reducedValue));
              } catch {
                console.error('Failed to save even reduced state');
              }
            } else {
              console.error('Storage error:', error);
            }
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Error rehydrating storage:', error);
        }
      },
    }
  )
);

