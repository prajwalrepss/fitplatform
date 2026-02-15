import { useState, useEffect } from 'react';
import { buddyAPI } from '../api';

export default function Buddy() {
    const [activeTab, setActiveTab] = useState('discover');
    const [discover, setDiscover] = useState([]);
    const [requests, setRequests] = useState([]);
    const [buddies, setBuddies] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [discoverRes, requestsRes, buddiesRes, profileRes] =
                await Promise.all([
                    buddyAPI.discover().catch(() => ({ data: { matches: [] } })),
                    buddyAPI.getRequests(),
                    buddyAPI.getBuddies(),
                    buddyAPI.getMyProfile().catch(() => ({ data: null })),
                ]);

            setDiscover(discoverRes.data.matches || []);
            setRequests(requestsRes.data.requests || []);
            setBuddies(buddiesRes.data.buddies || []);
            setProfile(profileRes.data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load data:', err);
            setLoading(false);
        }
    };

    const handleSendRequest = async (userId) => {
        try {
            await buddyAPI.sendRequest(userId);
            alert('Buddy request sent!');
            loadData();
        } catch (err) {
            alert('Failed to send request');
        }
    };

    const handleAccept = async (requestId) => {
        try {
            await buddyAPI.accept(requestId);
            loadData();
        } catch (err) {
            alert('Failed to accept request');
        }
    };

    const handleReject = async (requestId) => {
        try {
            await buddyAPI.reject(requestId);
            loadData();
        } catch (err) {
            alert('Failed to reject request');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-white text-xl">Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-6">GymBuddy</h1>

            {/* Tabs */}
            <div className="flex space-x-4 mb-6 border-b border-gray-700">
                {['discover', 'requests', 'buddies', 'profile'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 px-4 font-semibold capitalize transition-colors ${activeTab === tab
                                ? 'text-blue-500 border-b-2 border-blue-500'
                                : 'text-gray-400 hover:text-gray-300'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Discover Tab */}
            {activeTab === 'discover' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {discover.length === 0 ? (
                        <p className="text-gray-400 col-span-3 text-center">
                            No matches found. Create your profile to start discovering!
                        </p>
                    ) : (
                        discover.map((match) => (
                            <div key={match.userId} className="card">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-2xl">
                                        {match.displayName?.[0] || match.username?.[0] || '?'}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">
                                            {match.displayName || match.username || 'Anonymous'}
                                        </h3>
                                        <p className="text-sm text-blue-400 font-semibold">
                                            Match: {match.matchScore} pts
                                        </p>
                                    </div>
                                </div>

                                {match.bio && (
                                    <p className="text-gray-400 text-sm mb-3">{match.bio}</p>
                                )}

                                <div className="space-y-2 mb-4">
                                    {match.city && (
                                        <p className="text-sm text-gray-300">📍 {match.city}</p>
                                    )}
                                    {match.trainingStyle && (
                                        <p className="text-sm text-gray-300">
                                            💪 {match.trainingStyle.replace(/_/g, ' ')}
                                        </p>
                                    )}
                                    {match.gymTime && (
                                        <p className="text-sm text-gray-300">⏰ {match.gymTime}</p>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleSendRequest(match.userId)}
                                    className="btn-primary w-full"
                                >
                                    Send Request
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Requests Tab */}
            {activeTab === 'requests' && (
                <div className="space-y-4">
                    {requests.length === 0 ? (
                        <p className="text-gray-400 text-center">No pending requests</p>
                    ) : (
                        requests.map((request) => (
                            <div key={request._id} className="card flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-white">
                                        {request.senderUsername}
                                    </h3>
                                    {request.senderProfile && (
                                        <p className="text-sm text-gray-400">
                                            {request.senderProfile.city} •{' '}
                                            {request.senderProfile.experienceLevel}
                                        </p>
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleAccept(request._id)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleReject(request._id)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Buddies Tab */}
            {activeTab === 'buddies' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {buddies.length === 0 ? (
                        <p className="text-gray-400 col-span-3 text-center">
                            No buddies yet. Send some requests!
                        </p>
                    ) : (
                        buddies.map((buddy) => (
                            <div key={buddy.userId} className="card">
                                <h3 className="text-lg font-bold text-white mb-2">
                                    {buddy.profile?.displayName || buddy.username}
                                </h3>
                                {buddy.profile && (
                                    <div className="text-sm text-gray-400 space-y-1">
                                        {buddy.profile.city && <p>📍 {buddy.profile.city}</p>}
                                        {buddy.profile.goals && buddy.profile.goals.length > 0 && (
                                            <p>🎯 {buddy.profile.goals.join(', ')}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="card max-w-2xl">
                    <h2 className="text-xl font-bold text-white mb-4">Your Profile</h2>
                    {!profile ? (
                        <div>
                            <p className="text-gray-400 mb-4">
                                You haven't created a profile yet.
                            </p>
                            <p className="text-sm text-gray-500">
                                Use the /buddy/profile and /buddy/profile/details endpoints to
                                create your profile.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-400">Display Name</p>
                                <p className="text-white">{profile.displayName || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">City</p>
                                <p className="text-white">{profile.city || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Experience Level</p>
                                <p className="text-white capitalize">
                                    {profile.experienceLevel || 'Not set'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Bio</p>
                                <p className="text-white">{profile.bio || 'Not set'}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
