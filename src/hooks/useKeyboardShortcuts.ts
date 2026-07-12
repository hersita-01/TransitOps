import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/context/ToastContext';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K -> Search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // Fire custom event to open command palette if you have one, or just show a toast for now
        document.dispatchEvent(new CustomEvent('open-command-palette'));
        toast('info', 'Search', 'Command palette triggered (Ctrl+K)');
      }

      // Alt+D -> Dashboard
      if (e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        navigate('/dashboard');
      }

      // Alt+F -> Fleet
      if (e.altKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        navigate('/fleet');
      }

      // Alt+T -> Trips
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        navigate('/trips');
      }

      // Alt+M -> Maintenance
      if (e.altKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        navigate('/maintenance');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, toast]);
}
