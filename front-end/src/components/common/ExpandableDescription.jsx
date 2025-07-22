// Componente para seção expandível de descrição
import React from 'react';
import Icon from './Icon';

const ExpandableDescription = ({ 
  title, 
  shortDescription, 
  fullDescription, 
  isExpanded, 
  onToggle 
}) => (
  <section className="max-w-full md:max-w-6xl mx-auto px-2 sm:px-4 md:px-8 mb-10">
    <div className="accommodation-info detail-section-row">
      <div className="detail-section desktop-description mb-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">{title}</h2>
        <div className="eva-3-view-more p-4 max-h-[300px] overflow-y-auto">
          <div className="description-content text-blue-900 text-base whitespace-pre-line">
            {isExpanded ? fullDescription : shortDescription}
          </div>
          <div
            className="view-more-btn mt-4 flex items-center cursor-pointer text-blue-700 font-semibold select-none"
            onClick={onToggle}
          >
            <span>{isExpanded ? "Ler menos" : "Ler mais"}</span>
            <Icon 
              name="chevronDown" 
              className={`ml-1 w-5 h-5 transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} 
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ExpandableDescription;
