"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '../../context/UserContext';
import { useContext } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  BookOpenIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function AdminContent() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('notes');
  const [content, setContent] = useState({
    notes: [],
    books: [],
    papers: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    author: '',
    file: null
  });

  useEffect(() => {
    if (!user || user.role !== 'Admin') {
      router.push('/login');
      return;
    }
    fetchContent();
  }, [user, router, activeTab]);

  const fetchContent = async () => {
    try {
      const endpoints = {
        notes: '/api/v1/admin/notes',
        books: '/api/v1/admin/books',
        papers: '/api/v1/admin/papers'
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoints[activeTab]}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setContent(prev => ({
          ...prev,
          [activeTab]: data[activeTab] || []
        }));
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
      toast.error(`Failed to fetch ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredContent = content[activeTab].filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setModalType('view');
    setShowModal(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      subject: item.subject,
      author: item.author,
      file: null
    });
    setModalType('edit');
    setShowModal(true);
  };

  const handleDeleteItem = (item) => {
    setSelectedItem(item);
    setModalType('delete');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const endpoints = {
        notes: '/api/v1/admin/notes',
        books: '/api/v1/admin/books',
        papers: '/api/v1/admin/papers'
      };

      const url = modalType === 'edit' 
        ? `${process.env.NEXT_PUBLIC_API_URL}${endpoints[activeTab]}/${selectedItem._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}${endpoints[activeTab]}`;

      const response = await fetch(url, {
        method: modalType === 'edit' ? 'PUT' : 'POST',
        credentials: 'include',
        body: formDataToSend
      });

      if (response.ok) {
        toast.success(`${activeTab.slice(0, -1)} ${modalType === 'edit' ? 'updated' : 'created'} successfully`);
        setShowModal(false);
        fetchContent();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Operation failed');
    }
  };

  const confirmDelete = async () => {
    try {
      const endpoints = {
        notes: '/api/v1/admin/notes',
        books: '/api/v1/admin/books',
        papers: '/api/v1/admin/papers'
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoints[activeTab]}/${selectedItem._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        toast.success(`${activeTab.slice(0, -1)} deleted successfully`);
        setShowModal(false);
        fetchContent();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Delete failed');
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const getTabIcon = (tab) => {
    switch (tab) {
      case 'notes':
        return DocumentTextIcon;
      case 'books':
        return BookOpenIcon;
      case 'papers':
        return AcademicCapIcon;
      default:
        return DocumentTextIcon;
    }
  };

  const getTabTitle = (tab) => {
    switch (tab) {
      case 'notes':
        return 'Notes';
      case 'books':
        return 'Books';
      case 'papers':
        return 'Research Papers';
      default:
        return tab;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#29C7C9]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
              <p className="text-gray-600 mt-2">Manage notes, books, and research papers</p>
            </div>
            <button
              onClick={() => {
                setModalType('create');
                setFormData({
                  title: '',
                  description: '',
                  subject: '',
                  author: '',
                  file: null
                });
                setShowModal(true);
              }}
              className="bg-[#29C7C9] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#1FB5B7] transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add {getTabTitle(activeTab).slice(0, -1)}</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['notes', 'books', 'papers'].map((tab) => {
                const Icon = getTabIcon(tab);
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? 'border-[#29C7C9] text-[#29C7C9]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{getTabTitle(tab)}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${getTabTitle(activeTab).toLowerCase()}...`}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
            />
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Downloads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContent.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.description?.substring(0, 50)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.subject || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.author || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.downloads || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewItem(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditItem(item)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No {getTabTitle(activeTab).toLowerCase()} found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {modalType === 'view' && selectedItem && (
              <div>
                <h2 className="text-2xl font-bold mb-4">{getTabTitle(activeTab).slice(0, -1)} Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem.title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem.description}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem.subject || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Author</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem.author || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Date</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedItem.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Downloads</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedItem.downloads || 0}</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {(modalType === 'edit' || modalType === 'create') && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-4">
                  {modalType === 'edit' ? `Edit ${getTabTitle(activeTab).slice(0, -1)}` : `Create New ${getTabTitle(activeTab).slice(0, -1)}`}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Author</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">File</label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                      required={modalType === 'create'}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#29C7C9] text-white px-4 py-2 rounded-lg hover:bg-[#1FB5B7] transition-colors"
                  >
                    {modalType === 'edit' ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            )}

            {modalType === 'delete' && selectedItem && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Delete {getTabTitle(activeTab).slice(0, -1)}</h2>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "{selectedItem.title}"? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 