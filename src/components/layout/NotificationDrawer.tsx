import React from 'react';
import { X, CheckCheck, AlertTriangle, Info, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useFarm, NavigationModule } from '../../lib/context/FarmContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, setActiveModule, t } = useFarm();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div className="w-full max-w-md h-full bg-[#0a2318] border-l border-emerald-500/30 p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
          <div>
            <h3 className="font-extrabold text-lg text-white font-display">{t('notif_title', 'Farm Notifications')}</h3>
            <p className="text-xs text-slate-400">{t('notif_subtitle', 'Autonomous rule & agronomic alerts')}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs flex items-center gap-1 transition"
              title={t('notif_mark_all', 'Mark all as read')}
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">{t('notif_mark_all', 'Mark read')}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 scrollbar-thin">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p>{t('notif_empty', 'No notifications right now.')}</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const getIcon = () => {
                switch (notif.type) {
                  case 'critical':
                    return <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />;
                  case 'warning':
                    return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />;
                  case 'success':
                    return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />;
                  default:
                    return <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />;
                }
              };

              return (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    notif.read
                      ? 'bg-[#0d2e20]/40 border-white/5 opacity-75'
                      : 'bg-[#0d2e20] border-emerald-500/30 shadow-lg'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon()}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-bold text-white leading-snug">{notif.title}</h4>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2">{notif.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mb-2.5">{notif.message}</p>

                      {notif.actionModule && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveModule(notif.actionModule as NavigationModule);
                            onClose();
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                        >
                          <span>Open {notif.actionModule} module</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
