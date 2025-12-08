import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Mail, 
  Send, 
  Phone, 
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
  MessageSquare,
  Paperclip,
  Star,
  Archive,
  Reply,
  Forward,
  Inbox,
  ExternalLink,
  FileText,
  Ban
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';
import emailApi from '../../services/api/emailApi';

const EmailManager = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [folderFilter, setFolderFilter] = useState('inbox');
  const [currentPage, setCurrentPage] = useState(1);
  const [, setPagination] = useState({});
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showNewEmail, setShowNewEmail] = useState(false);
  const [showBulkEmail, setShowBulkEmail] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyToEmail, setReplyToEmail] = useState(null);
  const [newEmail, setNewEmail] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    attachments: []
  });
  
  // Bulk email state
  const [bulkEmails, setBulkEmails] = useState([
    { to: '', toName: '', subject: '', html: '', text: '' }
  ]);
  const [isSendingBulk, setIsSendingBulk] = useState(false);
  
  // Bulk email handlers
  const addBulkEmailRow = () => {
    setBulkEmails([...bulkEmails, { to: '', toName: '', subject: '', html: '', text: '' }]);
  };
  
  const removeBulkEmailRow = (index) => {
    setBulkEmails(bulkEmails.filter((_, i) => i !== index));
  };
  
  const updateBulkEmail = (index, field, value) => {
    const updated = [...bulkEmails];
    updated[index][field] = value;
    setBulkEmails(updated);
  };
  
  const handleSendBulkEmails = async () => {
    // Validate bulk emails
    const validEmails = bulkEmails.filter(email => 
      email.to && email.subject && (email.html || email.text)
    );
    
    if (validEmails.length === 0) {
      toast.error('Please fill in at least one complete email (to, subject, and content)');
      return;
    }
    
    try {
      setIsSendingBulk(true);
      
      const response = await emailApi.sendBulkEmails(
        validEmails,
        {
          name: 'UpSkillWay',
          email: 'info@upskillway.com'
        },
        'api',
        true
      );
      
      if (response.success) {
        toast.success(`Bulk emails sent successfully! Sent: ${response.data?.sent || validEmails.length}, Failed: ${response.data?.failed || 0}`);
        setBulkEmails([{ to: '', toName: '', subject: '', html: '', text: '' }]);
        setShowBulkEmail(false);
        fetchEmails();
      } else {
        toast.error(response.message || 'Failed to send bulk emails');
      }
    } catch (error) {
      console.error('Error sending bulk emails:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send bulk emails';
      toast.error(errorMessage);
    } finally {
      setIsSendingBulk(false);
    }
  };

  // Email metrics state
  const [emailMetrics, setEmailMetrics] = useState({
    totalEmails: 0,
    unreadEmails: 0,
    sentEmails: 0,
    openRate: 0,
    replyRate: 0
  });

  // Debounce search input handler
  

  // Memoize filtered emails to avoid recalculation
  const filteredEmails = useMemo(() => {
    if (!emails.length) return [];
    
    let filtered = emails;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(email => 
        email.subject?.toLowerCase().includes(searchLower) ||
        email.fromName?.toLowerCase().includes(searchLower) ||
        email.body?.toLowerCase().includes(searchLower) ||
        email.from?.toLowerCase().includes(searchLower)
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(email => email.status === statusFilter);
    }

    if (folderFilter) {
      filtered = filtered.filter(email => email.folder === folderFilter);
    }

    return filtered;
  }, [emails, searchTerm, statusFilter, folderFilter]);

  // Memoize email metrics calculation
  const calculatedMetrics = useMemo(() => {
    const totalEmails = emails.length;
    const unreadEmails = emails.filter(email => email.status === 'unread').length;
    const sentEmails = emails.filter(email => email.folder === 'sent').length;
    const openRate = emails.length > 0 ? 
      (emails.filter(email => email.status === 'read' || email.status === 'sent').length / emails.length) * 100 : 0;
    const replyRate = emails.length > 0 ? 
      (emails.filter(email => email.tags?.includes('follow-up') || email.tags?.includes('reply')).length / emails.length) * 100 : 0;
    
    return {
      totalEmails,
      unreadEmails,
      sentEmails,
      openRate: Math.round(openRate * 100) / 100,
      replyRate: Math.round(replyRate * 100) / 100
    };
  }, [emails]);

  useEffect(() => {
    setEmailMetrics(calculatedMetrics);
  }, [calculatedMetrics]);

  const fetchEmails = useCallback(async () => {
    try {
      setLoading(true);
      console.log('📧 Fetching email history from API...');
      
      // Call the real email history API
      const response = await emailApi.getEmailHistory({
        page: currentPage,
        limit: 10,
        status: statusFilter || undefined,
        search: searchTerm || undefined
      });

      if (response.success) {
        console.log('✅ Email history fetched:', response);
        
        // Extract emails from nested response structure
        // Response structure: { success: true, data: { success: true, emails: [...], totalCount: 29 } }
        const emailsArray = response.data?.data?.emails || response.data?.emails || [];
        
        console.log('📧 Emails array length:', emailsArray.length);
        
        // Transform API response to match component format
        const transformedEmails = emailsArray.map(email => ({
          id: email.id || `email-${Date.now()}-${Math.random()}`,
          from: 'info@upskillway.com', // Sender (your system)
          fromName: 'UpSkillWay',
          to: email.to || '',
          subject: email.subject || 'No Subject',
          body: email.brevoResponse?.messageId || email.error || 'Email sent via API',
          timestamp: email.createdAt || new Date().toISOString(),
          status: email.status === 'SENT' ? 'sent' : email.status === 'FAILED' ? 'failed' : 'sent',
          folder: 'sent', // All history emails are sent
          priority: 'normal',
          attachments: [],
          leadId: null,
          tags: [email.transport || 'api'],
          messageId: email.messageId || null,
          method: email.transport || 'api',
          userId: email.userId,
          userRole: email.userRole,
          error: email.error || null
        }));

        // Apply folder filter on client side if needed
        let filteredEmails = transformedEmails;
        if (folderFilter && folderFilter !== 'inbox') {
          filteredEmails = transformedEmails.filter(email => 
            email.folder === folderFilter
          );
        }

        setEmails(filteredEmails);
        
        // Use totalCount from API response
        const totalCount = response.data?.data?.totalCount || filteredEmails.length;
        setPagination({
          total: totalCount,
          totalPages: Math.ceil(totalCount / 10),
          currentPage: currentPage,
          hasNext: response.data?.data?.hasMore || false,
          hasPrev: currentPage > 1
        });
        
        console.log('✅ Emails loaded:', filteredEmails.length, 'Total:', totalCount);
      } else {
        throw new Error(response.message || 'Failed to fetch email history');
      }
      
    } catch (error) {
      console.error('❌ Error fetching emails:', error);
      toast.error(`Failed to load emails: ${error.response?.data?.message || error.message || 'Unknown error'}`);
      
      // Set empty state on error
      setEmails([]);
      setPagination({
        total: 0,
        totalPages: 0,
        currentPage: 1,
        hasNext: false,
        hasPrev: false
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, folderFilter, searchTerm]);

  // Fetch emails on mount and when dependencies change
  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = useCallback(async () => {
    if (!newEmail.to || !newEmail.subject || !newEmail.body) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isSending) {
      return; // Prevent double submission
    }

    try {
      setIsSending(true);
      console.log('📧 Sending email via API...');
      
      // Call the real email API
      const response = await emailApi.sendEmail({
        to: newEmail.to,
        toName: newEmail.to.split('@')[0], // Extract name from email
        subject: newEmail.subject,
        html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
                 <p>${newEmail.body.replace(/\n/g, '<br>')}</p>
               </div>`,
        text: newEmail.body,
        from: {
          name: 'UpSkillWay',
          email: 'info@upskillway.com'
        },
        transport: 'api',
        queue: false
      });

      if (response.success) {
        toast.success('Email sent successfully!');
        console.log('✅ Email sent:', response);
        
        // Reset form
        setNewEmail({
          to: '',
          cc: '',
          bcc: '',
          subject: '',
          body: '',
          attachments: []
        });
        setShowNewEmail(false);
        
        // Refresh emails to show the newly sent email
        fetchEmails();
      } else {
        throw new Error(response.message || 'Failed to send email');
      }
      
    } catch (error) {
      console.error('❌ Error sending email:', error);
      toast.error(`Failed to send email: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    } finally {
      setIsSending(false);
    }
  }, [newEmail, fetchEmails, isSending]);

  const handleReply = useCallback(async (email) => {
    try {
      // Mock API call to send reply
      toast.success('Reply sent successfully!');
      
      // Update email status
      setEmails(prev => prev.map(e => {
        if (e.id === email.id) {
          return { ...e, status: 'replied' };
        }
        return e;
      }));
      
      setShowReplyModal(false);
      setReplyToEmail(null);
      
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error(`Failed to send reply: ${error.message || 'Unknown error'}`);
    }
  }, []);

  const handleMarkAsRead = useCallback(async (emailId) => {
    try {
      setEmails(prev => prev.map(email => {
        if (email.id === emailId) {
          return { ...email, status: 'read' };
        }
        return email;
      }));
      
      toast.success('Email marked as read');
    } catch (error) {
      console.error('Error marking email as read:', error);
      toast.error(`Failed to mark email as read: ${error.message || 'Unknown error'}`);
    }
  }, []);

  const handleDeleteEmail = useCallback(async (emailId) => {
    try {
      setEmails(prev => prev.filter(email => email.id !== emailId));
      toast.success('Email deleted successfully');
    } catch (error) {
      console.error('Error deleting email:', error);
      toast.error(`Failed to delete email: ${error.message || 'Unknown error'}`);
    }
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

  const getStatusBadge = useCallback((status) => {
    const statusConfig = {
      unread: { label: 'Unread', color: 'bg-blue-100 text-blue-800' },
      read: { label: 'Read', color: 'bg-green-100 text-green-800' },
      sent: { label: 'Sent', color: 'bg-purple-100 text-purple-800' },
      replied: { label: 'Replied', color: 'bg-orange-100 text-orange-800' },
      draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status] || statusConfig.read;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  }, []);

  const getPriorityBadge = useCallback((priority) => {
    const priorityConfig = {
      low: { label: 'Low', color: 'bg-gray-100 text-gray-800' },
      normal: { label: 'Normal', color: 'bg-blue-100 text-blue-800' },
      high: { label: 'High', color: 'bg-orange-100 text-orange-800' },
      urgent: { label: 'Urgent', color: 'bg-red-100 text-red-800' }
    };

    const config = priorityConfig[priority] || priorityConfig.normal;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
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
          <h1 className="text-3xl font-bold text-gray-900">Email Manager</h1>
          <p className="text-gray-600 mt-2">Manage email communications and customer inquiries</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowNewEmail(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Mail className="h-4 w-4 mr-2" />
            New Email
          </button>
          <button
            onClick={() => setShowBulkEmail(true)}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Users className="h-4 w-4 mr-2" />
            Bulk Email
          </button>
          <button
            onClick={fetchEmails}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Email Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-blue-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                <Inbox className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Emails
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {emailMetrics.totalEmails}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-blue-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-orange-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Unread Emails
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {emailMetrics.unreadEmails}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-blue-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-purple-100 rounded-lg">
                <Send className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Sent Emails
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {emailMetrics.sentEmails}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-blue-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Open Rate
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {emailMetrics.openRate}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-xl border border-blue-100">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 bg-indigo-100 rounded-lg">
                <Reply className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Reply Rate
                  </dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {emailMetrics.replyRate}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Folder Tabs */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Folder Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'inbox', label: 'Inbox', icon: Inbox },
              { key: 'sent', label: 'Sent', icon: Send },
              { key: 'draft', label: 'Draft', icon: FileText },
              { key: 'spam', label: 'Spam', icon: Ban }
            ].map((folder) => {
              const Icon = folder.icon;
              return (
                <button
                  key={folder.key}
                  onClick={() => {
                    setFolderFilter(folder.key);
                    setCurrentPage(1); // Reset to first page on folder change
                  }}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    folderFilter === folder.key
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {folder.label}
                </button>
              );
            })}
          </div>

          {/* Search and Filter */}
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1); // Reset to first page on filter change
                }}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="sent">Sent</option>
                <option value="replied">Replied</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Emails List */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From/To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attachments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmails.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No emails found</h3>
                    <p className="text-gray-500">Start by composing a new email.</p>
                  </td>
                </tr>
              ) : (
                filteredEmails.map((email) => (
                  <tr key={email.id} className={`hover:bg-gray-50 ${email.status === 'unread' ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {folderFilter === 'sent' ? email.to : email.fromName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {folderFilter === 'sent' ? email.to : email.from}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {email.subject}
                      </div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {email.body.substring(0, 50)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(email.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(email.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {email.attachments.length > 0 ? (
                        <div className="flex items-center">
                          <Paperclip className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">{email.attachments.length}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(email.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedEmail(email)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="View Email"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {email.status === 'unread' && (
                          <button
                            onClick={() => handleMarkAsRead(email.id)}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="Mark as Read"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setReplyToEmail(email);
                            setShowReplyModal(true);
                          }}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                          title="Reply"
                        >
                          <Reply className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEmail(email.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* New Email Modal */}
      {showNewEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8 max-h-[calc(100vh-4rem)]">
            <div className="flex flex-col max-h-[calc(100vh-4rem)]">
              {/* Header - Fixed */}
              <div className="flex-shrink-0 flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">Compose New Email</h3>
                </div>
                <button
                  onClick={() => setShowNewEmail(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isSending}
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {/* From Field (Read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    From
                  </label>
                  <input
                    type="email"
                    value="info@upskillway.com"
                    readOnly
                    className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg cursor-not-allowed"
                  />
                </div>

                {/* To Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    To <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newEmail.to}
                    onChange={(e) => setNewEmail(prev => ({ ...prev, to: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="recipient@example.com"
                    required
                    disabled={isSending}
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newEmail.subject}
                    onChange={(e) => setNewEmail(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email subject"
                    required
                    disabled={isSending}
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newEmail.body}
                    onChange={(e) => setNewEmail(prev => ({ ...prev, body: e.target.value }))}
                    rows={12}
                    className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Type your message here..."
                    required
                    disabled={isSending}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {newEmail.body.length} characters
                  </p>
                </div>
              </div>

              {/* Footer Actions - Fixed */}
              <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="text-sm text-gray-500">
                  <span className="text-red-500">*</span> Required fields
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowNewEmail(false)}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                    disabled={isSending}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendEmail}
                    disabled={!newEmail.to || !newEmail.subject || !newEmail.body || isSending}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isSending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Email</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Detail Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-96">
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedEmail.subject}</h3>
                  <div className="text-gray-500">
                    <span className="font-medium">{selectedEmail.fromName}</span> &lt;{selectedEmail.from}&gt;
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4">
                <div className="prose max-w-none">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedEmail.body}</p>
                </div>
                
                {selectedEmail.attachments.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">Attachments</h4>
                    <div className="space-y-2">
                      {selectedEmail.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                          <Paperclip className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-700">{attachment}</span>
                          <button className="ml-auto text-blue-600 hover:text-blue-800 text-sm">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setReplyToEmail(selectedEmail);
                    setShowReplyModal(true);
                    setSelectedEmail(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Reply className="h-4 w-4 mr-2 inline" />
                  Reply
                </button>
                <button
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Forward className="h-4 w-4 mr-2 inline" />
                  Forward
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && replyToEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-96">
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Reply to {replyToEmail.fromName}</h3>
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyToEmail(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <input
                    type="email"
                    value={replyToEmail.from}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={`Re: ${replyToEmail.subject}`}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type your reply here..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey && e.target.value.trim()) {
                        handleReply(replyToEmail, e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setReplyToEmail(null);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => {
                    const textarea = e.target.parentElement.parentElement.querySelector('textarea');
                    if (textarea.value.trim()) {
                      handleReply(replyToEmail, textarea.value);
                      textarea.value = '';
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Bulk Email Modal */}
      {showBulkEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl my-8 max-h-[calc(100vh-4rem)] flex flex-col">
            {/* Header - Fixed */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">Send Bulk Emails</h3>
              </div>
              <button
                onClick={() => setShowBulkEmail(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSendingBulk}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                {bulkEmails.map((email, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">Email #{index + 1}</h4>
                      {bulkEmails.length > 1 && (
                        <button
                          onClick={() => removeBulkEmailRow(index)}
                          className="text-red-600 hover:text-red-800"
                          disabled={isSendingBulk}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Recipient Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={email.to}
                          onChange={(e) => updateBulkEmail(index, 'to', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="recipient@example.com"
                          disabled={isSendingBulk}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Recipient Name
                        </label>
                        <input
                          type="text"
                          value={email.toName}
                          onChange={(e) => updateBulkEmail(index, 'toName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="John Doe"
                          disabled={isSendingBulk}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={email.subject}
                        onChange={(e) => updateBulkEmail(index, 'subject', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Email subject"
                        disabled={isSendingBulk}
                      />
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        HTML Content <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={email.html}
                        onChange={(e) => updateBulkEmail(index, 'html', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        placeholder="<h1>Hello</h1><p>Your message here...</p>"
                        disabled={isSendingBulk}
                      />
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Plain Text (Optional)
                      </label>
                      <textarea
                        value={email.text}
                        onChange={(e) => updateBulkEmail(index, 'text', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        placeholder="Plain text version of your message"
                        disabled={isSendingBulk}
                      />
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={addBulkEmailRow}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors flex items-center justify-center space-x-2"
                  disabled={isSendingBulk}
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Another Email</span>
                </button>
              </div>
            </div>

            {/* Footer Actions - Fixed */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-500">
                <span className="text-red-500">*</span> Required fields | Sending to {bulkEmails.filter(e => e.to && e.subject && e.html).length} recipients
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowBulkEmail(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                  disabled={isSendingBulk}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendBulkEmails}
                  disabled={isSendingBulk || bulkEmails.filter(e => e.to && e.subject && e.html).length === 0}
                  className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSendingBulk ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Bulk Emails</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailManager;
