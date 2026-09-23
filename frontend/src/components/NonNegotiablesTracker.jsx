import React, { useState, useEffect } from 'react';


const defaultFormState = {
  fajr: false, zuhr: false, asr: false, maghrib: false, isha: false, tahajjud: false, zikrDone: false,
  quranMinutes: '', bookName: '', bookPages: '', readingMinutes: '', exerciseMinutes: '',
  contentCreated: false, referralPlanDone: false, drsVisited: '', patientsReferred: '', instagramPosts: '', gmbReviews: '',
  outpatients: '', surgicalCasesDay: '', surgeriesPerformedSales: '', nonSurgicalInpatients: '',
  surgeriesPerformedDelivery: '', reviewsTaken: '', testimonialsTaken: '',
  finOpd: '', finLab: '', finPharmacy: '', finSurgical: '', finNonSurgical: '', learning: ''
};

const getTodayStr = () => new Date().toISOString().slice(0, 10);

export default function NonNegotiablesTracker() {
  const [entries, setEntries] = useState({});
  const [currentDate, setCurrentDate] = useState(getTodayStr());
  const [formData, setFormData] = useState(defaultFormState);
  const [statusMsg, setStatusMsg] = useState("");

  // Load from local storage on mount
  useEffect(() => {
  fetch('http://localhost:5012/api/entries')
    .then(res => res.json())
    .then(data => setEntries(data))
    .catch(e => console.error("Failed to load entries:", e));
}, []);

  // Update form data when current date or entries change
  useEffect(() => {
    setFormData(entries[currentDate] || defaultFormState);
  }, [currentDate, entries]);

  const handleDateChange = (e) => {
    setCurrentDate(e.target.value);
  };

  const shiftDate = (days) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + days);
    setCurrentDate(d.toISOString().slice(0, 10));
  };

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
  const payload = { date: currentDate, ...formData };
  
  try {
    await fetch('http://localhost:5012/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    setEntries(prev => ({ ...prev, [currentDate]: formData }));
    setStatusMsg("Saved ✓");
  } catch (e) {
    setStatusMsg("Could not save to database");
  }
  setTimeout(() => setStatusMsg(""), 2000);
};

  const handleDelete = async (dateToDelete) => {
  try {
    await fetch(`http://localhost:5012/api/entries/${dateToDelete}`, {
      method: 'DELETE'
    });
    
    const updatedEntries = { ...entries };
    delete updatedEntries[dateToDelete];
    setEntries(updatedEntries);
  } catch (e) {
    console.error("Failed to delete entry", e);
  }
};

  const getNum = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
  };

  // Sort dates descending for history table
  const sortedDates = Object.keys(entries).sort().reverse();

  return (
    <div className="tracker-container">
      <h1>🕌 Daily Non-Negotiables</h1>
      <div className="sub">Self · Marketing · Sales · Delivery · Finance · AI</div>

      <div className="dateRow">
        <button className="navBtn" onClick={() => shiftDate(-1)}>← Prev</button>
        <input type="date" value={currentDate} onChange={handleDateChange} />
        <button className="navBtn" onClick={() => shiftDate(1)}>Next →</button>
        <button className="navBtn" onClick={() => setCurrentDate(getTodayStr())}>Today</button>
      </div>

      {/* 1. SELF */}
      <div className="card">
        <h2>1. Self <span className="tag">Deen &amp; growth</span></h2>
        <div className="checks">
          {["fajr", "zuhr", "asr", "maghrib", "isha", "tahajjud", "zikrDone"].map(prayer => (
            <label className="chk" key={prayer}>
              <input type="checkbox" name={prayer} checked={!!formData[prayer]} onChange={handleInputChange} />
              {prayer.charAt(0).toUpperCase() + prayer.slice(1).replace("Done", " done")}
            </label>
          ))}
        </div>
        <div className="row">
          <div className="field"><label>Quran (minutes)</label><input type="number" min="0" name="quranMinutes" value={formData.quranMinutes} onChange={handleInputChange} /></div>
          <div className="field"><label>Book title</label><input type="text" name="bookName" value={formData.bookName} onChange={handleInputChange} /></div>
          <div className="field"><label>Pages read</label><input type="number" min="0" name="bookPages" value={formData.bookPages} onChange={handleInputChange} /></div>
          <div className="field"><label>Reading time (min)</label><input type="number" min="0" name="readingMinutes" value={formData.readingMinutes} onChange={handleInputChange} /></div>
          <div className="field"><label>Exercise (minutes)</label><input type="number" min="0" name="exerciseMinutes" value={formData.exerciseMinutes} onChange={handleInputChange} /></div>
        </div>
      </div>

      {/* 2. MARKETING */}
      <div className="card">
        <h2>2. Marketing</h2>
        <div className="checks">
          <label className="chk"><input type="checkbox" name="contentCreated" checked={!!formData.contentCreated} onChange={handleInputChange} />Content created</label>
          <label className="chk"><input type="checkbox" name="referralPlanDone" checked={!!formData.referralPlanDone} onChange={handleInputChange} />Referral planning done</label>
        </div>
        <div className="row">
          <div className="field"><label>Drs visited (BDM)</label><input type="number" min="0" name="drsVisited" value={formData.drsVisited} onChange={handleInputChange} /></div>
          <div className="field"><label>Patients referred</label><input type="number" min="0" name="patientsReferred" value={formData.patientsReferred} onChange={handleInputChange} /></div>
          <div className="field"><label>Instagram posts/actions</label><input type="number" min="0" name="instagramPosts" value={formData.instagramPosts} onChange={handleInputChange} /></div>
          <div className="field"><label>GMB reviews/actions</label><input type="number" min="0" name="gmbReviews" value={formData.gmbReviews} onChange={handleInputChange} /></div>
        </div>
      </div>

      {/* 3. SALES */}
      <div className="card">
        <h2>3. Sales</h2>
        <div className="row">
          <div className="field"><label>Total outpatients seen</label><input type="number" min="0" name="outpatients" value={formData.outpatients} onChange={handleInputChange} /></div>
          <div className="field"><label>Surgical cases (that day)</label><input type="number" min="0" name="surgicalCasesDay" value={formData.surgicalCasesDay} onChange={handleInputChange} /></div>
          <div className="field"><label>Surgeries performed</label><input type="number" min="0" name="surgeriesPerformedSales" value={formData.surgeriesPerformedSales} onChange={handleInputChange} /></div>
          <div className="field"><label>Non-surgical inpatients</label><input type="number" min="0" name="nonSurgicalInpatients" value={formData.nonSurgicalInpatients} onChange={handleInputChange} /></div>
        </div>
      </div>

      {/* 4. DELIVERY */}
      <div className="card">
        <h2>4. Delivery</h2>
        <div className="row">
          <div className="field"><label>Surgeries performed</label><input type="number" min="0" name="surgeriesPerformedDelivery" value={formData.surgeriesPerformedDelivery} onChange={handleInputChange} /></div>
          <div className="field"><label>Reviews taken</label><input type="number" min="0" name="reviewsTaken" value={formData.reviewsTaken} onChange={handleInputChange} /></div>
          <div className="field"><label>Testimonials taken</label><input type="number" min="0" name="testimonialsTaken" value={formData.testimonialsTaken} onChange={handleInputChange} /></div>
        </div>
      </div>

      {/* 5. FINANCE */}
      <div className="card">
        <h2>5. Finance <span className="tag">₹ / day</span></h2>
        <div className="row">
          <div className="field"><label>OPD reception</label><input type="number" min="0" name="finOpd" value={formData.finOpd} onChange={handleInputChange} /></div>
          <div className="field"><label>Lab</label><input type="number" min="0" name="finLab" value={formData.finLab} onChange={handleInputChange} /></div>
          <div className="field"><label>Pharmacy</label><input type="number" min="0" name="finPharmacy" value={formData.finPharmacy} onChange={handleInputChange} /></div>
          <div className="field"><label>Surgical cases</label><input type="number" min="0" name="finSurgical" value={formData.finSurgical} onChange={handleInputChange} /></div>
          <div className="field"><label>Non-surgical inpatients</label><input type="number" min="0" name="finNonSurgical" value={formData.finNonSurgical} onChange={handleInputChange} /></div>
        </div>
      </div>

      {/* 6. AI / LEARNING */}
      <div className="card">
        <h2>6. AI <span className="tag">Learning</span></h2>
        <div className="field">
          <label>What I learned today</label>
          <textarea name="learning" value={formData.learning} onChange={handleInputChange}></textarea>
        </div>
      </div>

      <div className="saveBar">
        <button className="saveBtn" onClick={handleSave}>Save Today's Entry</button>
        <div className="status">{statusMsg}</div>
      </div>

      <div className="card">
        <h2>History</h2>
        <div className="histWrap">
          <table>
            <thead>
              <tr>
                <th>Date</th><th>Prayers</th><th>Tahajjud</th><th>Quran min</th><th>Read min</th><th>Exercise min</th>
                <th>Drs visited</th><th>Referred</th><th>Outpatients</th><th>Surgeries</th>
                <th>OPD ₹</th><th>Total ₹</th><th></th>
              </tr>
            </thead>
            <tbody>
              {sortedDates.map(d => {
                const e = entries[d];
                const prayerCount = ["fajr", "zuhr", "asr", "maghrib", "isha"].filter(p => e[p]).length;
                const totalFin = getNum(e.finOpd) + getNum(e.finLab) + getNum(e.finPharmacy) + getNum(e.finSurgical) + getNum(e.finNonSurgical);
                return (
                  <tr key={d}>
                    <td>{d}</td>
                    <td>{prayerCount}/5</td>
                    <td>{e.tahajjud ? "✓" : "–"}</td>
                    <td>{e.quranMinutes || 0}</td>
                    <td>{e.readingMinutes || 0}</td>
                    <td>{e.exerciseMinutes || 0}</td>
                    <td>{e.drsVisited || 0}</td>
                    <td>{e.patientsReferred || 0}</td>
                    <td>{e.outpatients || 0}</td>
                    <td>{e.surgeriesPerformedSales || 0}</td>
                    <td>{e.finOpd || 0}</td>
                    <td>{totalFin}</td>
                    <td><button className="delBtn" onClick={() => handleDelete(d)}>delete</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}