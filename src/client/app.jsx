import React, { useState, useEffect } from 'react';
import './app.css';

export default function TransparenSeeApp() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    // Load categories on component mount
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const ga = new GlideAjax('DPRIPriceEngine');
      ga.addParam('sysparm_name', 'getCategories');
      ga.getXML(function(response) {
        const answer = response.responseXML.documentElement.getAttribute('answer');
        const data = JSON.parse(answer);
        if (data.success) {
          setCategories(data.categories);
        }
      });
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const ga = new GlideAjax('DPRIPriceEngine');
      ga.addParam('sysparm_name', 'searchMedicines');
      ga.addParam('sysparm_search_term', searchTerm);
      ga.addParam('sysparm_category', selectedCategory);
      ga.addParam('sysparm_limit', '20');
      
      ga.getXML(function(response) {
        const answer = response.responseXML.documentElement.getAttribute('answer');
        const data = JSON.parse(answer);
        if (data.success) {
          setSearchResults(data.medicines);
          logSearch(searchTerm, data.medicines.length);
        }
        setLoading(false);
      });
    } catch (error) {
      console.error('Error searching medicines:', error);
      setLoading(false);
    }
  };

  const logSearch = (term, count) => {
    try {
      const ga = new GlideAjax('DPRIPriceEngine');
      ga.addParam('sysparm_name', 'logSearch');
      ga.addParam('sysparm_search_term', term);
      ga.addParam('sysparm_search_type', 'drug_name');
      ga.addParam('sysparm_results_count', count.toString());
      ga.getXML(() => {});
    } catch (error) {
      console.error('Error logging search:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(price);
  };

  return (
    <div className="transparensee-app">
      <header className="app-header">
        <div className="hero-section">
          <h1 className="app-title">TransparenSee</h1>
          <p className="app-tagline">Pharmacy Price Transparency (DPRI) Concierge</p>
          <p className="app-subtitle">Bridging the gap between patients and affordable medicine</p>
        </div>
      </header>

      <main className="main-content">
        <section className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-inputs">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for medicine (e.g., Amoxicillin, Paracetamol)"
                className="search-input"
                required
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.sys_id} value={category.sys_id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button type="submit" disabled={loading} className="search-button">
                {loading ? 'Searching...' : 'Search DPRI'}
              </button>
            </div>
          </form>
        </section>

        {searchResults.length > 0 && (
          <section className="results-section">
            <h2>Search Results ({searchResults.length} found)</h2>
            <div className="results-grid">
              {searchResults.map(medicine => (
                <div key={medicine.sys_id} className="medicine-card">
                  <div className="medicine-header">
                    <h3 className="medicine-name">{medicine.generic_name}</h3>
                    {medicine.brand_name && (
                      <p className="brand-name">Brand: {medicine.brand_name}</p>
                    )}
                  </div>
                  
                  <div className="medicine-details">
                    <p><strong>Form:</strong> {medicine.form}</p>
                    <p><strong>Strength:</strong> {medicine.strength}</p>
                    <p><strong>Category:</strong> {medicine.category}</p>
                  </div>

                  <div className="price-info">
                    <div className="dpri-price">
                      <strong>DPRI Fair Price: {formatPrice(medicine.dpri_price)}</strong>
                    </div>
                    {medicine.hospital_avg_price > 0 && (
                      <div className="price-comparison">
                        <p>Hospital Average: {formatPrice(medicine.hospital_avg_price)}</p>
                        <div className="savings-badge">
                          Save {formatPrice(medicine.savings_amount)} ({medicine.savings_percentage}%)
                        </div>
                      </div>
                    )}
                  </div>

                  {medicine.description && (
                    <p className="medicine-description">{medicine.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {searchResults.length === 0 && searchTerm && !loading && (
          <section className="no-results">
            <p>No medicines found matching "{searchTerm}". Try a different search term.</p>
          </section>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>Data sourced from Philippine Department of Health DPRI 2025</p>
          <p>Always consult a licensed pharmacist or physician for medical advice</p>
        </div>
      </footer>
    </div>
  );
}