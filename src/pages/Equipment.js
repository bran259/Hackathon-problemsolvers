import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [works, setWorks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    dailyRate: ''
  });

  useEffect(() => {
    fetchEquipment();
    fetchWorks();
  }, []);

  const fetchEquipment = async () => {
    try {
      const data = await api.getEquipment();
      setEquipment(data);
    } catch (error) {
      console.error('Failed to fetch equipment:', error);
    }
  };

  const fetchWorks = async () => {
    try {
      const data = await api.getWorks();
      setWorks(data.filter(w => w.status === 'in_progress'));
    } catch (error) {
      console.error('Failed to fetch works:', error);
    }
  };

  const handleAssignment = async (equipmentId, workId, assignedTo) => {
    try {
      await api.updateEquipment(equipmentId, {
        status: workId ? 'assigned' : 'available',
        workId: workId || null,
        assignedTo: assignedTo || null
      });
      fetchEquipment();
    } catch (error) {
      console.error('Failed to update equipment:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createEquipment({
        ...formData,
        dailyRate: parseFloat(formData.dailyRate),
        status: 'available',
        assignedTo: null,
        workId: null
      });
      setFormData({ name: '', type: '', dailyRate: '' });
      setShowForm(false);
      fetchEquipment();
    } catch (error) {
      console.error('Failed to create equipment:', error);
    }
  };

  const handleDelete = async (equipmentId) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await api.deleteEquipment(equipmentId);
        fetchEquipment();
      } catch (error) {
        console.error('Failed to delete equipment:', error);
      }
    }
  };

  const equipmentTypes = ['heavy_machinery', 'machinery', 'transport', 'tools'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Equipment Management</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
              {equipment.filter(e => e.status === 'available').length} Available
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {equipment.filter(e => e.status === 'assigned').length} Assigned
            </span>
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            onClick={() => setShowForm(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Equipment</span>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Add New Equipment</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter equipment name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                  >
                    <option value="">Select Type</option>
                    {equipmentTypes.map(type => (
                      <option key={type} value={type}>{type.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Daily Rate ($)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.dailyRate}
                    onChange={(e) => setFormData({...formData, dailyRate: e.target.value})}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200">
                  Add Equipment
                </button>
                <button type="button" className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Equipment Inventory</h2>
        </div>
        <div className="overflow-x-auto">
          {equipment.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No equipment found</h3>
              <p className="mt-1 text-sm text-gray-500">Equipment inventory is empty.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {equipment.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        {item.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.status === 'assigned' ? (
                        <div>
                          <div className="font-medium">{item.assignedTo}</div>
                          <div className="text-xs text-gray-500">
                            {works.find(w => w.id === item.workId)?.title || 'Unknown Work'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${item.dailyRate}/day
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {item.status === 'available' ? (
                          <select
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onChange={(e) => {
                              const workId = parseInt(e.target.value);
                              const work = works.find(w => w.id === workId);
                              handleAssignment(item.id, workId, `Team for ${work?.title}`);
                            }}
                          >
                            <option value="">Assign to Work</option>
                            {works.map(work => (
                              <option key={work.id} value={work.id}>{work.title}</option>
                            ))}
                          </select>
                        ) : (
                          <button
                            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
                            onClick={() => handleAssignment(item.id, null, null)}
                          >
                            Release
                          </button>
                        )}
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
                          onClick={() => handleDelete(item.id)}
                          disabled={item.status === 'assigned'}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Equipment;