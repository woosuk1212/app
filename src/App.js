import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 루틴 상태
  const [routines, setRoutines] = useState([
    { id: 1, name: '공부 세션', minutes: 50, seconds: 0, type: 'study' },
    { id: 2, name: '짧은 휴식', minutes: 10, seconds: 0, type: 'rest' },
  ]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [remaining, setRemaining] = useState(routines[0].minutes * 60 + routines[0].seconds);
  const [isRunning, setIsRunning] = useState(false);

  const [newName, setNewName] = useState('');
  const [newMinutes, setNewMinutes] = useState('');
  const [newSeconds, setNewSeconds] = useState('');
  const [newType, setNewType] = useState('study');

  const [clock, setClock] = useState(new Date());
  const [meal, setMeal] = useState('');

  // 타이머
  useEffect(() => {
    if (routines.length === 0) return; // 루틴 없으면 실행 안함
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            handleNextRoutine();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, currentIdx, routines]);

  // 시계
  useEffect(() => {
    const clockTimer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // 루틴 변경 시 남은 시간 초기화
  useEffect(() => {
    if (routines[currentIdx]) {
      setRemaining(routines[currentIdx].minutes * 60 + routines[currentIdx].seconds);
    }
  }, [currentIdx, routines]);

  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function resetTimer() {
    if (routines[currentIdx]) {
      setIsRunning(false);
      setRemaining(routines[currentIdx].minutes * 60 + routines[currentIdx].seconds);
    }
  }

  function handleNextRoutine() {
    if (routines.length === 0) return;
    const next = (currentIdx + 1) % routines.length;
    setCurrentIdx(next);
    setRemaining(routines[next].minutes * 60 + routines[next].seconds);
    setIsRunning(false);
  }

  // 루틴 추가
  function addRoutine(e) {
    e.preventDefault();
    if (!newName || newMinutes === '') return;
    const newRoutine = {
      id: Date.now(),
      name: newName,
      minutes: parseInt(newMinutes, 10) || 0,
      seconds: parseInt(newSeconds, 10) || 0,
      type: newType,
    };
    setRoutines(prev => [...prev, newRoutine]);
    setNewName('');
    setNewMinutes('');
    setNewSeconds('');
    setNewType('study');
  }

  // 루틴 삭제
  function deleteRoutine(id, idx) {
    const newRoutines = routines.filter(r => r.id !== id);
    setRoutines(newRoutines);
    if (newRoutines.length === 0) return; // 0개이면 안내 화면 표시
    if (currentIdx >= newRoutines.length) setCurrentIdx(0);
  }

  // 랜덤 루틴
  const randomRoutines = [
    { name: '책 읽기', minutes: 0, seconds: 30, type: 'hobby' },
    { name: '조깅', minutes: 0, seconds: 20, type: 'sports' },
    { name: '명상', minutes: 0, seconds: 15, type: 'rest' },
    { name: '코딩 연습', minutes: 0, seconds: 40, type: 'study' },
    { name: '그림 그리기', minutes: 0, seconds: 25, type: 'hobby' },
  ];

  function addRandomRoutine() {
    const rand = randomRoutines[Math.floor(Math.random() * randomRoutines.length)];
    const newRoutine = { id: Date.now(), ...rand };
    setRoutines(prev => [...prev, newRoutine]);
  }

  // 랜덤 식사 메뉴
  const meals = ['김치볶음밥', '된장찌개', '샌드위치', '라면', '치킨', '피자', '초밥', '떡볶이'];
  function pickRandomMeal() {
    const randMeal = meals[Math.floor(Math.random() * meals.length)];
    setMeal(randMeal);
  }

  return (
    <div className="app-shell">
      {/* 좌측 사진 */}
      <div className="side-photo left" style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/sticker-left.jpg'})` }} />

      <main className="main">
        <header className="header">
          <div>
            <h1 className="title">RoutineUp</h1>
            <p className="subtitle">빈약한 시간들, 알차게 바꿔드립니다</p>
          </div>
          <div className="clock">{clock.toLocaleTimeString()}</div>
        </header>

        {routines.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '100px', color: '#d84315', fontWeight: 'bold' }}>
            루틴이 존재하지 않습니다.<br />
            페이지를 새로고침 해주세요.
          </div>
        ) : (
          <>
            {/* 현재 루틴 */}
            <section className="routine-box">
              <h2>현재 루틴</h2>
              <p className="current-name">
                {routines[currentIdx]?.name} ({routines[currentIdx]?.minutes}분 {routines[currentIdx]?.seconds}초)
              </p>
              <h3 className="timer">{formatTime(remaining)}</h3>

              <div className="controls">
                <button onClick={() => setIsRunning(prev => !prev)}>
                  {isRunning ? '일시정지' : '시작'}
                </button>
                <button onClick={resetTimer}>리셋</button>
                <button onClick={handleNextRoutine}>다음 루틴</button>
                <button onClick={addRandomRoutine}>랜덤 루틴 추가</button>
                <button onClick={pickRandomMeal}>오늘의 식사 메뉴</button>
              </div>

              {meal && <p style={{ marginTop: '10px', fontWeight: 'bold', color: '#d84315' }}>🍽 오늘의 메뉴: {meal}</p>}
            </section>

            {/* 루틴 목록 */}
            <section className="routine-list">
              <h2>루틴 목록</h2>
              <ul>
                {routines.map((r, i) => (
                  <li key={r.id}>
                    <span>{r.name} - {r.minutes}분 {r.seconds}초 ({r.type})</span>
                    <div>
                      <button onClick={() => { setCurrentIdx(i); resetTimer(); }}>선택</button>
                      <button onClick={() => deleteRoutine(r.id, i)}>삭제</button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* 루틴 추가 폼 */}
            <section className="routine-add">
              <h2>루틴 추가</h2>
              <form onSubmit={addRoutine}>
                <input type="text" placeholder="루틴 이름" value={newName} onChange={e => setNewName(e.target.value)} />
                <input type="number" placeholder="분 단위" value={newMinutes} onChange={e => setNewMinutes(e.target.value)} />
                <input type="number" placeholder="초 단위" value={newSeconds} onChange={e => setNewSeconds(e.target.value)} />
                <select value={newType} onChange={e => setNewType(e.target.value)}>
                  <option value="study">공부</option>
                  <option value="rest">휴식</option>
                  <option value="sports">운동</option>
                  <option value="hobby">취미</option>
                </select>
                <button type="submit">추가</button>
              </form>
            </section>
          </>
        )}
      </main>

      {/* 우측 사진 */}
      <div className="side-photo right" style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/sticker-right.jpg'})` }} />
    </div>
  );
}

export default App;