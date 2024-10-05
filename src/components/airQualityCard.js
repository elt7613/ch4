import React, { useEffect, useState } from 'react';
import '../CSS/components/airQualityCard.css';
import axios from 'axios';
import Footer from '../Footer';

const AirQualityCard = () => {
  //========  Air Quality ============
  const [airQuality, setAirQuality] = useState(0);
  const [cityName, setCityName] = useState("");
  const [ip, setIp] = useState("");
  const [co,setCo] = useState('');
  const [humidity,setHumidity] = useState('');
  const [no2,setNo2] = useState('');
  const [o3,setO3] = useState('');
  const [pressure,setPressure] = useState('');
  const [pm10,setPm10] = useState('');
  const [so2,setSo2] = useState('');

  const getData = async () => {
    const res = await axios.get("http://ipinfo.io/json");
    console.log(res.data);
    setCityName(res.data.city);
    setIp(res.data.ip);
  };

  const get_air_quality = async () => {
    if (cityName) {
      try {
        const res = await axios.get(`https://api.waqi.info/feed/${cityName}/?token=69ee0ffbf0fa061fc20e0198fca3354547141a55`);
        setAirQuality(res.data.data.aqi);
        setCo(res.data.data.iaqi.co.v);
        setHumidity(res.data.data.iaqi.h.v);
        setNo2(res.data.data.iaqi.no2.v);
        setO3(res.data.data.iaqi.o3.v);
        setPressure(res.data.data.iaqi.p.v);
        setPm10(res.data.data.iaqi.pm10.v);
        setSo2(res.data.data.iaqi.so2.v)
        console.log(res.data.data.iaqi.so2.v);
      } catch (error) {
        console.error("Error fetching air quality data:", error);
      }
    }
  };

  // Fetch city data on mount
  useEffect(() => {
    const fetchData = async () => {
      await getData();
    };
    fetchData();
  }, []);

  // Fetch air quality when cityName is updated
  useEffect(() => {
    if (cityName) {
      get_air_quality();
    }
  }, [cityName]);

  return (
    <>
      <div className="climate-grid">
        
        {/* First card */}
        <div className="climate-card">

          <div className='air-quantity'>
            {/* Air Quality */}
            <span className='quantity'>
                {airQuality}
              </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            	<path fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.8" d="M3 8h7a3 3 0 1 0-3-3M4 16h11a3 3 0 1 1-3 3M2 12h17a3 3 0 1 0-3-3" />
            </svg><br/>
            <span className='title'>
              Air Quality
            </span><br/>
            <span className='cityName'>
              {cityName}
            </span><br/>  
          </div>

          {/* Other gases */}
          <div className="other-gasses-container">
            <div className="card">
              <h3>
                {co}
              </h3>
              <span>CO</span>
            </div>

            <div className="card">
              <h3>
                {humidity}
              </h3>
              <span>Humidity</span>
            </div>

            <div className="card">
              <h3>
                {no2}
              </h3>
              <span>NO2</span>
            </div>

            <div className="card">
              <h3>
                {o3}
              </h3>
              <span>O3</span>
            </div>

            <div className="card">
              <h3>
                {pressure}
              </h3>
              <span>Pressure</span>
            </div>

            <div className="card">
              <h3>
                {pm10}
              </h3>
              <span>PM10</span>
            </div>

            <div className="card">
              <h3>
                {so2}
              </h3>
              <span>SO2</span>
            </div>
          </div>
      
          <div className="shine"></div>
          <div className="background">
            <div className="tiles">
              <div className="tile tile-1"></div>
              <div className="tile tile-2"></div>
              <div className="tile tile-3"></div>
              <div className="tile tile-4"></div>
      
              <div className="tile tile-5"></div>
              <div className="tile tile-6"></div>
              <div className="tile tile-7"></div>
              <div className="tile tile-8"></div>
      
              <div className="tile tile-9"></div>
              <div className="tile tile-10"></div>
            </div>
      
            <div className="line line-1"></div>
            <div className="line line-2"></div>
            <div className="line line-3"></div>
          </div>
        </div>
      </div>
      
      <label className="day-night">
        <input type="checkbox" checked />
        <div></div>
      </label>

      {/* ========= Section 3 Footer ========================= */}
      <Footer/>
    </>
  );
};

export default AirQualityCard;
