import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSearch, faTimes, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const FilterSidebar = ({ 
  categoryInfo, 
  selectedFilters, 
  toggleFilter, 
  clearAllFilters, 
  getActiveFilterCount 
}) => {
  const [searchTerms, setSearchTerms] = useState({
    brand: '',
    features: ''
  });
  
  const [collapsedSections, setCollapsedSections] = useState({
    brand: false,
    price: false,
    features: false
  });

  const handleSearchChange = (type, value) => {
    setSearchTerms(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const filterItems = (items, searchTerm) => {
    if (!searchTerm) return items;
    return items.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderFilterGroup = (title, type, items, hasSearch = false) => {
    const filteredItems = hasSearch ? filterItems(items, searchTerms[type] || '') : items;
    const isCollapsed = collapsedSections[type];
    const activeCount = selectedFilters[type]?.length || 0;

    return (
      <div className="filter-group">
        <div className="filter-group-header" onClick={() => toggleSection(type)}>
          <h3>
            {title}
            {activeCount > 0 && <span className="filter-count">({activeCount})</span>}
          </h3>
          <FontAwesomeIcon 
            icon={isCollapsed ? faChevronDown : faChevronUp} 
            className="collapse-icon"
          />
        </div>
        
        {!isCollapsed && (
          <>
            {hasSearch && (
              <div className="filter-search">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input
                  type="text"
                  placeholder={`Tìm ${title.toLowerCase()}...`}
                  value={searchTerms[type] || ''}
                  onChange={(e) => handleSearchChange(type, e.target.value)}
                />
                {searchTerms[type] && (
                  <button 
                    className="clear-search"
                    onClick={() => handleSearchChange(type, '')}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}
              </div>
            )}
            
            <ul className="filter-list">
              {filteredItems.length === 0 ? (
                <li className="no-results">Không tìm thấy kết quả</li>
              ) : (
                filteredItems.map((item, index) => (
                  <li key={index}>
                    <label>
                      <input 
                        type="checkbox" 
                        checked={selectedFilters[type]?.includes(item) || false}
                        onChange={() => toggleFilter(type, item)}
                      />
                      <span>{item}</span>
                    </label>
                  </li>
                ))
              )}
            </ul>
          </>
        )}
      </div>
    );
  };

  return (
    <aside className="filter-sidebar">
      <div className="filter-heading">
        <h2>
          <FontAwesomeIcon icon={faFilter} />
          Bộ lọc
        </h2>
        {getActiveFilterCount() > 0 && (
          <div className="filter-actions">
            <span className="active-filters">({getActiveFilterCount()} bộ lọc)</span>
            <button className="clear-filters" onClick={clearAllFilters}>
              <FontAwesomeIcon icon={faTimes} />
              Xóa tất cả
            </button>
          </div>
        )}
      </div>
      
      {/* Brand Filter */}
      {renderFilterGroup(
        'Thương hiệu', 
        'brand', 
        categoryInfo.filters.brands || [], 
        true
      )}
      
      {/* Price Range Filter */}
      {renderFilterGroup(
        'Mức giá', 
        'price', 
        categoryInfo.filters.priceRanges || []
      )}
      
      {/* Features Filter */}
      {renderFilterGroup(
        'Tính năng', 
        'features', 
        categoryInfo.filters.features || [], 
        true
      )}
      
      {/* Quick Clear Button */}
      {getActiveFilterCount() > 0 && (
        <div className="filter-quick-actions">
          <button className="btn-clear-all" onClick={clearAllFilters}>
            <FontAwesomeIcon icon={faTimes} />
            Xóa tất cả bộ lọc
          </button>
        </div>
      )}
    </aside>
  );
};

export default FilterSidebar;
