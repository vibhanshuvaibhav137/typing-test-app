import React, { useEffect, useState } from 'react';
import { useTyping } from '../../contexts/TypingContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Trophy, TrendingUp, Clock, Target } from 'lucide-react';

const TypingResults = () => {
  const { results, getResults } = useTyping();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      await getResults();
      setLoading(false);
    };

    fetchResults();
  }, [getResults]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Yet</h3>
            <p className="text-gray-600">Take your first typing test to see your results here!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate statistics
  const avgWpm = Math.round(results.reduce((sum, result) => sum + result.wpm, 0) / results.length);
  const avgAccuracy = Math.round(results.reduce((sum, result) => sum + result.accuracy, 0) / results.length);
  const bestWpm = Math.max(...results.map(result => result.wpm));
  const totalTests = results.length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Your Results</h1>
        <p className="text-gray-600">Track your typing progress and improvement over time</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-primary-600" />
              <span className="text-2xl font-bold text-primary-600">{avgWpm}</span>
            </div>
            <p className="text-sm text-gray-600">Average WPM</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{avgAccuracy}%</span>
            </div>
            <p className="text-sm text-gray-600">Average Accuracy</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">{bestWpm}</span>
            </div>
            <p className="text-sm text-gray-600">Best WPM</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{totalTests}</span>
            </div>
            <p className="text-sm text-gray-600">Tests Taken</p>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">WPM</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Accuracy</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Duration</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Performance</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={result._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(result.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-primary-600">{result.wpm}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-green-600">{result.accuracy}%</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{result.duration}s</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {result.wpm >= avgWpm ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Above Average
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Below Average
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TypingResults;