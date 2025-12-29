import { useState } from 'react';

/**
 * TAP TO ZOOM 放大功能組件
 */
export default function ZoomModal({ children, isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="zoom-overlay" onClick={onClose}>
            <div className="zoom-content" onClick={(e) => e.stopPropagation()}>
                <button className="zoom-close" onClick={onClose}>✕</button>
                <div className="zoom-chart">
                    {children}
                </div>
            </div>

            <style>{`
        .zoom-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .zoom-content {
          position: relative;
          width: 100%;
          max-width: 1200px;
          max-height: 90vh;
          overflow: auto;
        }
        
        .zoom-close {
          position: absolute;
          top: -40px;
          right: 0;
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 24px;
          cursor: pointer;
          padding: 8px;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        
        .zoom-close:hover {
          opacity: 1;
        }
        
        .zoom-chart {
          background: var(--bg-card);
          border-radius: 12px;
          padding: 20px;
        }
      `}</style>
        </div>
    );
}

/**
 * TAP TO ZOOM 按鈕組件
 */
export function ZoomTrigger({ onClick }) {
    return (
        <button className="zoom-trigger" onClick={onClick}>
            TAP TO ZOOM
            <style>{`
        .zoom-trigger {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(59, 130, 246, 0.2);
          border: 1px solid var(--accent-blue);
          color: var(--accent-blue);
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.3px;
        }
        
        .zoom-trigger:hover {
          background: rgba(59, 130, 246, 0.3);
        }
      `}</style>
        </button>
    );
}
