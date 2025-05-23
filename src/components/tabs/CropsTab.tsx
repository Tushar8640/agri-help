import React from 'react';
import { LineChart, BarChart3, CloudRain, Droplets, Thermometer, Sun } from 'lucide-react';
import { Project } from '../../context/ProjectContext';

interface CropsTabProps {
  project: Project;
}

const CropsTab: React.FC<CropsTabProps> = ({ project }) => {
  const cropImages: {[key: string]: string} = {
    Wheat: 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    Corn: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    Vegetables: 'https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    Soybean: 'https://images.pexels.com/photos/1459331/pexels-photo-1459331.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };

  // Mock crop data
  const cropData = {
    plantingDate: new Date(project.startDate).toLocaleDateString(),
    expectedHarvestDate: project.endDate 
      ? new Date(project.endDate).toLocaleDateString() 
      : 'Not set',
    variety: project.cropType === 'Wheat' ? 'Winter Wheat' : 
             project.cropType === 'Corn' ? 'Sweet Corn' :
             project.cropType === 'Vegetables' ? 'Tomatoes' : 'Conventional',
    seedRate: project.cropType === 'Wheat' ? '150 kg/ha' :
              project.cropType === 'Corn' ? '25 kg/ha' :
              project.cropType === 'Vegetables' ? '2 kg/ha' : '90 kg/ha',
    fertilizer: project.cropType === 'Wheat' ? 'NPK 20-10-10' :
                project.cropType === 'Corn' ? 'NPK 15-15-15' :
                project.cropType === 'Vegetables' ? 'Organic compost' : 'NPK 10-20-20',
    pestControl: project.cropType === 'Vegetables' ? 'Organic (neem oil)' : 'Standard IPM protocol',
    soilType: 'Loam',
    previousCrop: 'Fallow',
    rotationPlan: '3-year rotation'
  };

  // Mock growing conditions
  const growingConditions = [
    { 
      name: 'Temperature', 
      value: '15-25°C', 
      icon: <Thermometer className="h-5 w-5 text-amber-500" />,
      optimal: true 
    },
    { 
      name: 'Water Requirements', 
      value: 'Moderate', 
      icon: <Droplets className="h-5 w-5 text-blue-500" />,
      optimal: project.weather.forecast !== 'Rainy' 
    },
    { 
      name: 'Sunlight', 
      value: 'Full sun', 
      icon: <Sun className="h-5 w-5 text-yellow-500" />,
      optimal: project.weather.forecast !== 'Cloudy' 
    },
    { 
      name: 'Weather Risk', 
      value: project.weather.risk, 
      icon: <CloudRain className="h-5 w-5 text-blue-500" />,
      optimal: project.weather.risk === 'Low' 
    }
  ];

  // Mock crop timeline stages
  const cropStages = [
    { name: 'Planting', completed: true, date: project.startDate },
    { name: 'Germination', completed: project.progress >= 15, date: '2024-10-05' },
    { name: 'Vegetative Growth', completed: project.progress >= 40, date: '2024-11-10' },
    { name: 'Flowering', completed: project.progress >= 60, date: '2024-12-15' },
    { name: 'Fruit Development', completed: project.progress >= 80, date: '2025-01-20' },
    { name: 'Harvest', completed: project.status === 'Harvested', date: project.endDate || '2025-02-25' }
  ];

  return (
    <div className="space-y-8">
      {/* Crop Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Crop Information</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Variety</div>
              <div className="font-semibold text-gray-800">{cropData.variety}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Soil Type</div>
              <div className="font-semibold text-gray-800">{cropData.soilType}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Seed Rate</div>
              <div className="font-semibold text-gray-800">{cropData.seedRate}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Planting Date</div>
              <div className="font-semibold text-gray-800">{cropData.plantingDate}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Fertilizer</div>
              <div className="font-semibold text-gray-800">{cropData.fertilizer}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Pest Control</div>
              <div className="font-semibold text-gray-800">{cropData.pestControl}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Previous Crop</div>
              <div className="font-semibold text-gray-800">{cropData.previousCrop}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Rotation Plan</div>
              <div className="font-semibold text-gray-800">{cropData.rotationPlan}</div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Growing Conditions</h3>
          <div className="grid grid-cols-2 gap-4">
            {growingConditions.map((condition, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center text-sm text-gray-500">
                    {condition.icon}
                    <span className="ml-1">{condition.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    condition.optimal 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {condition.optimal ? 'Optimal' : 'Suboptimal'}
                  </span>
                </div>
                <div className="font-semibold text-gray-800">{condition.value}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Crop Image</h3>
          <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm h-64 bg-gray-100">
            {cropImages[project.cropType] ? (
              <img 
                src={cropImages[project.cropType]} 
                alt={project.cropType} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                No image available
              </div>
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Growth Timeline</h3>
          <div className="space-y-4">
            {cropStages.map((stage, index) => (
              <div key={index} className="relative">
                <div className="flex items-start">
                  <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    stage.completed 
                      ? 'bg-green-100 border-green-600 text-green-600' 
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                  } z-10`}>
                    {index + 1}
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-800">{stage.name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(stage.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {index < cropStages.length - 1 && (
                  <div className={`absolute top-8 left-4 w-0.5 h-10 -ml-px ${
                    stage.completed && cropStages[index + 1].completed
                      ? 'bg-green-600'
                      : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Expected Yield and Monitoring */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <LineChart className="h-5 w-5 inline mr-2 text-green-700" />
            Expected Yield
          </h3>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Projected Yield</div>
                <div className="text-xl font-semibold text-gray-800">
                  {project.status === 'Harvested' 
                    ? `${project.yield} ${project.yieldUnit}`
                    : project.cropType === 'Wheat' ? '4-5 tons/ha'
                    : project.cropType === 'Corn' ? '8-10 tons/ha'
                    : project.cropType === 'Vegetables' ? '25-30 tons/ha'
                    : '3-4 tons/ha'
                  }
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Quality Grade</div>
                <div className="text-xl font-semibold text-gray-800">
                  {project.status === 'Harvested' ? 'Good' : 'Predicted: Good'}
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-1">Yield Forecast Confidence</div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600 rounded-full"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-700">
              {project.status === 'Harvested' 
                ? `Final yield was ${project.yield} ${project.yieldUnit}, which is ${project.yield! > 100 ? 'above' : 'below'} the regional average.`
                : `Based on current growing conditions and crop development, the projected yield is ${
                  project.cropType === 'Wheat' ? '4-5 tons/ha'
                  : project.cropType === 'Corn' ? '8-10 tons/ha'
                  : project.cropType === 'Vegetables' ? '25-30 tons/ha'
                  : '3-4 tons/ha'
                }. This estimate will be refined as the crop develops further.`
              }
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <BarChart3 className="h-5 w-5 inline mr-2 text-green-700" />
            Crop Monitoring
          </h3>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm text-gray-500">Crop Health</div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">Good</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm text-gray-500">Moisture Level</div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">Adequate</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm text-gray-500">Pest Pressure</div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Moderate</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-600 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm text-gray-500">Weed Control</div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">Good</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded text-sm text-amber-800">
              <div className="font-medium mb-1">Monitoring Note:</div>
              <p>Recent field inspection shows some insect activity. Consider preventative treatment within the next 7 days.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropsTab;