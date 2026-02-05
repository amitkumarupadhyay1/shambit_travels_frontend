'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const BackendStatus = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkBackendStatus = useCallback(async () => {
    setStatus('checking');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/cities/`, {
        method: 'HEAD',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setStatus('connected');
      } else {
        setStatus('disconnected');
      }
    } catch {
      setStatus('disconnected');
    }
    setLastChecked(new Date());
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const performCheck = async () => {
      if (mounted) {
        await checkBackendStatus();
      }
    };
    
    performCheck();
    const interval = setInterval(() => {
      if (mounted) {
        performCheck();
      }
    }, 30000); // Check every 30 seconds
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [checkBackendStatus]);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking backend...';
      case 'connected':
        return 'Backend connected';
      case 'disconnected':
        return 'Backend disconnected';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'text-yellow-600';
      case 'connected':
        return 'text-green-600';
      case 'disconnected':
        return 'text-red-600';
    }
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={cn(
        'bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200',
        'flex items-center space-x-2 text-sm'
      )}>
        {getStatusIcon()}
        <span className={getStatusColor()}>
          {getStatusText()}
        </span>
        {lastChecked && (
          <span className="text-gray-400 text-xs">
            {lastChecked.toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default BackendStatus;