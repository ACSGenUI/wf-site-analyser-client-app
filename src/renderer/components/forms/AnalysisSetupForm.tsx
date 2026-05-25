import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const analysisSetupSchema = z.object({
  url: z
    .string()
    .min(1, 'URL is required')
    .url('Must be a valid URL'),
  maxPages: z
    .number({ invalid_type_error: 'Must be a number' })
    .int('Must be a whole number')
    .min(1, 'Must crawl at least 1 page')
    .max(500, 'Cannot exceed 500 pages')
    .default(50),
  figmaUrl: z
    .string()
    .url('Must be a valid Figma URL')
    .optional()
    .or(z.literal('')),
});

export type AnalysisSetupFormValues = z.infer<typeof analysisSetupSchema>;

interface AnalysisSetupFormProps {
  onSubmit: (values: AnalysisSetupFormValues) => void;
}

export function AnalysisSetupForm({ onSubmit }: AnalysisSetupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AnalysisSetupFormValues>({
    resolver: zodResolver(analysisSetupSchema),
    defaultValues: { maxPages: 50 },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="url" className="text-sm font-medium text-neutral-200">
          Site URL
        </label>
        <input
          id="url"
          type="text"
          placeholder="https://example.com"
          className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('url')}
        />
        {errors.url && (
          <p role="alert" className="text-xs text-red-400">
            {errors.url.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="maxPages" className="text-sm font-medium text-neutral-200">
          Max pages
        </label>
        <input
          id="maxPages"
          type="number"
          className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('maxPages', { valueAsNumber: true })}
        />
        {errors.maxPages && (
          <p role="alert" className="text-xs text-red-400">
            {errors.maxPages.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="figmaUrl" className="text-sm font-medium text-neutral-200">
          Figma URL <span className="text-neutral-500">(optional)</span>
        </label>
        <input
          id="figmaUrl"
          type="text"
          placeholder="https://figma.com/file/..."
          className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('figmaUrl')}
        />
        {errors.figmaUrl && (
          <p role="alert" className="text-xs text-red-400">
            {errors.figmaUrl.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
      >
        Start Analysis
      </button>
    </form>
  );
}
