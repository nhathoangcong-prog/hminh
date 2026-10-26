import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  Plus,
  Calendar,
  FileCheck,
  BookOpen,
  Info,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppNotification } from '../types';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification, addNotification } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [filterRead, setFilterRead] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newType, setNewType] = useState<AppNotification['type']>('exam');

  const filteredNotifs = notifications.filter((n) => {
    const matchType = filterType === 'all' || n.type === filterType;
    const matchRead =
      filterRead === 'all' ? true : filterRead === 'unread' ? !n.read : n.read;
    return matchType && matchRead;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleCreateNotif = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addNotification(newTitle.trim(), newDetails.trim(), newType);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDetails('');
  };

  return (
    <div className="space-y-6 pb-12 font-serif">
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="w-6 h-6 text-rose-500" />
            Trung Tâm Thông Báo & Nhắc Việc
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi hạn nộp bài kiểm tra, bài làm mới nộp và lời nhắc sư phạm môn Toán
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
            >
              <CheckCheck className="w-4 h-4 text-blue-600" />
              Đánh dấu tất cả đã đọc
            </button>
          )}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tạo nhắc việc mới
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <select
            value={filterRead}
            onChange={(e) => setFilterRead(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium"
          >
            <option value="all">Tất cả thông báo ({notifications.length})</option>
            <option value="unread">Chưa đọc ({unreadCount})</option>
            <option value="read">Đã đọc</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium"
          >
            <option value="all">Mọi loại danh mục</option>
            <option value="exam">Bài kiểm tra & Thi cử</option>
            <option value="document">Học liệu & Giáo án</option>
            <option value="grade">Điểm số & Sổ điểm</option>
            <option value="schedule">Lịch trình</option>
            <option value="system">Hệ thống</option>
          </select>
        </div>

        <span className="text-slate-400">
          Hiển thị {filteredNotifs.length} thông báo
        </span>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-400">
            <Bell className="w-10 h-10 text-slate-200 mx-auto mb-2" />
            <p className="font-semibold text-sm">Không có thông báo nào trong mục này.</p>
          </div>
        ) : (
          filteredNotifs.map((item) => {
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                  !item.read
                    ? 'bg-blue-50/40 border-blue-200 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      item.type === 'exam'
                        ? 'bg-blue-100 text-blue-700'
                        : item.type === 'document'
                        ? 'bg-emerald-100 text-emerald-700'
                        : item.type === 'grade'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {item.type === 'exam' ? (
                      <FileCheck className="w-5 h-5" />
                    ) : item.type === 'document' ? (
                      <BookOpen className="w-5 h-5" />
                    ) : (
                      <Calendar className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm ${
                          !item.read ? 'font-bold text-blue-900' : 'font-semibold text-slate-800'
                        }`}
                      >
                        {item.title}
                      </h4>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                      )}
                    </div>

                    {item.details && (
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {item.details}
                      </p>
                    )}

                    <span className="text-[11px] text-slate-400 mt-2 block">
                      Ngày thông báo: {item.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 flex-shrink-0">
                  {!item.read && (
                    <button
                      onClick={() => markNotificationRead(item.id)}
                      title="Đánh dấu đã đọc"
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded cursor-pointer"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(item.id)}
                    title="Xóa thông báo"
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: Tạo lời nhắc mới */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Tạo lời nhắc việc sư phạm</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotif} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tiêu đề thông báo *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Nhắc nhở chấm bài kiểm tra 12A1"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phân loại</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="exam">Bài kiểm tra & Đề thi</option>
                  <option value="document">Giáo án & Học liệu</option>
                  <option value="grade">Điểm số & Nhập điểm</option>
                  <option value="schedule">Lịch họp / kiểm tra</option>
                  <option value="system">Hệ thống</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Chi tiết nội dung</label>
                <textarea
                  rows={3}
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  placeholder="Nội dung cụ thể, lớp cần kiểm tra hoặc hạn chót hoàn thành..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded border border-slate-200 text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow"
                >
                  Thêm thông báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
