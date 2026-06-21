"use client";

import { Toast, Toaster, createToaster } from "@ark-ui/react/toast";
import { Portal } from "@ark-ui/react/portal";
import { X, CheckCircle2, AlertCircle } from "lucide-react";

export const toaster = createToaster({
  placement: "top",
  gap: 16,
  overlap: true,
});

interface ToastOptions {
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
}

export function showToast({ title, description, type = 'success' }: ToastOptions) {
  toaster.create({
    title,
    description,
    type,
  });
}

export function ToastProvider() {
  return (
    <Portal>
      <Toaster toaster={toaster}>
        {(toast) => {
          const isError = toast.type === 'error';
          const isSuccess = toast.type === 'success';

          return (
            <Toast.Root 
              className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 min-w-80 p-4 relative overflow-hidden transition-all duration-300 ease-default will-change-transform"
              style={{
                height: 'var(--height)',
                opacity: 'var(--opacity)',
                transform: `translateX(var(--x)) translateY(var(--y)) scale(var(--scale))`,
                zIndex: 'var(--z-index)',
                borderColor: isError ? 'rgba(239, 68, 68, 0.3)' : isSuccess ? 'rgba(34, 197, 94, 0.3)' : 'rgba(59, 130, 246, 0.3)',
              }}
            >
              <div className="flex items-start gap-3">
                {isError && <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />}
                {isSuccess && <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-500 mt-0.5" />}
                
                <div className="flex-1">
                  <Toast.Title className="text-gray-900 font-semibold text-sm">
                    {toast.title}
                  </Toast.Title>
                  {toast.description && (
                    <Toast.Description className="text-gray-600 text-sm mt-1">
                      {toast.description}
                    </Toast.Description>
                  )}
                </div>
                
                <Toast.CloseTrigger className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600 flex-shrink-0">
                  <X className="w-4 h-4" />
                </Toast.CloseTrigger>
              </div>
            </Toast.Root>
          );
        }}
      </Toaster>
    </Portal>
  );
}
