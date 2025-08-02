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
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function AdminInstructors() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    specialization: '',
    experience: '',
    isVerified: false
  });

  useEffect(() => {
    if (!user || user.role !== 'Admin') {
      router.push('/login');
      return;
    }
    fetchInstructors();
  }, [user, router]);

  const fetchInstructors = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/instructors`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setInstructors(data.instructors || []);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
      toast.error('Failed to fetch instructors');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewInstructor = (instructor) => {
    setSelectedInstructor(instructor);
    setModalType('view');
    setShowModal(true);
  };

  const handleEditInstructor = (instructor) => {
    setSelectedInstructor(instructor);
    setFormData({
      name: instructor.name,
      email: instructor.email,
      bio: instructor.bio || '',
      specialization: instructor.specialization || '',
      experience: instructor.experience || '',
      isVerified: instructor.isVerified || false
    });
    setModalType('edit');
    setShowModal(true);
  };

  const handleDeleteInstructor = (instructor) => {
    setSelectedInstructor(instructor);
    setModalType('delete');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = modalType === 'edit' 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/instructors/${selectedInstructor._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/instructors`;

      const response = await fetch(url, {
        method: modalType === 'edit' ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(`Instructor ${modalType === 'edit' ? 'updated' : 'created'} successfully`);
        setShowModal(false);
        fetchInstructors();
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/instructors/${selectedInstructor._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        toast.success('Instructor deleted successfully');
        setShowModal(false);
        fetchInstructors();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Delete failed');
    }
  };

  const toggleVerification = async (instructorId, currentStatus) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/instructors/${instructorId}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ isVerified: !currentStatus })
      });

      if (response.ok) {
        toast.success(`Instructor ${!currentStatus ? 'verified' : 'unverified'} successfully`);
        fetchInstructors();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Operation failed');
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
              <h1 className="text-3xl font-bold text-gray-900">Instructor Management</h1>
              <p className="text-gray-600 mt-2">Manage all instructors on the platform</p>
            </div>
            <button
              onClick={() => {
                setModalType('create');
                setFormData({
                  name: '',
                  email: '',
                  bio: '',
                  specialization: '',
                  experience: '',
                  isVerified: false
                });
                setShowModal(true);
              }}
              className="bg-[#29C7C9] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#1FB5B7] transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Instructor</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search instructors by name, email, or specialization..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
            />
          </div>
        </div>

        {/* Instructors Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInstructors.map((instructor) => (
                  <tr key={instructor._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={instructor.profile_picture || '/placeholder-avatar.jpg'}
                            alt={instructor.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {instructor.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {instructor.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {instructor.specialization || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {instructor.experience || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {instructor.Courses_Created?.length || 0} courses
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          instructor.isVerified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {instructor.isVerified ? 'Verified' : 'Pending'}
                        </span>
                        <button
                          onClick={() => toggleVerification(instructor._id, instructor.isVerified)}
                          className={`p-1 rounded-full ${
                            instructor.isVerified 
                              ? 'text-red-600 hover:text-red-800' 
                              : 'text-green-600 hover:text-green-800'
                          }`}
                          title={instructor.isVerified ? 'Unverify' : 'Verify'}
                        >
                          {instructor.isVerified ? (
                            <XMarkIcon className="w-4 h-4" />
                          ) : (
                            <CheckIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewInstructor(instructor)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditInstructor(instructor)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteInstructor(instructor)}
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

        {filteredInstructors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No instructors found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {modalType === 'view' && selectedInstructor && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Instructor Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <img
                      className="h-16 w-16 rounded-full object-cover"
                      src={selectedInstructor.profile_picture || '/placeholder-avatar.jpg'}
                      alt={selectedInstructor.name}
                    />
                    <div>
                      <h3 className="text-lg font-medium">{selectedInstructor.name}</h3>
                      <p className="text-gray-600">{selectedInstructor.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedInstructor.bio || 'No bio available'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Specialization</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedInstructor.specialization || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Experience</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedInstructor.experience || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Courses Created</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedInstructor.Courses_Created?.length || 0}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedInstructor.isVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedInstructor.isVerified ? 'Verified' : 'Pending Verification'}
                    </span>
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
                  {modalType === 'edit' ? 'Edit Instructor' : 'Create New Instructor'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Specialization</label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Experience</label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isVerified"
                      checked={formData.isVerified}
                      onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                      className="h-4 w-4 text-[#29C7C9] focus:ring-[#29C7C9] border-gray-300 rounded"
                    />
                    <label htmlFor="isVerified" className="ml-2 block text-sm text-gray-900">
                      Verified Instructor
                    </label>
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

            {modalType === 'delete' && selectedInstructor && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Delete Instructor</h2>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "{selectedInstructor.name}"? This action cannot be undone.
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