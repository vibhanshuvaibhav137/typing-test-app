import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Zap, Target, BarChart3, Users, Award, Clock } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-primary-600" />,
      title: 'Real-time Tracking',
      description: 'Get instant feedback on your typing speed and accuracy as you type.'
    },
    {
      icon: <Target className="h-8 w-8 text-green-600" />,
      title: 'Accuracy Focus',
      description: 'Improve your accuracy with detailed error tracking and analysis.'
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: 'Progress Analytics',
      description: 'Track your improvement over time with comprehensive statistics.'
    },
    {
      icon: <Clock className="h-8 w-8 text-yellow-600" />,
      title: 'Timed Tests',
      description: 'Challenge yourself with various test durations and difficulty levels.'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '10,000+', icon: <Users className="h-6 w-6" /> },
    { label: 'Tests Completed', value: '50,000+', icon: <Award className="h-6 w-6" /> },
    { label: 'Average WPM Improvement', value: '25%', icon: <BarChart3 className="h-6 w-6" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Master Your{' '}
            <span className="text-primary-600">Typing Skills</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Improve your typing speed and accuracy with our comprehensive typing test platform. 
            Track your progress, compete with others, and become a typing master.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link to="/test">
                <Button size="lg" className="text-lg px-8 py-4">
                  Start Typing Test
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="text-lg px-8 py-4">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose TypingTest Pro?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform offers everything you need to improve your typing skills efficiently
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Join our growing community of typing enthusiasts
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4 text-primary-200">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Improve Your Typing?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start your typing journey today and see how much you can improve in just a few weeks.
          </p>
          {!isAuthenticated && (
            <Link to="/register">
              <Button size="lg" className="text-lg px-8 py-4">
                Sign Up Now - It's Free!
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;