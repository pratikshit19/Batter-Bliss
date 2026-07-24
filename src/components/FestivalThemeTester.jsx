import { useState, useEffect } from 'react'
import { FESTIVALS, setTestFestivalTheme } from '../utils/festivalConfig'

export default function FestivalThemeTester() {
  const [selected, setSelected] = useState('rakhi')
  const [minimized, setMinimized] = useState(false)

  const handleSelect = (id) => {
    setSelected(id)
    setTestFestivalTheme(id)
  }

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-4 right-4 z-50 bg-brown-dark text-amber-300 border border-amber-400/40 px-3.5 py-2 rounded-full text-xs font-bold shadow-2xl hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
      >
        <span>🎨 Test Themes</span>
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-brown-dark/95 backdrop-blur-md border border-white/20 text-white rounded-2xl p-3 shadow-2xl max-w-xs text-xs">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/15">
        <div className="flex items-center gap-1.5 font-bold text-amber-300">
          <span>🎉</span>
          <span>Festival Theme Switcher</span>
        </div>
        <button
          onClick={() => setMinimized(true)}
          className="text-cream/60 hover:text-cream font-bold px-1.5 cursor-pointer"
        >
          ✕
        </button>
      </div>

      <p className="text-[0.68rem] text-cream/80 mb-2">Test how the entire website updates for different Indian festivals:</p>

      <div className="grid grid-cols-2 gap-1.5">
        <button
          onClick={() => handleSelect('rakhi')}
          className={`px-2.5 py-1.5 rounded-lg text-[0.7rem] font-bold text-left transition-colors cursor-pointer flex items-center gap-1 ${
            selected === 'rakhi' ? 'bg-purple-700 text-white shadow-xs' : 'bg-white/10 hover:bg-white/20 text-cream'
          }`}
        >
          <span>🪢</span>
          <span>Rakhi</span>
        </button>

        <button
          onClick={() => handleSelect('diwali')}
          className={`px-2.5 py-1.5 rounded-lg text-[0.7rem] font-bold text-left transition-colors cursor-pointer flex items-center gap-1 ${
            selected === 'diwali' ? 'bg-amber-600 text-white shadow-xs' : 'bg-white/10 hover:bg-white/20 text-cream'
          }`}
        >
          <span>🪔</span>
          <span>Diwali</span>
        </button>

        <button
          onClick={() => handleSelect('christmas')}
          className={`px-2.5 py-1.5 rounded-lg text-[0.7rem] font-bold text-left transition-colors cursor-pointer flex items-center gap-1 ${
            selected === 'christmas' ? 'bg-red-700 text-white shadow-xs' : 'bg-white/10 hover:bg-white/20 text-cream'
          }`}
        >
          <span>🎄</span>
          <span>Christmas</span>
        </button>

        <button
          onClick={() => handleSelect('holi')}
          className={`px-2.5 py-1.5 rounded-lg text-[0.7rem] font-bold text-left transition-colors cursor-pointer flex items-center gap-1 ${
            selected === 'holi' ? 'bg-pink-600 text-white shadow-xs' : 'bg-white/10 hover:bg-white/20 text-cream'
          }`}
        >
          <span>🎨</span>
          <span>Holi</span>
        </button>
      </div>

      <button
        onClick={() => handleSelect('none')}
        className={`w-full mt-2 py-1.5 rounded-lg text-[0.68rem] font-medium text-center transition-colors cursor-pointer ${
          selected === 'none' ? 'bg-white text-brown-dark font-bold' : 'bg-white/5 hover:bg-white/15 text-cream/70'
        }`}
      >
        🧁 Standard Theme (No Festival)
      </button>
    </div>
  )
}
