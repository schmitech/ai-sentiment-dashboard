import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, MoreVertical, Eye, Mail, PhoneCall, RefreshCw, DollarSign, MessageSquare, Flag, CheckCircle, ClipboardList, UserCog } from 'lucide-react';
import type { Review } from '../types';

interface AlertsTableProps {
  reviews: Review[];
}

export function AlertsTable({ reviews }: AlertsTableProps) {
  const negativeReviews = reviews.filter(review => review.sentiment === 'negative');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (reviewId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setOpenDropdown(openDropdown === reviewId ? null : reviewId);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {negativeReviews.map((review) => (
              <tr key={review.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-500">Needs Action</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{review.productName}</td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-900 truncate max-w-md">{review.text}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{review.customerName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="dropdown-container relative inline-block">
                    <button
                      onClick={(e) => toggleDropdown(review.id, e)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    {openDropdown === review.id && (
                      <div 
                        className="fixed transform -translate-x-[14rem] mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                        style={{ zIndex: 1000 }}
                      >
                        <div className="py-1 divide-y divide-gray-100" role="menu">
                          {/* View Details */}
                          <div className="px-1 py-1">
                            <button
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md flex items-center group"
                              role="menuitem"
                            >
                              <Eye className="w-4 h-4 mr-2 group-hover:text-blue-500" />
                              View Details
                            </button>
                          </div>

                          {/* Contact Actions */}
                          <div className="px-1 py-1">
                            <button
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md flex items-center group"
                              role="menuitem"
                            >
                              <Mail className="w-4 h-4 mr-2 group-hover:text-blue-500" />
                              Send Email
                            </button>
                            <button
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md flex items-center group"
                              role="menuitem"
                            >
                              <PhoneCall className="w-4 h-4 mr-2 group-hover:text-blue-500" />
                              Schedule Call
                            </button>
                          </div>

                          {/* Follow-up Actions */}
                          <div className="px-1 py-1">
                            <button
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md flex items-center group"
                              role="menuitem"
                            >
                              <MessageSquare className="w-4 h-4 mr-2 group-hover:text-blue-500" />
                              Add Follow-up Note
                            </button>
                            <button
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md flex items-center group"
                              role="menuitem"
                            >
                              <ClipboardList className="w-4 h-4 mr-2 group-hover:text-blue-500" />
                              Create Task
                            </button>
                          </div>

                          {/* Resolution Actions */}
                          <div className="px-1 py-1">
                            <button
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md flex items-center group"
                              role="menuitem"
                            >
                              <DollarSign className="w-4 h-4 mr-2 group-hover:text-blue-500" />
                              Issue Refund
                            </button>
                            <button
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md flex items-center group"
                              role="menuitem"
                            >
                              <RefreshCw className="w-4 h-4 mr-2 group-hover:text-blue-500" />
                              Process Exchange
                            </button>
                          </div>

                          {/* Escalation Actions */}
                          <div className="px-1 py-1">
                            <button
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md flex items-center group"
                              role="menuitem"
                            >
                              <UserCog className="w-4 h-4 mr-2 group-hover:text-blue-500" />
                              Escalate to Manager
                            </button>
                            <button
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md flex items-center group"
                              role="menuitem"
                            >
                              <Flag className="w-4 h-4 mr-2 group-hover:text-blue-500" />
                              Flag for Review
                            </button>
                          </div>

                          {/* Resolution */}
                          <div className="px-1 py-1">
                            <button
                              className="w-full text-left px-3 py-2 text-sm text-green-700 hover:bg-green-50 rounded-md flex items-center group"
                              role="menuitem"
                            >
                              <CheckCircle className="w-4 h-4 mr-2 group-hover:text-green-600" />
                              Mark as Resolved
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}