import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useTyping } from '../../contexts/TypingContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Trophy, TrendingUp, Clock, Target, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const TypingResults = () => {
  const { results, getResults } = useTyping();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allResults, setAllResults] = useState([]);

  const ITEMS_PER_PAGE = 20;

  const fetchResults = useCallback(async (isRefresh = false, page = 1) => {
    if (!isRefresh && loading) return;
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const result = await getResults();
      console.log('Fetched results:', result);
      if (result.success) {
        const fetchedResults = result.data || [];
        setAllResults(fetchedResults);
        const pages = Math.ceil(fetchedResults.length / ITEMS_PER_PAGE);
        setTotalPages(pages);
        setCurrentPage(Math.min(Math.max(1, page), pages));
      } else {
        setError(result.error || 'Unknown error');
      }
    } catch (err) {
      setError('Failed to fetch results');
      console.error('Error fetching results:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getResults, loading]);

  useEffect(() => {
    fetchResults(true, 1);
  }, [location.pathname]);

  const getCurrentPageResults = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return allResults.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  const handlePrevious = () => currentPage > 1 && handlePageChange(currentPage - 1);
  const handleNext = () => currentPage < totalPages && handlePageChange(currentPage + 1);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, currentPage - half);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      if (end === totalPages) start = Math.max(1, end - maxVisiblePages + 1);
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const currentPageResults = getCurrentPageResults();
  const totalTests = allResults.length;
  const avgWpm = totalTests ? Math.round(allResults.reduce((sum, r) => sum + r.wpm, 0) / totalTests) : 0;
  const avgAccuracy = totalTests ? Math.round(allResults.reduce((sum, r) => sum + r.accuracy, 0) / totalTests) : 0;
  const bestWpm = totalTests ? Math.max(...allResults.map(r => r.wpm)) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Your Results</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your typing progress and improvement over time
            {totalTests > 0 && (
              <span className="block text-sm mt-1">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, totalTests)} of {totalTests} results
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => fetchResults(true, currentPage)}
          disabled={refreshing}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{avgWpm}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Average WPM</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">{avgAccuracy}%</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Average Accuracy</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{bestWpm}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Best WPM</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalTests}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tests Taken</p>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">
            Recent Tests (Page {currentPage} of {totalPages})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">WPM</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Accuracy</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Duration</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Performance</th>
                </tr>
              </thead>
              <tbody>
                {currentPageResults.map((result, index) => {
                  const date = new Date(result.createdAt);
                  const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                  return (
                    <tr key={result._id || index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400 dark:text-gray-500 w-6">#{globalIndex}</span>
                          <span>{date.toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300 text-sm">
                        {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-primary-600 dark:text-primary-400">{result.wpm}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-green-600 dark:text-green-400">{result.accuracy}%</span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{result.duration}s</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {result.wpm >= avgWpm ? (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full border dark:border-green-700">
                              Above Average
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded-full border dark:border-yellow-700">
                              Below Average
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-600 pt-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>
                
                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((pageNum, index) => (
                    <React.Fragment key={index}>
                      {pageNum === '...' ? (
                        <span className="px-3 py-2 text-gray-500 dark:text-gray-400">...</span>
                      ) : (
                        <button
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            pageNum === currentPage
                              ? 'bg-primary-600 text-white'
                              : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TypingResults;