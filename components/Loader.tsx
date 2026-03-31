'use client';
import { useEffect } from 'react';

export default function Loader() {
  useEffect(() => {
    let gone = false;
    function boot() {
      if (gone) return;
      gone = true;
      const ld = document.getElementById('ld');
      if (ld) ld.classList.add('out');
    }
    document.fonts.load('bold 1px "Bebas Neue"').then(boot).catch(boot);
    const t = setTimeout(boot, 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div id="ld">
      <div className="ldts">
        <div className="ldt" />
        <div className="ldt" />
        <div className="ldt" />
      </div>
    </div>
  );
}
