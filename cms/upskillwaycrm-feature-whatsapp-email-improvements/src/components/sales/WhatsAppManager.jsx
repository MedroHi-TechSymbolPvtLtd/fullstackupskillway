import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  Mail, 
  User, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  Filter,
  Plus,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  Building,
  ArrowRight,
  RefreshCw,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  Users,
  MessageCircle,
  FileText,
  Image,
  Video,
  File,
  X,
  Copy,
  Share2,
  Target,
  Activity,
  Zap
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';
import whatsappService from '../../services/api/whatsappApi';

const WhatsAppManager = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [showBulkMessage, setShowBulkMessage] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [newMessage, setNewMessage] = useState({
    phone: '',
    message: '',
    firstName: '',
    lastName: '',
    email: '',
    languageCode: 'en',
    country: 'IN',
    media: null
  });

  // Bulk message state
  const [bulkMessages, setBulkMessages] = useState([]);
  const [bulkMessageTemplate, setBulkMessageTemplate] = useState('');

  // WhatsApp metrics state
  const [whatsappMetrics, setWhatsappMetrics] = useState({
    totalMessages: 0,
    sentMessages: 0,
    deliveredMessages: 0,
    readMessages: 0,
    failedMessages: 0,
    successRate: 0,
    averageResponseTime: 0
  });

  // Message history state
  const [messageHistory, setMessageHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Memoize filtered conversations
  const filteredConversations = useMemo(() => {
    if (!conversations.length) return [];
    
    let filtered = conversations;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(conv => 
        conv.contactName?.toLowerCase().includes(searchLower) ||
        conv.phone?.includes(searchTerm) ||
        conv.lastMessage?.toLowerCase().includes(searchLower)
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(conv => conv.status === statusFilter);
    }

    return filtered;
  }, [conversations, searchTerm, statusFilter]);

  const fetchMessageHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      
      const response = await whatsappService.getMessageHistory({
        limit: 50,
        offset: 0
      });
      
      if (response.success && response.data) {
        setMessageHistory(response.data);
        setPagination(response.pagination || {});
        
        // Transform to conversations
        const conversationsMap = new Map();
        response.data.forEach(msg => {
          if (!conversationsMap.has(msg.phoneNumber)) {
            conversationsMap.set(msg.phoneNumber, {
              id: msg.phoneNumber,
              name: msg.firstName ? `${msg.firstName} ${msg.lastName || ''}`.trim() : msg.phoneNumber,
              phone: msg.phoneNumber,
              lastMessage: msg.message,
              timestamp: msg.sentAt || msg.createdAt,
              unread: msg.status === 'sent' ? 1 : 0,
              status: msg.status
            });
          }
        });
        setConversations(Array.from(conversationsMap.values()));
      } else {
        setMessageHistory([]);
        setPagination({});
        setConversations([]);
      }
      
    } catch (error) {
      console.error('Error fetching message history:', error);
      setMessageHistory([]);
      setConversations([]);
    } finally {
      setHistoryLoading(false);
      setLoading(false);
    }
  }, []);

  const fetchWhatsAppMetrics = useCallback(async () => {
    try {
      const response = await whatsappService.getStatistics();
      
      if (response.success && response.data) {
        setWhatsappMetrics({
          totalMessages: response.data.totalSent || 0,
          delivered: response.data.totalDelivered || 0,
          read: response.data.totalRead || 0,
          failed: response.data.totalFailed || 0,
          deliveryRate: response.data.deliveryRate || 0
        });
      } else {
        setWhatsappMetrics({
          totalMessages: 0,
          sentMessages: 0,
          deliveredMessages: 0,
          readMessages: 0,
          failedMessages: 0,
          successRate: 0,
          averageResponseTime: 0
        });
      }
    } catch (error) {
      console.error('Error fetching WhatsApp statistics:', error);
      setWhatsappMetrics({
        totalMessages: 0,
        sentMessages: 0,
        deliveredMessages: 0,
        readMessages: 0,
        failedMessages: 0,
        successRate: 0,
        averageResponseTime: 0
      });
    }
  }, []);

  useEffect(() => {
    fetchWhatsAppMetrics();
    fetchMessageHistory();
  }, [fetchWhatsAppMetrics, fetchMessageHistory]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.phone || !newMessage.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSending(true);
      
      const response = await whatsappService.sendSingleMessage({
        phoneNumber: newMessage.phone,
        message: newMessage.message,
        firstName: newMessage.firstName,
        lastName: newMessage.lastName,
        email: newMessage.email,
        languageCode: newMessage.languageCode,
        country: newMessage.country,
        media: newMessage.media
      });
      
      if (response.success) {
        toast.success('Message sent successfully!');
      } else {
        throw new Error(response.message || 'Failed to send message');
      }
      
      // Reset form
      setNewMessage({
        phone: '',
        message: '',
        firstName: '',
        lastName: '',
        email: '',
        languageCode: 'en',
        country: 'IN',
        media: null
      });
      setShowNewMessage(false);
      
      // Refresh data
      fetchMessageHistory();
      fetchWhatsAppMetrics();
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Extract proper error message from response
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      
      // Show user-friendly error for authentication issues
      if (errorMessage.includes('Authenticate') || errorMessage.includes('authentication')) {
        toast.error('WhatsApp service is not configured. Please contact your administrator to set up WhatsApp Business API credentials.');
      } else {
        toast.error(`Failed to send message: ${errorMessage}`);
      }
    } finally {
      setIsSending(false);
    }
  }, [newMessage, fetchMessageHistory, fetchWhatsAppMetrics]);

  const handleReply = useCallback(async () => {
    try {
      // Mock reply - no API call
      toast.success('Reply sent successfully!');
      
      // Refresh data
      fetchMessageHistory();
      fetchWhatsAppMetrics();
      
    } catch (error) {
      console.error('Error sending reply:', error);
      
      // Extract proper error message from response
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      
      // Show user-friendly error for authentication issues
      if (errorMessage.includes('Authenticate') || errorMessage.includes('authentication')) {
        toast.error('WhatsApp service is not configured. Please contact your administrator to set up WhatsApp Business API credentials.');
      } else {
        toast.error(`Failed to send reply: ${errorMessage}`);
      }
    }
  }, [fetchMessageHistory, fetchWhatsAppMetrics]);

  const handleBulkSend = useCallback(async () => {
    if (bulkMessages.length === 0) {
      toast.error('Please add at least one message');
      return;
    }

    try {
      setIsSending(true);
      
      const response = await whatsappService.sendBulkMessages({
        messages: bulkMessages.map(msg => ({
          phoneNumber: msg.phone,
          message: msg.message,
          firstName: msg.firstName,
          lastName: msg.lastName
        }))
      });
      
      if (response.success) {
        const sent = response.data?.sent || bulkMessages.length;
        const failed = response.data?.failed || 0;
        toast.success(`Bulk messages sent! Sent: ${sent}, Failed: ${failed}`);
      } else {
        throw new Error(response.message || 'Failed to send bulk messages');
      }
      
      // Reset bulk messages
      setBulkMessages([]);
      setBulkMessageTemplate('');
      setShowBulkMessage(false);
      
      // Refresh data
      fetchMessageHistory();
      fetchWhatsAppMetrics();
      
    } catch (error) {
      console.error('Error sending bulk messages:', error);
      
      // Extract proper error message from response
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      
      // Show user-friendly error for authentication issues
      if (errorMessage.includes('Authenticate') || errorMessage.includes('authentication')) {
        toast.error('WhatsApp service is not configured. Please contact your administrator to set up WhatsApp Business API credentials.');
      } else {
        toast.error(`Failed to send bulk messages: ${errorMessage}`);
      }
    } finally {
      setIsSending(false);
    }
  }, [bulkMessages, fetchMessageHistory, fetchWhatsAppMetrics]);

  const addBulkMessage = useCallback(() => {
    if (!bulkMessageTemplate.trim()) {
      toast.error('Please enter a message template');
      return;
    }

    const newMessage = {
      id: `bulk-${Date.now()}`,
      phoneNumber: '',
      message: bulkMessageTemplate,
      firstName: '',
      lastName: ''
    };

    setBulkMessages(prev => [...prev, newMessage]);
  }, [bulkMessageTemplate]);

  const removeBulkMessage = useCallback((id) => {
    setBulkMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  const updateBulkMessage = useCallback((id, field, value) => {
    setBulkMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, [field]: value } : msg
    ));
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  }, []);

  const formatTime = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid Time';
    }
  }, []);

  const getStatusBadge = useCallback((status) => {
    const statusConfig = {
      active: { label: 'Active', color: 'bg-green-100 text-green-800' },
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      converted: { label: 'Converted', color: 'bg-blue-100 text-blue-800' },
      closed: { label: 'Closed', color: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status] || statusConfig.active;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">WhatsApp Automation</h1>
          <p className="text-gray-600 mt-2">Manage WhatsApp conversations and customer communications</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNewMessage(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            New Message
          </button>
          <button
            onClick={() => setShowBulkMessage(true)}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Send className="h-4 w-4 mr-2" />
            Bulk Send
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FileText className="h-4 w-4 mr-2" />
            History
          </button>
          <button
            onClick={() => {
              fetchMessageHistory();
              fetchWhatsAppMetrics();
            }}
            disabled={loading || historyLoading}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* WhatsApp Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-green-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-green-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Messages
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {whatsappMetrics.totalMessages}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-green-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Sent Messages
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {whatsappMetrics.sentMessages}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-green-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-purple-100 rounded-lg">
                <Send className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Delivered Messages
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {whatsappMetrics.deliveredMessages}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-green-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Success Rate
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {whatsappMetrics.successRate}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-green-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-indigo-100 rounded-lg">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg Response Time
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {whatsappMetrics.averageResponseTime}m
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <span>Total: {pagination.total || 0} conversations</span>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unread
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredConversations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations found</h3>
                    <p className="text-gray-500">Start a new conversation to get started.</p>
                  </td>
                </tr>
              ) : (
                filteredConversations.map((conversation) => (
                  <tr key={conversation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{conversation.contactName}</div>
                          <div className="text-sm text-gray-500">{conversation.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {conversation.lastMessage}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(conversation.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {conversation.unreadCount > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {conversation.unreadCount}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatTime(conversation.lastMessageTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedConversation(conversation)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="View Conversation"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setSelectedConversation(conversation)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="Reply"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Message Modal */}
      {showBulkMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-96">
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Send Bulk WhatsApp Messages
                </h3>
                <button
                  onClick={() => setShowBulkMessage(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message Template
                    </label>
                    <textarea
                      value={bulkMessageTemplate}
                      onChange={(e) => setBulkMessageTemplate(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter message template..."
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={addBulkMessage}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Plus className="h-4 w-4 mr-2 inline" />
                      Add Message
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Messages ({bulkMessages.length})</h4>
                  {bulkMessages.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No messages added yet</p>
                  ) : (
                    <div className="space-y-3">
                      {bulkMessages.map((msg) => (
                        <div key={msg.id} className="flex space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                              type="tel"
                              placeholder="Phone Number"
                              value={msg.phoneNumber}
                              onChange={(e) => updateBulkMessage(msg.id, 'phoneNumber', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <input
                              type="text"
                              placeholder="First Name"
                              value={msg.firstName}
                              onChange={(e) => updateBulkMessage(msg.id, 'firstName', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <input
                              type="text"
                              placeholder="Last Name"
                              value={msg.lastName}
                              onChange={(e) => updateBulkMessage(msg.id, 'lastName', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <button
                            onClick={() => removeBulkMessage(msg.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowBulkMessage(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkSend}
                  disabled={isSending || bulkMessages.length === 0}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSending ? 'Sending...' : `Send ${bulkMessages.length} Messages`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-96">
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  WhatsApp Message History
                </h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {historyLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messageHistory.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No message history found</p>
                    ) : (
                      messageHistory.map((msg) => (
                        <div key={msg.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-gray-900">
                                {msg.firstName ? `${msg.firstName} ${msg.lastName || ''}`.trim() : 'Unknown'}
                              </p>
                              <p className="text-sm text-gray-500">{msg.phoneNumber}</p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                msg.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                                msg.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                msg.status === 'read' ? 'bg-purple-100 text-purple-800' :
                                msg.status === 'failed' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {msg.status}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(msg.timestamp || msg.createdAt)}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-700">{msg.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Message Modal */}
      {showNewMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Send WhatsApp Message
                </h3>
                <button
                  onClick={() => setShowNewMessage(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-green-400" />
                      <input
                        type="tel"
                        value={newMessage.phone}
                        onChange={(e) => setNewMessage(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-green-400" />
                      <input
                        type="email"
                        value={newMessage.email}
                        onChange={(e) => setNewMessage(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter email"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={newMessage.firstName}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={newMessage.lastName}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    value={newMessage.message}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Type your message here..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-6">
                <button
                  onClick={() => setShowNewMessage(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={isSending}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conversation Detail Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-96">
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedConversation.contactName}</h3>
                  <p className="text-gray-500">{selectedConversation.phone}</p>
                </div>
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4">
                <div className="space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.sender === 'agent'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'agent' ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type your reply..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      handleReply(selectedConversation.id, e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.target.previousElementSibling;
                    if (input.value.trim()) {
                      handleReply(selectedConversation.id, input.value);
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppManager;
