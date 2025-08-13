import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import labelService from '@/services/api/labelService';
import { cn } from '@/utils/cn';

const predefinedColors = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
  '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
  '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#C026D3',
  '#EC4899', '#F43F5E', '#64748B', '#6B7280', '#374151'
];

const LabelManager = () => {
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingLabel, setEditingLabel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
    description: ''
  });

  useEffect(() => {
    loadLabels();
  }, []);

  const loadLabels = async () => {
    try {
      setError(null);
      const data = await labelService.getAll();
      setLabels(data);
    } catch (err) {
      setError('Failed to load labels');
      toast.error('Failed to load labels');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLabel = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Label name is required');
      return;
    }

    try {
      setIsCreating(true);
      const newLabel = await labelService.create(formData);
      setLabels([...labels, newLabel]);
      setFormData({ name: '', color: '#3B82F6', description: '' });
      toast.success('Label created successfully');
    } catch (err) {
      toast.error('Failed to create label');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateLabel = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Label name is required');
      return;
    }

    try {
      const updatedLabel = await labelService.update(editingLabel.Id, formData);
      setLabels(labels.map(l => l.Id === editingLabel.Id ? updatedLabel : l));
      setEditingLabel(null);
      setFormData({ name: '', color: '#3B82F6', description: '' });
      toast.success('Label updated successfully');
    } catch (err) {
      toast.error('Failed to update label');
    }
  };

  const handleEditLabel = (label) => {
    setEditingLabel(label);
    setFormData({
      name: label.name,
      color: label.color,
      description: label.description || ''
    });
  };

  const handleDeleteLabel = async (labelId) => {
    if (!confirm('Are you sure you want to delete this label?')) return;

    try {
      await labelService.delete(labelId);
      setLabels(labels.filter(l => l.Id !== labelId));
      toast.success('Label deleted successfully');
    } catch (err) {
      toast.error('Failed to delete label');
    }
  };

  const cancelEdit = () => {
    setEditingLabel(null);
    setFormData({ name: '', color: '#3B82F6', description: '' });
  };

  const filteredLabels = labels.filter(label =>
    label.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (label.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;
  if (error && labels.length === 0) return <Error message={error} onRetry={loadLabels} />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Label Manager</h1>
        <p className="text-gray-600">Create and manage colored labels for organizing your issues.</p>
      </div>

      {/* Create/Edit Form */}
      <Card className="mb-8 p-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingLabel ? 'Edit Label' : 'Create New Label'}
        </h2>
        <form onSubmit={editingLabel ? handleUpdateLabel : handleCreateLabel} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter label name"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                />
                <Badge 
                  style={{ backgroundColor: formData.color, color: '#fff' }}
                  className="px-3 py-1"
                >
                  Preview
                </Badge>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description"
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Colors
            </label>
            <div className="flex flex-wrap gap-2">
              {predefinedColors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 cursor-pointer transition-transform hover:scale-110",
                    formData.color === color ? "border-gray-800 scale-110" : "border-gray-300"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={isCreating}
              className="bg-primary hover:bg-primary/90"
            >
              {isCreating ? (
                <>
                  <ApperIcon name="Loader2" className="animate-spin mr-2" size={16} />
                  Creating...
                </>
              ) : editingLabel ? 'Update Label' : 'Create Label'}
            </Button>
            {editingLabel && (
              <Button 
                type="button" 
                variant="outline"
                onClick={cancelEdit}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <ApperIcon name="Search" className="absolute left-3 top-3 text-gray-400" size={16} />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search labels..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Labels List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Labels ({filteredLabels.length})
        </h2>
        
        {filteredLabels.length === 0 ? (
          <Empty
            icon="Tag"
            title="No labels found"
            description={searchTerm ? "No labels match your search criteria." : "Create your first label to get started."}
          />
        ) : (
          <div className="grid gap-4">
            {filteredLabels.map(label => (
              <Card key={label.Id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Badge 
                      style={{ backgroundColor: label.color, color: '#fff' }}
                      className="px-3 py-1 font-medium"
                    >
                      <ApperIcon name="Tag" size={12} className="mr-1" />
                      {label.name}
                    </Badge>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{label.name}</h3>
                      {label.description && (
                        <p className="text-sm text-gray-600 mt-1">{label.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditLabel(label)}
                    >
                      <ApperIcon name="Edit" size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteLabel(label.Id)}
                      className="text-error hover:text-error hover:bg-error/10"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LabelManager;