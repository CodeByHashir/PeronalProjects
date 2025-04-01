import React, { useState } from 'react';
import { TextAnalysisRequest, EntityType, AttributeType, ENTITY_TYPES, ATTRIBUTE_TYPES } from '../types';
import { MessageSquare, Loader2 } from 'lucide-react';

interface TextAnalysisFormProps {
  onSubmit: (request: TextAnalysisRequest) => Promise<void>;
  isLoading: boolean;
}

const TextAnalysisForm: React.FC<TextAnalysisFormProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');
  const [entity, setEntity] = useState<EntityType>('RESTAURANT');
  const [attribute, setAttribute] = useState<AttributeType>('GENERAL');
  const [ote, setOte] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit({
        text: text.trim(),
        entity,
        attribute: `${entity}#${attribute}`,
        ote: ote.trim() || undefined
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-4">
        <MessageSquare className="text-blue-600 w-6 h-6 mr-2" />
        <h2 className="text-xl font-semibold">Direct Text Analysis</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="review-text" className="block text-sm font-medium text-gray-700 mb-1">
            Review Text
          </label>
          <textarea
            id="review-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your review text here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="entity" className="block text-sm font-medium text-gray-700 mb-1">
              Entity
            </label>
            <select
              id="entity"
              value={entity}
              onChange={(e) => setEntity(e.target.value as EntityType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {ENTITY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="attribute" className="block text-sm font-medium text-gray-700 mb-1">
              Attribute
            </label>
            <select
              id="attribute"
              value={attribute}
              onChange={(e) => setAttribute(e.target.value as AttributeType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {ATTRIBUTE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="ote" className="block text-sm font-medium text-gray-700 mb-1">
            Opinion Target Expression (Optional)
          </label>
          <input
            type="text"
            id="ote"
            value={ote}
            onChange={(e) => setOte(e.target.value)}
            placeholder="e.g., pizza, service, ambiance"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !text.trim()}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              'Analyze Text'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TextAnalysisForm;