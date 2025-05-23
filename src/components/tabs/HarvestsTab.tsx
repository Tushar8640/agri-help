import React, { useState } from 'react';
import { Calendar, BarChart3, Sparkles, Truck, Filter, Plus } from 'lucide-react';
import { Harvest } from '../../context/ProjectContext';
import { Button } from '../ui/button';

interface HarvestsTabProps {
  projectId: string;
  harvests: Harvest[];
  onAddHarvest: () => void;
}

const HarvestsTab: React.FC<HarvestsTabProps> = ({ projectId, harvests, onAddHarvest }) => {
  const [qualityFilter, setQualityFilter] = useState<string>('all');

  // Filter harvests
  const filteredHarvests = harvests.filter(harvest => {
    return qualityFilter === 'all' || harvest.quality === qualityFilter;
  });

  // Calculate total harvest
  const totalHarvest = harvests.reduce((sum, harvest) => sum + harvest.quantity, 0);
  const unit = harvests.length > 0 ? harvests[0].unit : 'ton';

  // Get quality distribution
  const qualityDistribution = {
    Excellent: harvests.filter(h => h.quality === 'Excellent').reduce((sum, h) => sum + h.quantity, 0),
    Good: harvests.filter(h => h.quality === 'Good').reduce((sum, h) => sum + h.quantity, 0),
    Average: harvests.filter(h => h.quality === 'Average').reduce((sum, h) => sum + h.quantity, 0),
    Poor: harvests.filter(h => h.quality === 'Poor').reduce((sum, h) => sum + h.quantity, 0)
  };

  // Get quality color
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Average': return 'bg-amber-100 text-amber-800';
      case 'Poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Harvests header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Harvest Records</h2>
          <p className="text-sm text-gray-600">
            Total: {totalHarvest} {unit} from {harvests.length} harvests
          </p>
        </div>
        <Button
          onClick={onAddHarvest}
          className=""
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Harvest
        </Button>
      </div>

      {/* Harvest summary and filter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 col-span-1 md:col-span-3">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Harvest Quality Distribution</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(qualityDistribution).map(([quality, amount]) => (
              amount > 0 && (
                <div key={quality} className="flex-1 min-w-[120px]">
                  <div className={`p-3 rounded-lg ${getQualityColor(quality).replace('text-', 'bg-').replace('100', '50')}`}>
                    <div className="text-xs text-gray-600 mb-1">{quality}</div>
                    <div className="font-semibold">{amount} {unit}</div>
                    <div className="text-xs mt-1">
                      {Math.round((amount / totalHarvest) * 100)}% of total
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Filter Harvests</h3>
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-1">By Quality</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={qualityFilter}
              onChange={(e) => setQualityFilter(e.target.value)}
            >
              <option value="all">All Qualities</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Harvests list */}
      {filteredHarvests.length === 0 ? (
        <div className="text-center py-8">
          <Truck className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No harvests found</h3>
          <p className="text-gray-600 mb-4">
            {harvests.length === 0
              ? "You haven't recorded any harvests for this project yet."
              : "Try adjusting your filters."}
          </p>
          <Button
            onClick={onAddHarvest}
            className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors"
          >
            <Plus className="h-4 w-4 inline mr-1" />
            Record Harvest
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHarvests.map(harvest => (
            <div
              key={harvest.id}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {new Date(harvest.date).toLocaleDateString()}
                    </span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getQualityColor(harvest.quality)}`}>
                      {harvest.quality}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-sm text-gray-500">Quantity</div>
                      <div className="font-semibold text-gray-800">{harvest.quantity} {harvest.unit}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Yield per ha</div>
                      <div className="font-semibold text-gray-800">4.2 {harvest.unit}/ha</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Moisture</div>
                      <div className="font-semibold text-gray-800">14%</div>
                    </div>
                  </div>
                  {harvest.notes && (
                    <div className="mt-3 text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {harvest.notes}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
                    <BarChart3 className="h-5 w-5" />
                  </Button>
                  <Button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
                    <Sparkles className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HarvestsTab;