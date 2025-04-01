import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { UserProfile, UserProfileFormData, defaultUserProfile } from '../models/UserProfile';
import { fetchUserProfile, createUserProfile, updateUserProfile } from '../services/api';
import { toast } from 'react-hot-toast';
import { Save, Edit } from 'lucide-react';

const Dashboard = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfileFormData>(defaultUserProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const userProfile = await fetchUserProfile(user.id);
      
      if (userProfile) {
        setProfile(userProfile);
        setFormData({
          name: userProfile.name || '',
          age: userProfile.age?.toString() || '',
          gender: userProfile.gender || '',
          pastIllnesses: userProfile.pastIllnesses || ''
        });
      } else {
        // If no profile exists, prepare to create one with email from Clerk
        setFormData({
          ...defaultUserProfile,
          name: user.fullName || '',
        });
        setIsEditing(true); // Enable editing mode for new users
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load your profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const profileData: Omit<UserProfile, 'id'> = {
        name: formData.name,
        email: user.primaryEmailAddress?.emailAddress || '',
        age: parseInt(formData.age) || 0,
        gender: formData.gender,
        pastIllnesses: formData.pastIllnesses
      };

      let updatedProfile;
      if (profile?.id) {
        // Update existing profile
        updatedProfile = await updateUserProfile(user.id, profileData);
        toast.success('Profile updated successfully');
      } else {
        // Create new profile
        updatedProfile = await createUserProfile(user.id, profileData);
        toast.success('Profile created successfully');
      }

      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save your profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-center text-gray-500">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Your Profile</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="px-6 py-5">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      id="age"
                      min="0"
                      max="120"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      name="gender"
                      id="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="pastIllnesses" className="block text-sm font-medium text-gray-700">
                      Past Medical History
                    </label>
                    <textarea
                      name="pastIllnesses"
                      id="pastIllnesses"
                      rows={4}
                      value={formData.pastIllnesses}
                      onChange={handleInputChange}
                      placeholder="List any past illnesses, surgeries, or ongoing medical conditions"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (profile) {
                          // Reset form to current profile data
                          setFormData({
                            name: profile.name || '',
                            age: profile.age?.toString() || '',
                            gender: profile.gender || '',
                            pastIllnesses: profile.pastIllnesses || ''
                          });
                        } else {
                          // Reset to default
                          setFormData(defaultUserProfile);
                        }
                        setIsEditing(false);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={isLoading}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                  <p className="mt-1 text-lg text-gray-900">{profile?.name || 'Not provided'}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p className="mt-1 text-lg text-gray-900">{profile?.email || user?.primaryEmailAddress?.emailAddress || 'Not provided'}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Age</h4>
                  <p className="mt-1 text-lg text-gray-900">{profile?.age || 'Not provided'}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Gender</h4>
                  <p className="mt-1 text-lg text-gray-900">
                    {profile?.gender ? (
                      profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1).replace('_', ' ')
                    ) : (
                      'Not provided'
                    )}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Medical History</h4>
                  <p className="mt-1 text-lg text-gray-900 whitespace-pre-wrap">
                    {profile?.pastIllnesses || 'No medical history provided'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;