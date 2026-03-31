import { getMuscleColor, BODY_BASE_COLOR, HEAD_COLOR } from './muscleColor';

/**
 * Female Body Back View — Production-quality anatomical SVG.
 * Wider hips, narrower shoulders, ponytail hair silhouette.
 */
export default function FemaleBodyBack({ muscleData = {}, onMuscleClick }) {
  const fill = (id) => getMuscleColor(muscleData[id] || 0);
  const click = (id) => () => onMuscleClick && onMuscleClick(id);
  const enter = (e) => { e.currentTarget.style.filter = 'brightness(1.3)'; };
  const leave = (e) => { e.currentTarget.style.filter = 'none'; };
  const ms = { cursor: 'pointer', transition: 'fill 0.3s ease, filter 0.2s ease' };

  return (
    <svg viewBox="0 0 440 900" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">

      {/* Body outline */}
      <path d="M220,68 C242,68 258,54 258,34 C258,14 242,0 220,0 C198,0 182,14 182,34 C182,54 198,68 220,68 Z
        M220,76 C212,76 204,78 198,80 L186,84 C170,88 156,96 144,110 L132,130 L116,166 L100,204
        L88,234 L76,262 L66,288 L60,310 L58,326 L62,332 L70,334 L78,328
        L86,310 L96,282 L108,250 L118,222 L124,204 L128,190 L130,176
        L130,200 L128,236 L126,276 L124,316 L124,348 L124,374 L122,408
        L118,448 L114,490 L110,536 L106,578 L102,618 L98,648 L94,680
        L92,710 L92,738 L96,752 L104,760 L116,762 L126,756 L132,742
        L138,710 L144,674 L150,638 L156,604 L160,574 L164,548 L168,526
        L172,508 L178,490 L186,474 L196,460 L208,452 L220,450
        L232,452 L244,460 L254,474 L262,490 L268,508 L272,526 L276,548
        L280,574 L284,604 L290,638 L296,674 L302,710 L308,742 L314,756
        L324,762 L336,760 L344,752 L348,738 L348,710 L346,680 L342,648
        L338,618 L334,578 L330,536 L326,490 L322,448 L318,408 L316,374
        L316,348 L316,316 L314,276 L312,236 L310,200 L310,176 L312,190
        L316,204 L322,222 L332,250 L344,282 L354,310 L362,328 L370,334
        L378,332 L382,326 L380,310 L374,288 L364,262 L352,234 L340,204
        L324,166 L308,130 L296,110 C284,96 270,88 254,84 L242,80 C236,78 228,76 220,76 Z"
        fill="none" stroke="#ccc" strokeWidth="3" strokeLinejoin="round" opacity="0.5" />

      {/* Head */}
      <ellipse cx="220" cy="34" rx="34" ry="32" fill={HEAD_COLOR} />
      {/* Hair — ponytail for back view */}
      <path d="M188,24 C184,6 198,-4 220,-4 C242,-4 256,6 252,24
        C258,12 252,0 240,-4 C228,-8 212,-8 200,-4 C188,0 182,12 188,24 Z" fill="#3a3a3a" />
      <path d="M186,28 C184,40 186,52 190,60 L188,46 C186,36 186,30 188,24 Z" fill="#3a3a3a" opacity="0.7" />
      <path d="M254,28 C256,40 254,52 250,60 L252,46 C254,36 254,30 252,24 Z" fill="#3a3a3a" opacity="0.7" />
      {/* Neck */}
      <rect x="208" y="64" width="24" height="18" rx="5" fill={HEAD_COLOR} />

      {/* ===== TRAPS ===== */}
      <path data-muscle="traps"
        d="M196,82 L180,88 L164,98 L152,112 L146,132 L154,146 L170,156
           L190,164 L206,170 L216,172 L220,174 L224,172 L234,170 L250,164
           L270,156 L286,146 L294,132 L288,112 L276,98 L260,88 L244,82
           L232,78 L220,76 L208,78 Z"
        fill={fill('traps')} style={ms} onClick={click('traps')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* ===== REAR DELTS ===== */}
      <path data-muscle="rear_delts_left"
        d="M162,100 L148,114 L138,132 L134,150 L132,164 L140,172 L152,164
           L160,148 L164,132 L166,116 Z"
        fill={fill('rear_delts_left')} style={ms} onClick={click('rear_delts_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="rear_delts_right"
        d="M278,100 L292,114 L302,132 L306,150 L308,164 L300,172 L288,164
           L280,148 L276,132 L274,116 Z"
        fill={fill('rear_delts_right')} style={ms} onClick={click('rear_delts_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* ===== LATS ===== */}
      <path data-muscle="lats_left"
        d="M154,160 L146,184 L140,214 L138,248 L140,282 L144,312 L150,336
           L160,352 L174,360 L188,362 L198,356 L204,340 L208,312 L208,280
           L208,248 L204,216 L200,188 L196,174 L182,166 L168,162 Z"
        fill={fill('lats_left')} style={ms} onClick={click('lats_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="lats_right"
        d="M286,160 L294,184 L300,214 L302,248 L300,282 L296,312 L290,336
           L280,352 L266,360 L252,362 L242,356 L236,340 L232,312 L232,280
           L232,248 L236,216 L240,188 L244,174 L258,166 L272,162 Z"
        fill={fill('lats_right')} style={ms} onClick={click('lats_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* Spine */}
      <line x1="220" y1="174" x2="220" y2="390" stroke="#1a1a1a" strokeWidth="1.2" opacity="0.3" />

      {/* ===== TRICEPS ===== */}
      <path data-muscle="triceps_left"
        d="M134,168 L126,194 L120,224 L118,252 L118,268 L124,276 L134,272
           L142,254 L146,230 L148,206 L148,184 L142,172 Z"
        fill={fill('triceps_left')} style={ms} onClick={click('triceps_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="triceps_right"
        d="M306,168 L314,194 L320,224 L322,252 L322,268 L316,276 L306,272
           L298,254 L294,230 L292,206 L292,184 L298,172 Z"
        fill={fill('triceps_right')} style={ms} onClick={click('triceps_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* Forearms */}
      <path d="M118,274 L108,304 L98,340 L92,366 L88,384 L92,392
        L100,390 L108,372 L116,342 L124,310 L128,282 Z" fill={BODY_BASE_COLOR} />
      <path d="M322,274 L332,304 L342,340 L348,366 L352,384 L348,392
        L340,390 L332,372 L324,342 L316,310 L312,282 Z" fill={BODY_BASE_COLOR} />
      {/* Hands */}
      <path d="M86,388 L80,404 L78,412 L82,416 L90,412 L94,400 L92,390 Z" fill={BODY_BASE_COLOR} />
      <path d="M354,388 L360,404 L362,412 L358,416 L350,412 L346,400 L348,390 Z" fill={BODY_BASE_COLOR} />

      {/* ===== LOWER BACK ===== */}
      <path data-muscle="lower_back"
        d="M198,342 L190,368 L186,396 L188,420 L196,434 L210,442 L220,444
           L230,442 L244,434 L252,420 L254,396 L250,368 L242,342 L232,336
           L220,334 L208,336 Z"
        fill={fill('lower_back')} style={ms} onClick={click('lower_back')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* ===== GLUTES (wider for female) ===== */}
      <path data-muscle="glutes_left"
        d="M162,432 L150,460 L142,494 L140,526 L146,550 L160,564 L178,568
           L196,560 L210,544 L218,522 L220,498 L220,474 L214,454 L204,440 Z"
        fill={fill('glutes_left')} style={ms} onClick={click('glutes_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="glutes_right"
        d="M278,432 L290,460 L298,494 L300,526 L294,550 L280,564 L262,568
           L244,560 L230,544 L222,522 L220,498 L220,474 L226,454 L236,440 Z"
        fill={fill('glutes_right')} style={ms} onClick={click('glutes_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* Glute crease */}
      <path d="M220,444 L220,520" fill="none" stroke="#1a1a1a" strokeWidth="0.8" opacity="0.2" />

      {/* ===== HAMSTRINGS ===== */}
      <path data-muscle="hamstrings_left"
        d="M144,562 L136,592 L130,628 L128,660 L128,690 L134,708 L146,716
           L160,714 L172,706 L178,688 L180,660 L180,628 L178,596 L174,570 Z"
        fill={fill('hamstrings_left')} style={ms} onClick={click('hamstrings_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="hamstrings_right"
        d="M296,562 L304,592 L310,628 L312,660 L312,690 L306,708 L294,716
           L280,714 L268,706 L262,688 L260,660 L260,628 L262,596 L266,570 Z"
        fill={fill('hamstrings_right')} style={ms} onClick={click('hamstrings_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* Hamstring detail */}
      <path d="M156,584 C158,624 156,662 154,700" fill="none" stroke="#1a1a1a" strokeWidth="0.6" opacity="0.18" />
      <path d="M284,584 C282,624 284,662 286,700" fill="none" stroke="#1a1a1a" strokeWidth="0.6" opacity="0.18" />

      {/* Knee */}
      <path d="M128,714 C132,726 140,734 152,736 C164,738 174,734 178,726 C180,720 182,714 182,708"
        fill={BODY_BASE_COLOR} />
      <path d="M312,714 C308,726 300,734 288,736 C276,738 266,734 262,726 C260,720 258,714 258,708"
        fill={BODY_BASE_COLOR} />

      {/* ===== CALVES ===== */}
      <path data-muscle="calves_left"
        d="M128,742 L124,768 L122,798 L122,826 L124,850 L130,868 L140,878
           L152,880 L164,874 L170,856 L174,830 L174,800 L172,770 L170,746
           L166,738 L154,736 L140,738 Z"
        fill={fill('calves_left')} style={ms} onClick={click('calves_left')}
        onMouseEnter={enter} onMouseLeave={leave} />
      <path data-muscle="calves_right"
        d="M312,742 L316,768 L318,798 L318,826 L316,850 L310,868 L300,878
           L288,880 L276,874 L270,856 L266,830 L266,800 L268,770 L270,746
           L274,738 L286,736 L300,738 Z"
        fill={fill('calves_right')} style={ms} onClick={click('calves_right')}
        onMouseEnter={enter} onMouseLeave={leave} />

      {/* Feet */}
      <path d="M122,876 L116,888 L112,896 L118,900 L138,900 L156,898 L164,892
        L166,884 L160,876 L152,878" fill={BODY_BASE_COLOR} />
      <path d="M318,876 L324,888 L328,896 L322,900 L302,900 L284,898 L276,892
        L274,884 L280,876 L288,878" fill={BODY_BASE_COLOR} />
    </svg>
  );
}
