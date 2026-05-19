import { motion } from 'framer-motion';

export default function ErrorState({ message, onRetry, compact }) {
  if (compact) {
    return (
      <div className="alert-error flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-body-sm">{message || 'Something went wrong'}</p>
        </div>
        {onRetry && (
          <button onClick={onRetry} className="btn-secondary text-caption px-3 py-1.5 shrink-0">
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mb-4">
        <svg className="w-7 h-7 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h3 className="font-display text-heading-sm text-white mb-1.5">Something went wrong</h3>
      <p className="text-body-sm text-white/50 max-w-sm mb-5">
        {message || 'An unexpected error occurred. Please try again.'}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Try Again
        </button>
      )}
    </motion.div>
  );
}
