"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserContext from '../../context/UserContext'; // ✅ Correct for your file!
import { useContext } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { 
  UsersIcon, 
  BookOpenIcon, 
  DocumentTextIcon,
  AcademicCapIcon,
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline';

export default function AdminAnalytics() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 0,
      totalCourses: 0,
      totalContent: 0,
      totalInstructors: 0,
      totalRevenue: 0,
      monthlyGrowth: 0
    },
    userGrowth: [],
    courseStats: [],
    contentStats: [],
    revenueData: [],
    topCourses: [],
    topInstructors: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    if (!user || user.role !== 'Admin') {
      router.push('/login');
      return;
    }
    fetchAnalytics();
  }, [user, router, timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/analytics?timeRange=${timeRange}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">Platform performance and insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#29C7C9] focus:border-transparent"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.overview.totalUsers)}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {analytics.overview.monthlyGrowth > 0 ? (
                <TrendingUpIcon className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDownIcon className="w-4 h-4 text-red-500" />
              )}
              <span className={`ml-1 text-sm ${
                analytics.overview.monthlyGrowth > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(analytics.overview.monthlyGrowth)}% from last month
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpenIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.overview.totalCourses)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Content</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analytics.overview.totalContent)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AcademicCapIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.overview.totalRevenue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Growth Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Chart visualization would go here</p>
                <p className="text-sm text-gray-400">Using libraries like Chart.js or Recharts</p>
              </div>
            </div>
          </div>

          {/* Course Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Statistics</h3>
            <div className="space-y-4">
              {analytics.courseStats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{stat.category}</span>
                  <span className="text-sm font-medium text-gray-900">{stat.count} courses</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Courses */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Courses</h3>
            <div className="space-y-4">
              {analytics.topCourses.slice(0, 5).map((course, index) => (
                <div key={course._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{course.title}</p>
                      <p className="text-xs text-gray-500">{course.instructor?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{course.enrolledStudents?.length || 0} students</p>
                    <p className="text-xs text-gray-500">{formatCurrency(course.price || 0)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Instructors */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Instructors</h3>
            <div className="space-y-4">
              {analytics.topInstructors.slice(0, 5).map((instructor, index) => (
                <div key={instructor._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <img
                      className="w-8 h-8 rounded-full object-cover"
                      src={instructor.profile_picture || '/placeholder-avatar.jpg'}
                      alt={instructor.name}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{instructor.name}</p>
                      <p className="text-xs text-gray-500">{instructor.specialization}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{instructor.Courses_Created?.length || 0} courses</p>
                    <p className="text-xs text-gray-500">{instructor.totalStudents || 0} students</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Revenue chart visualization would go here</p>
              <p className="text-sm text-gray-400">Monthly revenue trends and projections</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 