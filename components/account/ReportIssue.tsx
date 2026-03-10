'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, FileText, Upload, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import { showToast } from '@/components/ui/toast';

export function ReportIssue() {
  const { user } = useAuth();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    resumeName: '',
    feedback: '',
  });
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let screenshotUrl = null;

      if (screenshot) {
        const fileExt = screenshot.name.split('.').pop();
        const fileName = `${user?.id || 'guest'}-${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('issue-screenshots')
          .upload(fileName, screenshot);

        if (uploadError) {
          console.error('Screenshot upload error:', uploadError);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('issue-screenshots')
            .getPublicUrl(fileName);
          screenshotUrl = publicUrl;
        }
      }

      const issueData = {
        user_id: user?.id || null,
        user_name: user?.username || user?.email?.split('@')[0] || 'Guest',
        user_email: user?.email || null,
        resume_name: formData.resumeName || null,
        feedback: formData.feedback,
        screenshot_url: screenshotUrl,
        status: 'open',
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('issues')
        .insert([issueData]);

      if (error) {
        console.error('Database error:', error);
        showToast({
          title: 'Error',
          description: 'Failed to submit issue. Please try again.',
          type: 'error',
        });
      } else {
        showToast({
          title: 'Issue Submitted',
          description: 'Thank you for your feedback! We will review it shortly.',
          type: 'success',
        });
        
        setFormData({ resumeName: '', feedback: '' });
        setScreenshot(null);
        setScreenshotPreview(null);
      }
    } catch (error) {
      console.error('Submission error:', error);
      showToast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Card className="shadow-lg rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-white flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-indigo-400" />
            Report an Issue
          </CardTitle>
          <p className="text-sm text-gray-400 mt-2">
            Help us improve by reporting bugs or sharing feedback. We review all submissions.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="resumeName" className="text-gray-300">
                Resume Name (Optional)
              </Label>
              <div className="flex items-center gap-2 border border-gray-600 rounded-lg px-3 py-2 bg-gray-800 mt-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <Input
                  id="resumeName"
                  type="text"
                  placeholder="e.g., My Software Engineer Resume"
                  value={formData.resumeName}
                  onChange={(e) => setFormData({ ...formData, resumeName: e.target.value })}
                  className="border-0 focus-visible:ring-0 focus-visible:outline-none shadow-none bg-transparent text-white placeholder:text-gray-500"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="feedback" className="text-gray-300">
                Feedback / Issue Description *
              </Label>
              <Textarea
                id="feedback"
                placeholder="Please describe the issue you're experiencing or share your feedback..."
                value={formData.feedback}
                onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                className="mt-2 min-h-32 bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-indigo-500 resize-none"
                required
              />
            </div>

            <div>
              <Label htmlFor="screenshot" className="text-gray-300">
                Screenshot (Optional)
              </Label>
              <div className="mt-2">
                {screenshotPreview ? (
                  <div className="relative">
                    <img
                      src={screenshotPreview}
                      alt="Screenshot preview"
                      className="w-full rounded-lg border border-gray-600 max-h-64 object-contain bg-gray-800"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        setScreenshot(null);
                        setScreenshotPreview(null);
                      }}
                      variant="outline"
                      className="absolute top-2 right-2 bg-gray-900/90 border-gray-600 text-gray-300 hover:bg-gray-800"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="screenshot"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400">
                      Click to upload screenshot
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 10MB
                    </p>
                    <input
                      id="screenshot"
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !formData.feedback}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Issue
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            Your submission will be reviewed by our team. We typically respond within 24-48 hours.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
