import React, { useEffect, useState } from "react";
import "./FilterPrice.css";
import SearchableSelect from "./SearchableSelect";

function MandiFilter() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [stateVal, setStateVal] = useState("");
    const [district, setDistrict] = useState("");
    const [market, setMarket] = useState("");
    const [commodity, setCommodity] = useState("");

    const [result, setResult] = useState([]);
    const [validationError, setValidationError] = useState("");

    // 🔥 Load data
 useEffect(() => {
  setLoading(true);

  fetch("http://localhost:5000/api/data")
    .then(res => res.json())
    .then(data => {
      console.log("DATA:", data);

      setData(data);

      // 🔥 IMPORTANT
      setLoading(false);
    })
    .catch(err => {
      console.error("ERROR:", err);

      // 🔥 EVEN ON ERROR
      setLoading(false);
    });

}, []);
    // 🔹 Get unique values - filter out undefined/null
    const getUnique = (key, arr) => {
        return [...new Set(arr.map(item => item[key]).filter(Boolean))].sort();
    };


    const stateMap = {};
    data.forEach(item => {
        if (!stateMap[item.state]) stateMap[item.state] = [];
        stateMap[item.state].push(item);
    });

    stateMap[stateVal]

    // 🔥 FILTER ON GO BUTTON
    const handleSearch = () => {
        // 🔍 VALIDATION CHECK
        if (!stateVal || !district || !market || !commodity) {
            const missing = [];
            if (!stateVal) missing.push("State");
            if (!district) missing.push("District");
            if (!market) missing.push("Market");
            if (!commodity) missing.push("Commodity");
            
            setValidationError(`❌ Please select: ${missing.join(", ")}`);
            setResult([]);
            return;
        }

        setValidationError("");
        let temp = data;

        if (stateVal) temp = temp.filter(d => d.state === stateVal);
        if (district) temp = temp.filter(d => d.district === district);
        if (market) temp = temp.filter(d => d.market === market);
        if (commodity) temp = temp.filter(d => d.commodity === commodity);

        setResult(temp);
    };

    // 🔥 RESET
    const handleReset = () => {
        setStateVal("");
        setDistrict("");
        setMarket("");
        setCommodity("");
        setResult([]);
        setValidationError("");
    };

    const proTips = [
        "💡 Pro Tip: Select State first to see available districts",
        "🎯 Pro Tip: Market prices vary by location - compare prices across markets",
        "📊 Pro Tip: Check commodity prices during harvest season for best deals",
        "🔍 Pro Tip: Filter by multiple commodities to find best price trends"
    ];
    
    const [tipIndex, setTipIndex] = useState(0);

    return (
        <div className="mandi-container">
           
            <h2 className="title">🌾 Mandi Price Finder</h2>

            {loading && <p className="loading-text">⏳ Loading data...</p>}
            {error && <p className="error-text">❌ Error: {error}</p>}

            <div className="filter-box">

                {/* STATE */}
                <select
                    value={stateVal}
                    onChange={(e) => {
                        setStateVal(e.target.value);
                        setDistrict("");
                        setMarket("");
                        setCommodity("");
                    }}
                    disabled={loading || data.length === 0}
                >
                    <option value="">Select State</option>
                    {data.length > 0 && getUnique("state", data).map((s, i) => (
                        <option key={i} value={s}>{s}</option>
                    ))}
                </select>
                

                {/* DISTRICT */}
                <select
                    value={district}
                    onChange={(e) => {
                        setDistrict(e.target.value);
                        setMarket("");
                        setCommodity("");
                    }}
                    disabled={!stateVal}
                >
                    <option value="">Select District</option>
                    {stateVal && getUnique(
                        "district",
                        data.filter(d => d.state === stateVal)
                    ).map((d, i) => (
                        <option key={i} value={d}>{d}</option>
                    ))}
                </select>

                {/* MARKET */}
                <select
                    value={market}
                    onChange={(e) => {
                        setMarket(e.target.value);
                        setCommodity("");
                    }}
                    disabled={!district}
                >
                    <option value="">Select Market</option>
                    {district && getUnique(
                        "market",
                        data.filter(d => d.state === stateVal && d.district === district)
                    ).map((m, i) => (
                        <option key={i} value={m}>{m}</option>
                    ))}
                </select>

                {/* COMMODITY */}
                <select
                    value={commodity}
                    onChange={(e) => setCommodity(e.target.value)}
                    disabled={!market}
                >
                    <option value="">Select Commodity</option>
                    {market && getUnique(
                        "commodity",
                        data.filter(d => d.state === stateVal && d.district === district && d.market === market)
                    ).map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                    ))}
                </select>

                {/* BUTTONS */}
                <button className="go-btn" onClick={handleSearch}>
                    ⚡ Go
                </button>

                <button className="reset-btn" onClick={handleReset}>
                    Reset
                </button>
            </div>

            {/* VALIDATION ERROR */}
            {validationError && (
                <div className="validation-error">
                    {validationError}
                </div>
            )}

            {/* RESULT */}
            <div className="result-grid">
                {result.length === 0 ? (
                    <p className="no-data">No data found</p>
                ) : (
                    <>
                        <div className="table-header">
                            <div className="col col-commodity">🌾 Crop</div>
                            <div className="col col-price">MSP (Rs./Quintal)</div>
                            <div className="col col-state">📍 State</div>
                            <div className="col col-market">🏪 Market</div>
                            <div className="col col-market">🏘️ District</div>
                            <div className="col col-minprice">📉 Min Price</div>
                            <div className="col col-maxprice">📈 Max Price</div>
                        </div>
                        {result.slice(0, 20).map((item, i) => (
                            <div key={i} className="mandi-card">
                                <div className="col col-commodity">{item.commodity}</div>
                                <div className="col col-price">₹ {item.modal_price}</div>
                                <div className="col col-state">{item.state}</div>
                                <div className="col col-market">{item.market}</div>
                                <div className="col col-market">{item.district}</div>
                                <div className="col col-minprice">₹ {item.min_price}</div>
                                <div className="col col-maxprice">₹ {item.max_price}</div>
                            </div>
                        ))}
                        
                    </>
                )}
            </div>
            
            <div>
                 {/* PRO TIPS */}
            <div className="pro-tips-section">
                <div className="pro-tip-card">
                    {proTips[tipIndex]}
                </div>
                <div className="tip-dots">
                    {proTips.map((_, i) => (
                        <button 
                            key={i} 
                            className={`dot ${i === tipIndex ? 'active' : ''}`}
                            onClick={() => setTipIndex(i)}
                        />
                    ))}
                </div>
            </div>

            </div>
            
        </div>
        
    );
}

export default MandiFilter;