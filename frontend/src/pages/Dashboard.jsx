import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTyping } from '../contexts/TypingContext';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { 
  Play, 
  BarChart3, 
  Settings, 
  Trophy, 
  Clock, 
  Target, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Timer,
  Zap,
  X
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { results, getResults } = useTyping();
  
  // Filter and navigation state
  const [filters, setFilters] = useState({
    dateRange: '', // 'today', 'week', 'month', 'all'
    duration: '', // '15', '30', '60', '120', '300'
    minWpm: '',
    sortBy: 'date' // 'date', 'wpm', 'accuracy', 'duration'
  });
  const [currentPage, setCurrentPage] = useState(0);
  const RESULTS_PER_PAGE = 5;

  useEffect(() => {
    getResults();
  }, [getResults]);

  // Filter and sort results
  const filteredResults = useMemo(() => {
    if (!results || results.length === 0) return [];

    let filtered = [...results];

    // Date filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(result => new Date(result.createdAt) >= cutoffDate);
    }

    // Duration filter - Fixed to match actual saved durations
    if (filters.duration && filters.duration !== 'all') {
      const expectedDuration = parseInt(filters.duration);
      // Handle the off-by-one issue where durations are saved as 14, 29, 59, 119, 299
      const actualDurations = {
        15: [14, 15],
        30: [29, 30],
        60: [59, 60],
        120: [119, 120],
        300: [299, 300]
      };
      
      if (actualDurations[expectedDuration]) {
        filtered = filtered.filter(result => 
          actualDurations[expectedDuration].includes(result.duration)
        );
      } else {
        filtered = filtered.filter(result => result.duration === expectedDuration);
      }
    }

    // Min WPM filter
    if (filters.minWpm) {
      filtered = filtered.filter(result => result.wpm >= parseInt(filters.minWpm));
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'wpm':
          return b.wpm - a.wpm;
        case 'accuracy':
          return b.accuracy - a.accuracy;
        case 'duration':
          return b.duration - a.duration;
        case 'date':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [results, filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredResults.length / RESULTS_PER_PAGE);
  const startIndex = currentPage * RESULTS_PER_PAGE;
  const endIndex = startIndex + RESULTS_PER_PAGE;
  const currentPageResults = filteredResults.slice(startIndex, endIndex);
  
  // Calculate statistics from filtered results
  const avgWpm = filteredResults.length > 0 
    ? Math.round(filteredResults.reduce((sum, result) => sum + result.wpm, 0) / filteredResults.length)
    : 0;
  const avgAccuracy = filteredResults.length > 0 
    ? Math.round(filteredResults.reduce((sum, result) => sum + result.accuracy, 0) / filteredResults.length)
    : 0;
  const bestWpm = filteredResults.length > 0 
    ? Math.max(...filteredResults.map(result => result.wpm))
    : 0;
  const totalTests = filteredResults.length;

  // Navigation functions
  const navigateResults = (direction) => {
    if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(0); // Reset to first page when filters change
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      dateRange: '',
      duration: '',
      minWpm: '',
      sortBy: 'date'
    });
    setCurrentPage(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back, {user?.fullName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Ready to improve your typing skills today?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-primary-500/10 transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
          <Link to="/test">
            <CardContent className="p-6 text-center">
              <Play className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Start New Test</h3>
              <p className="text-gray-600 dark:text-gray-300">Begin a typing test to improve your skills</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
          <Link to="/results">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">View Results</h3>
              <p className="text-gray-600 dark:text-gray-300">Analyze your performance and progress</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-green-500/10 transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
          <Link to="/profile">
            <CardContent className="p-6 text-center">
              <Settings className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Profile Settings</h3>
              <p className="text-gray-600 dark:text-gray-300">Update your account information</p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average WPM</p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{avgWpm}</p>
              </div>
              <Clock className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Accuracy</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{avgAccuracy}%</p>
              </div>
              <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Best WPM</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{bestWpm}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tests Taken</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalTests}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section - Always Visible */}
      <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
              <Filter className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <span>Filter Results</span>
            </CardTitle>
            {(filters.dateRange || filters.duration || filters.minWpm || filters.sortBy !== 'date') && (
              <Button
                onClick={clearFilters}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <X className="h-3 w-3" />
                <span>Clear Filters</span>
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date Range
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
              </select>
            </div>

            {/* Duration Filter - Fixed values */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Timer className="h-4 w-4 inline mr-1" />
                Duration
              </label>
              <select
                value={filters.duration}
                onChange={(e) => handleFilterChange('duration', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Durations</option>
                <option value="15">15 seconds</option>
                <option value="30">30 seconds</option>
                <option value="60">60 seconds</option>
                <option value="120">120 seconds</option>
                <option value="300">300 seconds</option>
              </select>
            </div>

            {/* Min WPM Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Zap className="h-4 w-4 inline mr-1" />
                Min WPM
              </label>
              <input
                type="number"
                value={filters.minWpm}
                onChange={(e) => handleFilterChange('minWpm', e.target.value)}
                placeholder="Enter min WPM"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <BarChart3 className="h-4 w-4 inline mr-1" />
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="date">Date (Newest)</option>
                <option value="wpm">WPM (Highest)</option>
                <option value="accuracy">Accuracy (Highest)</option>
                <option value="duration">Duration (Longest)</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.dateRange || filters.duration || filters.minWpm || filters.sortBy !== 'date') && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {filters.dateRange && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 border dark:border-primary-700">
                    {filters.dateRange === 'today' ? 'Today' : 
                     filters.dateRange === 'week' ? 'Last Week' : 'Last Month'}
                  </span>
                )}
                {filters.duration && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border dark:border-blue-700">
                    {filters.duration}s duration
                  </span>
                )}
                {filters.minWpm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border dark:border-green-700">
                    Min {filters.minWpm} WPM
                  </span>
                )}
                {filters.sortBy !== 'date' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border dark:border-purple-700">
                    Sort by {filters.sortBy}
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Results with Navigation */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="dark:text-gray-100">
              Recent Test Results 
              {filteredResults.length > 0 && (
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                  ({filteredResults.length} total)
                </span>
              )}
            </CardTitle>
            <div className="flex items-center space-x-2">
              {totalPages > 1 && (
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => navigateResults('prev')}
                    disabled={currentPage === 0}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>
                  <span className="text-sm text-gray-600 dark:text-gray-400 px-2">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <Button
                    onClick={() => navigateResults('next')}
                    disabled={currentPage >= totalPages - 1}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <Link to="/results">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentPageResults.length > 0 ? (
            <div className="space-y-4">
              {currentPageResults.map((result, index) => (
                <div key={result._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center border dark:border-primary-700">
                      <span className="text-primary-600 dark:text-primary-400 font-semibold">#{startIndex + index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Duration: {result.duration}s • {new Date(result.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">{result.wpm}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">WPM</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-green-600 dark:text-green-400">{result.accuracy}%</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Accuracy</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {results?.length > 0 ? 'No results match your filters' : 'No tests yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {results?.length > 0 ? 'Try adjusting your filters to see more results' : 'Take your first typing test to see results here'}
              </p>
              {results?.length > 0 ? (
                <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
              ) : (
                <Link to="/test">
                  <Button>Start Your First Test</Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;