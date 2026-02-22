'use client';

import { useResumeStore } from '@/store/resume-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Code,
  FolderKanban,
  Award,
  Heart,
  GripVertical,
  Edit2,
  X,
  Check,
} from 'lucide-react';
import type { ResumeSection } from '@/lib/types/resume';
import { useState, useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EnhanceableTextField } from './EnhanceableTextField';

const sectionIcons: Record<string, any> = {
  personalInfo: User,
  summary: FileText,
  experiences: Briefcase,
  education: GraduationCap,
  skills: Code,
  projects: FolderKanban,
  certifications: Award,
  hobbies: Heart,
};

function SortableSectionItem({ 
  sectionId, 
  isExpanded, 
  onToggle, 
  onRename, 
  onDelete,
  canDelete,
  displayName,
}: {
  sectionId: string;
  isExpanded: boolean;
  onToggle: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
  canDelete: boolean;
  displayName: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sectionId,
  });

  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(displayName);
  const Icon = sectionIcons[sectionId] || FileText;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleRename = () => {
    if (renameValue.trim()) {
      onRename(renameValue.trim());
    } else {
      setRenameValue(displayName);
    }
    setIsRenaming(false);
  };

  return (
    <div ref={setNodeRef} style={style} className="border rounded-lg bg-white">
      <div className="flex items-center gap-2 p-3 hover:bg-accent transition-colors">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <button
          onClick={onToggle}
          className="flex-1 flex items-center gap-2 text-left"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <Icon className="h-4 w-4" />
          {isRenaming ? (
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') {
                  setRenameValue(displayName);
                  setIsRenaming(false);
                }
              }}
              className="h-6 px-2 text-sm flex-1"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="font-medium flex-1">{displayName}</span>
          )}
        </button>
        <div className="flex items-center gap-1">
          {!isRenaming && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRenaming(true);
                }}
                className="h-6 w-6 p-0"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              {canDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function SectionEditor() {
  const {
    resume,
    selectedSection,
    setSelectedSection,
    updateSection,
    addItem,
    removeItem,
    updateItem,
    reorderSections,
    renameSection,
    deleteSection,
    addCustomSection,
    updateCustomSection,
  } = useResumeStore();

  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionType, setNewSectionType] = useState<'text' | 'list' | 'items'>('text');
  const [showAddSection, setShowAddSection] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!resume) return null;

  // Ensure resume has required fields (for backward compatibility)
  // Normalize resume if it's missing new fields
  const normalizedResume = {
    ...resume,
    sectionOrder: resume.sectionOrder || ['personalInfo', 'summary', 'experiences', 'education', 'skills', 'projects', 'certifications', 'hobbies'],
    sectionNames: resume.sectionNames || {
      personalInfo: 'Personal Information',
      summary: 'Summary',
      experiences: 'Experience',
      education: 'Education',
      skills: 'Skills',
      projects: 'Projects',
      certifications: 'Certifications',
      hobbies: 'Hobbies',
    },
    customSections: resume.customSections || [],
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id && normalizedResume.sectionOrder) {
      const oldIndex = normalizedResume.sectionOrder.indexOf(active.id as string);
      const newIndex = normalizedResume.sectionOrder.indexOf(over.id as string);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(normalizedResume.sectionOrder, oldIndex, newIndex);
        reorderSections(newOrder);
      }
    }
  };

  const getSectionDisplayName = (sectionId: string): string => {
    return normalizedResume.sectionNames[sectionId] || sectionId;
  };

  const handleAddCustomSection = () => {
    if (newSectionName.trim()) {
      addCustomSection(newSectionName.trim(), newSectionType);
      setNewSectionName('');
      setShowAddSection(false);
    }
  };

  const renderSectionContent = (sectionId: string) => {
    const isCustom = sectionId.startsWith('custom_');
    
    if (isCustom) {
      const customSection = normalizedResume.customSections.find(s => s.id === sectionId);
      if (!customSection) return null;

      return (
        <CustomSectionEditor
          section={customSection}
          onUpdate={(updates) => updateCustomSection(sectionId, updates)}
        />
      );
    }

    // Handle standard sections
    switch (sectionId) {
      case 'personalInfo':
        return (
          <PersonalInfoEditor
            data={normalizedResume.personalInfo}
            onChange={(data) => updateSection('personalInfo', data)}
          />
        );
      case 'summary':
        return (
          <SummaryEditor
            data={normalizedResume.summary}
            onChange={(data) => updateSection('summary', data)}
          />
        );
      case 'experiences':
        return (
          <ArrayEditor
            items={normalizedResume.experiences}
            onAdd={() =>
              addItem('experiences', {
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                current: false,
                description: [],
                achievements: [],
              })
            }
            onRemove={(id) => removeItem('experiences', id)}
            onUpdate={(id, updates) => updateItem('experiences', id, updates)}
            renderItem={(item) => <ExperienceEditor item={item} />}
          />
        );
      case 'education':
        return (
          <ArrayEditor
            items={normalizedResume.education}
            onAdd={() =>
              addItem('education', {
                institution: '',
                degree: '',
                field: '',
                startDate: '',
                endDate: '',
              })
            }
            onRemove={(id) => removeItem('education', id)}
            onUpdate={(id, updates) => updateItem('education', id, updates)}
            renderItem={(item) => <EducationEditor item={item} />}
          />
        );
      case 'skills':
        return (
          <ArrayEditor
            items={normalizedResume.skills}
            onAdd={() => addItem('skills', { category: '', items: [] })}
            onRemove={(id) => removeItem('skills', id)}
            onUpdate={(id, updates) => updateItem('skills', id, updates)}
            renderItem={(item) => <SkillEditor item={item} />}
          />
        );
      case 'projects':
        return (
          <ArrayEditor
            items={normalizedResume.projects}
            onAdd={() =>
              addItem('projects', {
                name: '',
                description: '',
                technologies: [],
              })
            }
            onRemove={(id) => removeItem('projects', id)}
            onUpdate={(id, updates) => updateItem('projects', id, updates)}
            renderItem={(item) => <ProjectEditor item={item} />}
          />
        );
      case 'certifications':
        return (
          <ArrayEditor
            items={normalizedResume.certifications}
            onAdd={() =>
              addItem('certifications', {
                name: '',
                issuer: '',
                date: '',
              })
            }
            onRemove={(id) => removeItem('certifications', id)}
            onUpdate={(id, updates) => updateItem('certifications', id, updates)}
            renderItem={(item) => <CertificationEditor item={item} />}
          />
        );
      case 'hobbies':
        return (
          <ArrayEditor
            items={normalizedResume.hobbies}
            onAdd={() => addItem('hobbies', { name: '', description: '' })}
            onRemove={(id) => removeItem('hobbies', id)}
            onUpdate={(id, updates) => updateItem('hobbies', id, updates)}
            renderItem={(item) => <HobbyEditor item={item} />}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={normalizedResume.sectionOrder}
          strategy={verticalListSortingStrategy}
        >
          {normalizedResume.sectionOrder.map((sectionId) => {
            const isExpanded = selectedSection === sectionId;
            // Default sections cannot be deleted - they can only be hidden if empty
            const defaultSections = ['personalInfo', 'summary', 'experiences', 'education', 'skills', 'projects', 'certifications', 'hobbies'];
            const canDelete = !defaultSections.includes(sectionId);

            return (
              <div key={sectionId} className="space-y-2">
                <SortableSectionItem
                  sectionId={sectionId}
                  isExpanded={isExpanded}
                  onToggle={() => setSelectedSection(isExpanded ? null : sectionId)}
                  onRename={(name) => renameSection(sectionId, name)}
                  onDelete={() => {
                    deleteSection(sectionId);
                    if (selectedSection === sectionId) {
                      setSelectedSection(null);
                    }
                  }}
                  canDelete={canDelete}
                  displayName={getSectionDisplayName(sectionId)}
                />
                {isExpanded && (
                  <div className="p-4 border rounded-lg bg-gray-50 ml-6">
                    {renderSectionContent(sectionId)}
                  </div>
                )}
              </div>
            );
          })}
        </SortableContext>
      </DndContext>

      {/* Add Custom Section */}
      <div className="mt-4 pt-4 border-t">
        {!showAddSection ? (
          <Button
            variant="outline"
            onClick={() => setShowAddSection(true)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Section
          </Button>
        ) : (
          <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
            <Input
              placeholder="Section Name"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
            />
            <select
              value={newSectionType}
              onChange={(e) => setNewSectionType(e.target.value as 'text' | 'list' | 'items')}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="text">Text (Paragraph)</option>
              <option value="list">List (Bullet Points)</option>
              <option value="items">Items (Key-Value Pairs)</option>
            </select>
            <div className="flex gap-2">
              <Button
                onClick={handleAddCustomSection}
                disabled={!newSectionName.trim()}
                className="flex-1"
              >
                <Check className="h-4 w-4 mr-2" />
                Add
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddSection(false);
                  setNewSectionName('');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Custom Section Editor
function CustomSectionEditor({ section, onUpdate }: { section: any; onUpdate: (updates: any) => void }) {
  if (section.type === 'text') {
    return (
      <EnhanceableTextField
        value={typeof section.content === 'string' ? section.content : ''}
        onChange={(value) => onUpdate({ content: value })}
        placeholder="Enter text content..."
        rows={6}
        type="textarea"
        sectionType="custom"
        fieldName="content"
        context={{
          sectionName: section.name || section.id,
        }}
      />
    );
  }

  if (section.type === 'list') {
    const items = Array.isArray(section.content) ? section.content : [];
    return (
      <div className="space-y-2">
        {items.map((item: string, idx: number) => (
          <div key={idx} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => {
                const newItems = [...items];
                newItems[idx] = e.target.value;
                onUpdate({ content: newItems });
              }}
              placeholder={`Item ${idx + 1}`}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newItems = items.filter((_: any, i: number) => i !== idx);
                onUpdate({ content: newItems });
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdate({ content: [...items, ''] })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
    );
  }

  if (section.type === 'items') {
    const items = Array.isArray(section.content) ? section.content : [];
    return (
      <div className="space-y-2">
        {items.map((item: any, idx: number) => (
          <div key={idx} className="flex gap-2">
            <Input
              value={item.label || ''}
              onChange={(e) => {
                const newItems = [...items];
                newItems[idx] = { ...item, label: e.target.value };
                onUpdate({ content: newItems });
              }}
              placeholder="Label"
            />
            <Input
              value={item.value || ''}
              onChange={(e) => {
                const newItems = [...items];
                newItems[idx] = { ...item, value: e.target.value };
                onUpdate({ content: newItems });
              }}
              placeholder="Value"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newItems = items.filter((_: any, i: number) => i !== idx);
                onUpdate({ content: newItems });
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdate({ content: [...items, { label: '', value: '' }] })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
    );
  }

  return null;
}

// Existing editor components (keeping the same implementations)
function PersonalInfoEditor({ data, onChange }: { data: any; onChange: (data: any) => void }) {
  return (
    <div className="space-y-3">
      <Input
        placeholder="Full Name"
        value={data.fullName || ''}
        onChange={(e) => onChange({ ...data, fullName: e.target.value })}
      />
      <Input
        type="email"
        placeholder="Email"
        value={data.email || ''}
        onChange={(e) => onChange({ ...data, email: e.target.value })}
      />
      <Input
        placeholder="Phone"
        value={data.phone || ''}
        onChange={(e) => onChange({ ...data, phone: e.target.value })}
      />
      <Input
        placeholder="Location"
        value={data.location || ''}
        onChange={(e) => onChange({ ...data, location: e.target.value })}
      />
      <Input
        placeholder="LinkedIn (optional)"
        value={data.linkedin || ''}
        onChange={(e) => onChange({ ...data, linkedin: e.target.value })}
      />
      <Input
        placeholder="GitHub (optional)"
        value={data.github || ''}
        onChange={(e) => onChange({ ...data, github: e.target.value })}
      />
    </div>
  );
}

function SummaryEditor({ data, onChange }: { data: string; onChange: (data: string) => void }) {
  const { resume } = useResumeStore();
  const personalInfo = resume?.personalInfo;
  
  return (
    <EnhanceableTextField
      value={data || ''}
      onChange={onChange}
      placeholder="Professional summary..."
      rows={5}
      type="textarea"
      sectionType="summary"
      fieldName="summary"
      context={{
        fullName: personalInfo?.fullName || '',
      }}
    />
  );
}

function ArrayEditor({ items, onAdd, onRemove, onUpdate, renderItem }: {
  items: any[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: any) => void;
  renderItem: (item: any) => React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      {items.map((item: any, index: number) => (
        <div key={item.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Item {index + 1}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {renderItem(item)}
        </div>
      ))}
      <Button variant="outline" onClick={onAdd} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Item
      </Button>
    </div>
  );
}

function ExperienceEditor({ item }: { item: any }) {
  const { updateItem } = useResumeStore();
  const [localItem, setLocalItem] = useState(item);

  const handleChange = (field: string, value: any) => {
    const updated = { ...localItem, [field]: value };
    setLocalItem(updated);
    updateItem('experiences', item.id, { [field]: value });
  };

  return (
    <div className="space-y-3">
      <Input
        placeholder="Company"
        value={localItem.company || ''}
        onChange={(e) => handleChange('company', e.target.value)}
      />
      <Input
        placeholder="Position"
        value={localItem.position || ''}
        onChange={(e) => handleChange('position', e.target.value)}
      />
      <div className="grid grid-cols-2 gap-2">
        <Input
          placeholder="Start Date (MM/YYYY)"
          value={localItem.startDate || ''}
          onChange={(e) => handleChange('startDate', e.target.value)}
        />
        <Input
          placeholder="End Date (MM/YYYY)"
          value={localItem.endDate || ''}
          onChange={(e) => handleChange('endDate', e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={localItem.current || false}
          onChange={(e) => handleChange('current', e.target.checked)}
        />
        <label className="text-sm">Current Position</label>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <EnhanceableTextField
          value={Array.isArray(localItem.description) 
            ? localItem.description.join('\n') 
            : (localItem.description || '')}
          onChange={(value) => handleChange('description', value)}
          placeholder="Enter description. Use the bullet list button in the toolbar to create bullet points."
          rows={6}
          type="textarea"
          sectionType="experience"
          fieldName="description"
          context={{
            company: localItem.company,
            position: localItem.position,
            startDate: localItem.startDate,
            endDate: localItem.endDate,
            current: localItem.current,
          }}
          className="font-mono text-sm"
        />
        <p className="text-xs text-gray-500">
          Tip: Use the bullet list or numbered list buttons in the toolbar to format your content.
        </p>
      </div>
    </div>
  );
}

function EducationEditor({ item }: { item: any }) {
  const { updateItem } = useResumeStore();
  const [localItem, setLocalItem] = useState(item);

  const handleChange = (field: string, value: any) => {
    const updated = { ...localItem, [field]: value };
    setLocalItem(updated);
    updateItem('education', item.id, { [field]: value });
  };

  return (
    <div className="space-y-3">
      <Input
        placeholder="Institution"
        value={localItem.institution || ''}
        onChange={(e) => handleChange('institution', e.target.value)}
      />
      <Input
        placeholder="Degree"
        value={localItem.degree || ''}
        onChange={(e) => handleChange('degree', e.target.value)}
      />
      <Input
        placeholder="Field of Study"
        value={localItem.field || ''}
        onChange={(e) => handleChange('field', e.target.value)}
      />
      <div className="grid grid-cols-2 gap-2">
        <Input
          placeholder="Start Date"
          value={localItem.startDate || ''}
          onChange={(e) => handleChange('startDate', e.target.value)}
        />
        <Input
          placeholder="End Date"
          value={localItem.endDate || ''}
          onChange={(e) => handleChange('endDate', e.target.value)}
        />
      </div>
      <Input
        placeholder="GPA (optional)"
        value={localItem.gpa || ''}
        onChange={(e) => handleChange('gpa', e.target.value)}
      />
    </div>
  );
}

function SkillEditor({ item }: { item: any }) {
  const { updateItem } = useResumeStore();
  const [localItem, setLocalItem] = useState(item);
  const [skillsText, setSkillsText] = useState(
    Array.isArray(item.items) ? item.items.join(', ') : ''
  );

  // Sync localItem when item ID changes (different item selected)
  useEffect(() => {
    setLocalItem(item);
    setSkillsText(Array.isArray(item.items) ? item.items.join(', ') : '');
  }, [item.id]);

  const handleChange = (field: string, value: any) => {
    const updated = { ...localItem, [field]: value };
    setLocalItem(updated);
    updateItem('skills', item.id, { [field]: value });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSkillsText(value);
    // Process and update store: split by comma, trim each item, filter empty
    const items = value.split(',').map((s: string) => s.trim()).filter(Boolean);
    handleChange('items', items);
  };

  return (
    <div className="space-y-3">
      <Input
        placeholder="Category (e.g., Programming Languages)"
        value={localItem.category || ''}
        onChange={(e) => handleChange('category', e.target.value)}
        type="text"
      />
      <Textarea
        placeholder="Skills (comma-separated)"
        value={skillsText}
        onChange={handleSkillsChange}
        rows={3}
      />
    </div>
  );
}

function ProjectEditor({ item }: { item: any }) {
  const { updateItem } = useResumeStore();
  const [localItem, setLocalItem] = useState(item);

  const handleChange = (field: string, value: any) => {
    const updated = { ...localItem, [field]: value };
    setLocalItem(updated);
    updateItem('projects', item.id, { [field]: value });
  };

  return (
    <div className="space-y-3">
      <Input
        placeholder="Project Name"
        value={localItem.name || ''}
        onChange={(e) => handleChange('name', e.target.value)}
      />
      <EnhanceableTextField
        value={localItem.description || ''}
        onChange={(value) => handleChange('description', value)}
        placeholder="Description"
        rows={3}
        type="textarea"
        sectionType="project"
        fieldName="description"
        context={{
          name: localItem.name,
          technologies: localItem.technologies,
          link: localItem.link,
        }}
      />
      <Input
        placeholder="Technologies (comma-separated)"
        value={Array.isArray(localItem.technologies) ? localItem.technologies.join(', ') : ''}
        onChange={(e) =>
          handleChange('technologies', e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))
        }
      />
      <Input
        placeholder="Link (optional)"
        value={localItem.link || ''}
        onChange={(e) => handleChange('link', e.target.value)}
      />
    </div>
  );
}

function CertificationEditor({ item }: { item: any }) {
  const { updateItem } = useResumeStore();
  const [localItem, setLocalItem] = useState(item);

  const handleChange = (field: string, value: any) => {
    const updated = { ...localItem, [field]: value };
    setLocalItem(updated);
    updateItem('certifications', item.id, { [field]: value });
  };

  return (
    <div className="space-y-3">
      <Input
        placeholder="Certification Name"
        value={localItem.name || ''}
        onChange={(e) => handleChange('name', e.target.value)}
      />
      <Input
        placeholder="Issuer"
        value={localItem.issuer || ''}
        onChange={(e) => handleChange('issuer', e.target.value)}
      />
      <Input
        placeholder="Date (MM/YYYY)"
        value={localItem.date || ''}
        onChange={(e) => handleChange('date', e.target.value)}
      />
    </div>
  );
}

function HobbyEditor({ item }: { item: any }) {
  const { updateItem } = useResumeStore();
  const [localItem, setLocalItem] = useState(item);

  const handleChange = (field: string, value: any) => {
    const updated = { ...localItem, [field]: value };
    setLocalItem(updated);
    updateItem('hobbies', item.id, { [field]: value });
  };

  return (
    <div className="space-y-3">
      <Input
        placeholder="Hobby Name"
        value={localItem.name || ''}
        onChange={(e) => handleChange('name', e.target.value)}
      />
      <EnhanceableTextField
        value={localItem.description || ''}
        onChange={(value) => handleChange('description', value)}
        placeholder="Description (optional)"
        rows={2}
        type="textarea"
        sectionType="hobby"
        fieldName="description"
        context={{
          name: localItem.name,
        }}
      />
    </div>
  );
}
