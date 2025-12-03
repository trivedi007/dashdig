'use client';

import { useState, useEffect } from 'react';
import { FiKey, FiCopy, FiTrash2, FiAlertCircle, FiCheck, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  permissions: string[];
  lastUsed: string | null;
  createdAt: string;
}

interface ApiUsage {
  plan: string;
  limit: number;
  window: number;
  remainingInCurrentHour: number;
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [usage, setUsage] = useState<ApiUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'links:read',
    'links:write',
    'stats:read',
    'domains:read',
  ]);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://dashdig-production.up.railway.app';

  // Fetch API keys
  const fetchApiKeys = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE}/api/api-keys/v1`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
      toast.error('Failed to load API keys');
    }
  };

  // Fetch usage stats
  const fetchUsage = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE}/api/api-keys/v1/usage`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsage(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch usage:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchApiKeys(), fetchUsage()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Create new API key
  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for your API key');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE}/api/api-keys/v1`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newKeyName,
          permissions: selectedPermissions,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setNewlyCreatedKey(data.data.apiKey);
        toast.success('API key created successfully!');
        await fetchApiKeys();
        setNewKeyName('');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create API key');
      }
    } catch (error) {
      console.error('Failed to create API key:', error);
      toast.error('Failed to create API key');
    }
  };

  // Revoke API key
  const handleRevokeKey = async (keyId: string, keyName: string) => {
    if (!confirm(`Are you sure you want to revoke "${keyName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE}/api/api-keys/v1/${keyId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('API key revoked successfully');
        await fetchApiKeys();
      } else {
        toast.error('Failed to revoke API key');
      }
    } catch (error) {
      console.error('Failed to revoke API key:', error);
      toast.error('Failed to revoke API key');
    }
  };

  // Copy to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
          <p className="text-gray-600 mt-2">
            Manage your API keys for programmatic access to Dashdig
          </p>
        </div>

        {/* Usage Meter */}
        {usage && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">API Usage</h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">
                <span className="font-semibold">{usage.limit - usage.remainingInCurrentHour}</span> / {usage.limit}
              </span>
              <span className="text-sm text-gray-500 capitalize">
                {usage.plan} Plan
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-[#FF6B35] h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(((usage.limit - usage.remainingInCurrentHour) / usage.limit) * 100, 100)}%`,
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Requests this hour</p>
          </div>
        )}

        {/* Create New Key Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#FF6B35] text-white px-6 py-3 rounded-lg hover:bg-[#e55a28] transition-colors font-medium flex items-center gap-2"
          >
            <FiPlus /> Generate New API Key
          </button>
        </div>

        {/* API Keys List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your API Keys</h2>
          </div>

          {apiKeys.length === 0 ? (
            <div className="p-12 text-center">
              <FiKey className="mx-auto text-5xl text-gray-300 mb-4" />
              <p className="text-gray-600 mb-4">No API keys yet</p>
              <p className="text-sm text-gray-500">
                Create your first API key to start using the Dashdig API
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {apiKeys.map((key) => (
                <div key={key.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FiKey className="text-[#FF6B35] text-xl" />
                        <h3 className="text-lg font-semibold text-gray-900">{key.name}</h3>
                      </div>
                      <div className="ml-8 space-y-1">
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono text-gray-700">
                            {key.keyPrefix}
                          </code>
                        </div>
                        <p className="text-sm text-gray-600">
                          Created: {formatDate(key.createdAt)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Last used: {formatDate(key.lastUsed)}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {key.permissions.map((perm) => (
                            <span
                              key={perm}
                              className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                            >
                              {perm}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRevokeKey(key.id, key.name)}
                      className="text-red-600 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                      title="Revoke API key"
                    >
                      <FiTrash2 className="text-xl" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Key Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Create New API Key
              </h3>

              {!newlyCreatedKey ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Key Name
                    </label>
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      placeholder="e.g., Production Server"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Permissions
                    </label>
                    <div className="space-y-2">
                      {['links:read', 'links:write', 'stats:read', 'domains:read'].map((perm) => (
                        <label key={perm} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(perm)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPermissions([...selectedPermissions, perm]);
                              } else {
                                setSelectedPermissions(selectedPermissions.filter((p) => p !== perm));
                              }
                            }}
                            className="rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
                          />
                          <span className="ml-2 text-sm text-gray-700">{perm}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleCreateKey}
                      className="flex-1 bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a28] transition-colors font-medium"
                    >
                      Create Key
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateModal(false);
                        setNewKeyName('');
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <div className="flex items-start">
                      <FiAlertCircle className="text-yellow-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm text-yellow-800 font-semibold">
                          Save this key now!
                        </p>
                        <p className="text-sm text-yellow-700 mt-1">
                          This is the only time you&apos;ll see this key. Copy it and store it securely.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your API Key
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newlyCreatedKey}
                        readOnly
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                      />
                      <button
                        onClick={() => handleCopy(newlyCreatedKey)}
                        className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#e55a28] transition-colors"
                      >
                        {copied ? <FiCheck /> : <FiCopy />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewlyCreatedKey(null);
                      setNewKeyName('');
                    }}
                    className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Done
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Documentation Link */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">API Documentation</h3>
          <p className="text-gray-700 mb-4">
            View our comprehensive API documentation with code examples in multiple languages.
          </p>
          <a
            href="/docs#api-v1-reference"
            className="inline-block bg-[#FF6B35] text-white px-6 py-2 rounded-lg hover:bg-[#e55a28] transition-colors font-medium"
          >
            View API Docs
          </a>
        </div>
      </div>
    </div>
  );
}
