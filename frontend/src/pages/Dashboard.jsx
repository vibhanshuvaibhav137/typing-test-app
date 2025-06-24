import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTyping } from '../contexts/TypingContext';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Play, BarChart3, Settings, Trophy, Clock, Target } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { results, getResults } = useTyping();

  useEffect(() => {
    getResults();
  }, [getResults]);

  // Calculate statistics
  const recentResults = results?.slice(0, 5) || [];
  const avgWpm = results?.length > 0 
    ? Math.round(results.reduce((sum, result) => sum + result.wpm, 0) / results.length)
    : 0;
  const avgAccuracy = results?.length > 0 
    ? Math.round(results.reduce((sum, result) => sum + result.accuracy, 0) / results.length)
    : 0;
  const bestWpm = results?.length > 0 
    ? Math.max(...results.map(result => result.wpm))
    : 0;
  const totalTests = results?.length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.fullName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Ready to improve your typing skills today?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/test">
            <CardContent className="p-6 text-center">
              <Play className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start New Test</h3>
              <p className="text-gray-600">Begin a typing test to improve your skills</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/results">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">View Results</h3>
              <p className="text-gray-600">Analyze your performance and progress</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Link to="/profile">
            <CardContent className="p-6 text-center">
              <Settings className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Settings</h3>
              <p className="text-gray-600">Update your account information</p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average WPM</p>
                <p className="text-2xl font-bold text-primary-600">{avgWpm}</p>
              </div>
              <Clock className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Accuracy</p>
                <p className="text-2xl font-bold text-green-600">{avgAccuracy}%</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Best WPM</p>
                <p className="text-2xl font-bold text-yellow-600">{bestWpm}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tests Taken</p>
                <p className="text-2xl font-bold text-blue-600">{totalTests}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Results */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Test Results</CardTitle>
            <Link to="/results">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentResults.length > 0 ? (
            <div className="space-y-4">
              {recentResults.map((result, index) => (
                <div key={result._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Duration: {result.duration}s
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-primary-600">{result.wpm}</p>
                      <p className="text-xs text-gray-600">WPM</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-green-600">{result.accuracy}%</p>
                      <p className="text-xs text-gray-600">Accuracy</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tests yet</h3>
              <p className="text-gray-600 mb-4">Take your first typing test to see results here</p>
              <Link to="/test">
                <Button>Start Your First Test</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;