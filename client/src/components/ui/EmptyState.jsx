import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {icon && (
        <div className="w-20 h-20 rounded-3xl bg-surface-2 border border-white/6 flex items-center justify-center mb-5">
          <span className="text-4xl">{icon}</span>
        </div>
      )}
      <h3 className="font-display text-heading-md text-white mb-2">{title}</h3>
      {description && (
        <p className="text-body-sm text-white/50 max-w-sm">{description}</p>
      )}
      {(actionLabel && actionTo) && (
        <Link
          to={actionTo}
          className="btn-primary mt-6"
        >
          {actionLabel}
        </Link>
      )}
      {(actionLabel && onAction && !actionTo) && (
        <button onClick={onAction} className="btn-primary mt-6">
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
