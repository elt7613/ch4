import IntroVideo from './introVideo';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './home';
import Chapter_1 from './Chapters/chapter_1';
import Test from './Chapters/test';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<IntroVideo />} />
          <Route path='/home' element={<Home/>} />
          <Route path="/chapter-1" element={<Chapter_1/>} />
          <Route path='/test' element={<Test/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;